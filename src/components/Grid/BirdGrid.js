import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from './BirdGridForm';
import BirdGridFilter from './BirdGridFilter';
import { request, config, util, permission, arrayToHash } from 'utils';
import styles from './BirdGrid.less';
import BirdButton from '../Form/BirdButton';
import { DropdownRender, SwitchRender, DateTimeRender, MultiRender, ImageRender, FileRender, MoneyRender } from './render';
import { Pagination, Modal, Card, Popconfirm, message, Row, Col, Checkbox, Button, Divider, Spin, Popover } from 'antd';

class BirdGrid extends React.Component {
  constructor(props) {
    super(props);

    let gridOption = this.props.gridOption;
    let primaryKey = gridOption.primaryKey || gridOption.columns[0]['data'];
    let dataSource = gridOption.dataSource || [];
    let autoQuery = gridOption.autoQuery;
    if (typeof (autoQuery) === 'undefined') {
      autoQuery = true;
    }

    this.state = {
      columns: [],
      queryColumns: [],
      actions: [],
      pageIndex: 1,
      pageSize: gridOption.pageSize || 15,
      queryLoading: false,
      sortField: gridOption.sortField || primaryKey,
      sortDirection: gridOption.sortDirection || "desc",
      filterRules: gridOption.filterRules || [],
      gridDatas: {
        totalCount: dataSource.length,
        items: dataSource
      },
      formVisiable: false,
      formConfirmLoading: false,
      formWidth: gridOption.formWidth || 520,
      formOption: {
        saveUrl: "",
        fields: [],
        value: {}
      },
      customData: gridOption.customRules || [],
      sourceKeyMap: {},//dropdown与cascader类型key与data的hash映射

      primaryKey: primaryKey,//标识列名称
      tablePermission: {},

      checkedValues: [],
      autoQuery: autoQuery //页面渲染完成之后是否自动查询，默认为true
    };
  }

  /* 初始化渲染执行之前执行 */
  componentDidMount() {
    let gridOption = this.props.gridOption;
    //初始化权限
    let p = gridOption.permission;
    let tp = {};
    if (typeof (p) === 'string') {
      tp = {
        add: p + ':add',
        edit: p + ':edit',
        delete: p + ':delete'
      }
    } else {
      tp = p || {};
    }

    let url = gridOption.url;
    let columns = [], queryColumns = [];
    let sourceKeyMap = {};
    for (let col of gridOption.columns) {
      if (col.type === 'richtext' && this.state.formWidth === 520) {
        this.setState({ formWidth: 800 });
      }
      if (col.query) {
        queryColumns.push(col);
      }
      //初始化下拉选择框的数据源,优先级：data>url>key
      if ((col.type === 'dropdown' || col.type === 'cascader' || col.type === 'multi') && col.source) {
        if (col.source.data && col.source.data.length > 0) {
          sourceKeyMap[col.data] = arrayToHash(col.source.data);
        } else if (col.source.url) {
          request({ url: col.source.url, method: "get" })
            .then(result => {
              col.source.data = result;
              sourceKeyMap[col.data] = arrayToHash(col.source.data);
              this.setState({ sourceKeyMap: sourceKeyMap });
            });
        } else if (col.source.key && (col.type === 'dropdown' || col.type === 'multi')) {
          request({ url: config.api.getDic + col.source.key, method: "get" })
            .then(result => {
              col.source.data = result.options;
              sourceKeyMap[col.data] = arrayToHash(col.source.data);
              this.setState({ sourceKeyMap: sourceKeyMap });
            });
        } else {
          sourceKeyMap[col.data] = {};
        }
      }
      //money类型的列默认向右对齐
      if (col.type === 'money') {
        col.align = col.align || 'right';
      }
      //根据权限初始化行内按钮，没有按钮时移除command列
      if (col.type === 'command') {
        let tdActions = [];
        if (url && url.edit && permission.check(tp.edit)) {
          tdActions.unshift({ name: '编辑', onClick: data => this.editClick(data) });
        }
        let actions = col.actions || [];
        for (let action of actions) {
          if (permission.check(action.permissionName)) {
            tdActions.push(action);
          }
        }
        if (url && url.delete && permission.check(tp.delete)) {
          tdActions.push({ name: '删除',color:'#f78989', onClick: data => this.deleteClick(data[this.state.primaryKey]), confirm: true })
        }
        if (tdActions.length === 0) continue;
        col.actions = tdActions;
      }
      //初始化列的隐藏层级：no、user、dev
      if (col.hide === 'user') { }
      else if (col.hide && col.hide !== 'no') { col.hide = 'dev'; }
      else { col.hide = 'no' }
      columns.push(col);
    }

    //初始化查询条件
    let filterRules = this.state.filterRules;
    if (filterRules.length === 0) {
      filterRules.push({
        field: queryColumns.length > 0 ? queryColumns[0]['data'] : '',
        operate: 'equal',
        value: ''
      });
    }

    //初始化顶部按钮
    let tableActions = [];
    let optionActions = gridOption.actions || [];
    for (let action of optionActions) {
      if (permission.check(action.permissionName)) {
        tableActions.push(action);
      }
    }
    if (url && url.add && permission.check(tp.add)) {
      tableActions.push({ name: "新增", icon: "plus", onClick: () => this.addClick() });
    }

    this.setState({
      columns: columns,
      queryColumns: queryColumns,
      actions: tableActions,
      sourceKeyMap: sourceKeyMap,
      tablePermission: tp,
      filterRules: filterRules
    }, () => {
      this.state.autoQuery && this.query()
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!(this.props.url && this.props.url.read) && !util.object.equal(nextProps.gridOption.dataSource, this.props.gridOption.dataSource)) {
      this.setState({pageIndex: 1}, () => this.localQuery(nextProps))
    }
  }

  /* 分页点击事件 */
  pageClick(pageIndex) {
    this.setState({
      pageIndex: pageIndex
    }, this.query);
  }

  /* 每页显示数量改变事件 */
  pageSizeChange(pageSize) {
    this.setState({
      pageIndex: 1,
      pageSize: pageSize
    }, this.query);
  }

  /* 新增点击事件 */
  addClick() {
    let formOption = {
      model: "add",
      saveUrl: this.props.gridOption.url.add,
      fields: this.state.columns,
      value: {},
      extraParams: this.state.customData
    };
    this.setState({
      formVisiable: true,
      formOption: formOption
    });
  }

  /* 编辑点击事件 */
  editClick(data) {
    let formOption = {
      model: "update",
      saveUrl: this.props.gridOption.url.edit,
      fields: this.state.columns,
      value: data,
      extraParams: this.state.customData
    };
    this.setState({
      formVisiable: true,
      formOption: formOption
    });
  }

  /* 删除点击事件 */
  deleteClick(id) {
    request({
      url: this.props.gridOption.url.delete + "?id=" + id,
      method: "post"
    }).then(() => {
      message.success('删除成功');
      this.query();
    });
  }

  /* 表单保存 */
  saveClick() {
    if (!this.refs.autoForm.validate()) return;

    this.setState({ formConfirmLoading: true });
    this.refs.autoForm.saveClick(() => {
      this.setState({
        formVisiable: false,
        formConfirmLoading: false
      });
      this.query();
      this.props.gridOption.afterSave && this.props.gridOption.afterSave()
    });
  }

  /*弹出框取消事件 */
  cancelClick() {
    this.setState({
      formVisiable: false,
      formConfirmLoading: false
    });
  }

  /* 排序点击事件 */
  sortClick(col) {
    if (col['sortDisable'] || col.type === "command") return;
    let sortField = col['data'];
    let sortDirection = sortField !== this.state.sortField ? "asc" : this.state.sortDirection === "asc" ? "desc" : "asc";

    this.setState({
      sortField: sortField,
      sortDirection: sortDirection
    }, this.query);
  }

  /* 全选点击事件 */
  checkAllClick() {
    if (this.state.checkedValues.length === this.state.gridDatas.items.length) {
      this.setState({ checkedValues: [] })
    } else {
      let checkValues = this.state.gridDatas.items.map(p => p[this.state.primaryKey]);
      this.setState({ checkedValues: checkValues })
    }
  }

  /* 选择框点击事件 */
  checkClick(value) {
    let checkValues = this.state.checkedValues;
    let index = checkValues.findIndex(p => p === value);
    if (index < 0) {
      checkValues.push(value);
    } else {
      checkValues.splice(index, 1);
    }
    this.setState({ checkedValues: checkValues })
  }

  /* 获取选择的值*/
  getCheckValues() {
    return this.state.checkedValues;
  }

  /* 数据查询 */
  query() {
    let url = this.props.gridOption.url;
    if (!url || !url.read) { this.localQuery(this.props) }
    else {
      this.setState({ queryLoading: true });
      let dto = {
        pageIndex: this.state.pageIndex,
        pageSize: this.state.pageSize,
        sortField: this.state.sortField,
        sortDirection: this.state.sortDirection === "asc" ? 0 : 1,
        filters: this.getFilters()
      };

      request({
        url: url.read,
        method: "post",
        data: dto
      }).then(result => {
        if (result === null || typeof (result) === "undefined") {
          result = { totalCount: 0, items: [] };
        }
        this.setState({ gridDatas: result, queryLoading: false });
        this.props.gridOption.afterQuery && this.props.gridOption.afterQuery(result, this.getFilters());
      });
    }
  }

  localQuery(props) {
    let { pageIndex, pageSize } = this.state;
    let dataSource = props.gridOption.dataSource;

    let filters = this.getFilters();
    for (let filter of filters) {
      if (dataSource.length === 0) break;
      if (util.string.isEmpty(filter.value)) continue;
      dataSource = dataSource.filter(p => {
        let data = p[filter.field];
        if (typeof (data) === 'undefined' || data === null) return false;

        switch (filter.operate) {
          case 'equal':
            return data === filter.value;
          case 'notequal':
            return data !== filter.value;
          case 'less':
            return data < filter.value;
          case 'lessorequal':
            return data <= filter.value;
          case 'greater':
            return data > filter.value;
          case 'greaterorequal':
            return data >= filter.value;
          case 'contains':
            return data.indexOf(filter.value) >= 0;
          case 'startswith':
            return data.indexOf(filter.value) === 0;
          case 'endswith':
            let subLen = data.length - filter.value.length;
            return subLen > 0 && data.lastIndexOf(filter.value) === subLen;
          default:
            return data === filter.value;
        }
      })
    }

    let start = (pageIndex - 1) * pageSize;
    let end = start + pageSize;
    if (end >= dataSource.length) end = dataSource.length;

    let items = dataSource.slice(start, end);
    this.setState({
      gridDatas: {
        totalCount: dataSource.length,
        items: items
      }
    })
  }

  reload() {
    let gridOption = this.props.gridOption;
    this.setState({
      pageIndex: 1,
      pageSize: gridOption.pageSize || 15,
      sortField: gridOption.sortField || this.state.columns[0].data,
      sortDirection: gridOption.sortDirection || "desc",
      filterRules: [{
        field: this.state.queryColumns.length > 0 ? this.state.queryColumns[0]['data'] : '',
        operate: 'equal',
        value: ''
      }]
    }, this.query);
  }

  setFieldSource(key, data) {
    let columns = this.state.columns;
    let sourceKeyMap = this.state.sourceKeyMap;

    let sourceTypes = ['dropdown', 'multi', 'cascader'];
    for (let col of columns) {
      if (col.data === key && sourceTypes.includes(col.type)) {
        col.source = { data: data };
        sourceKeyMap[key] = arrayToHash(data);
      }
    }
    this.setState({
      columns: columns,
      sourceKeyMap: sourceKeyMap
    })
  }

  setCustomData(data) {
    let customData = this.state.customData;
    for (let filter of data) {
      let exsitIndex = customData.findIndex(f => f.field === filter.field);
      if (exsitIndex < 0) {
        customData.push(filter)
      } else {
        customData[exsitIndex] = filter;
      }
    }
    this.setState({ customData: data }, this.reload);
  }

  filterChange(index, rule) {
    let rules = this.state.filterRules;
    rules[index] = rule;
    this.setState({ filterRules: rules });
  }

  addFilter() {
    let queryColumns = this.state.queryColumns;
    if (queryColumns.length === 0) return;

    let rules = this.state.filterRules;
    rules.push({
      field: queryColumns[0]['data'],
      operate: 'equal',
      value: ''
    });
    this.setState({ rules: rules });
  }

  removeFilter(index) {
    let rules = this.state.filterRules;
    if (index >= rules.length) return;

    rules.splice(index, 1);
    this.setState({ filterRules: rules });
  }

  getFilters() {
    let customRules = this.state.customData.map(function (data) {
      return {
        field: data.field,
        operate: data.operate ? data.operate : "equal",
        value: data.value
      }
    });

    return this.state.filterRules.concat(customRules).filter(r => (r.value + '').length > 0)
  }

  switchColumn(index) {
    let columns = this.state.columns;
    if (index < 0 || index >= columns.length) return;

    columns[index].hide = columns[index].hide === 'user' ? 'no' : 'user';
    this.setState({ columns: columns });
  }

  render() {
    let self = this;
    let gridOption = self.props.gridOption;
    let primaryKey = self.state.primaryKey;

    let ths = self.state.columns.filter(c => c.hide === 'no').map(function (col, index) {
      let sortClass = "";
      if (!col.sortDisable && col.type !== "command" && gridOption.url && gridOption.url.read) {
        sortClass = self.state.sortField !== col.data
          ? styles.sorting
          : self.state.sortDirection === 'asc' ? styles.sorting_asc : styles.sorting_desc;
      }
      let colKey = col.type === 'command' ? 'col_command' : col.data;
      colKey += '_' + index;
      return (<th key={colKey} className={sortClass} onClick={() => self.sortClick(col)}>{col.title}</th>);
    });
    let trs = self.state.gridDatas.items.map(function (data) {
      let backColor = "";
      if (typeof (gridOption.colorRender) === 'function') {
        backColor = gridOption.colorRender(data);
        if (backColor === 'success') backColor = "rgba(130,206,75,.4)";
        else if (backColor === 'warn') backColor = "rgba(255,253,186,.5)";
        else if (backColor === 'error') backColor = "rgba(255,128,102,.2)";
      }

      return <tr
        style={util.string.isEmpty(backColor) ? {} : { backgroundColor: backColor }}
        className="ant-table-row  ant-table-row-level-0" key={'tr_' + data[primaryKey]}>
        {gridOption.checkable && <td><Checkbox checked={self.state.checkedValues.indexOf(data[primaryKey]) >= 0} onChange={() => self.checkClick(data[primaryKey])} /></td>}
        {
          self.state.columns.filter(c => c.hide === 'no').map(function (col, index) {
            if (col.type === "command") {
              let tdActions = col.actions || [];
              let colKey = 'tr_' + data[primaryKey] + '_td_command_' + index;

              return <td key={colKey}>
                {
                  tdActions.map(function (action, aIndex) {
                    if (action.hideFunc && action.hideFunc(data)) return '';

                    var actionName = action.nameFormat ? action.nameFormat(data) : action.name;
                    let color = config.color[action.color] ? config.color[action.color] : action.color;
                    return <span key={'tr_' + data[primaryKey] + '_action_' + aIndex}>
                      {aIndex > 0 && <Divider type="vertical" />}
                      {action.confirm
                        ? <Popconfirm title={'确定要' + actionName + '吗？'} onConfirm={() => action.onClick(data)}><a style={util.string.isEmpty(color) ? {} : { color: color }} href="#">{actionName}</a></Popconfirm>
                        : <a style={util.string.isEmpty(color) ? {} : { color: color }} href="javascript:void(0);" onClick={() => action.onClick(data)}>{actionName}</a>}
                    </span>
                  })
                }
              </td>;
            }
            else {
              let formatValue;
              let colKey = 'tr_' + data[primaryKey] + '_td_' + col.data + '_' + index;
              if (col.render) {
                formatValue = col.render(data[col.data], data)
              } else {
                if (col.type === 'switch') formatValue = SwitchRender(data[col.data]);
                else if (col.type === 'dropdown' || col.type === 'cascader') formatValue = DropdownRender(data[col.data], self.state.sourceKeyMap[col.data]);
                else if (col.type === 'multi') formatValue = MultiRender(data[col.data], self.state.sourceKeyMap[col.data]);
                else if (col.type === 'date') formatValue = DateTimeRender(data[col.data], 'yyyy-MM-dd');
                else if (col.type === 'datetime') formatValue = DateTimeRender(data[col.data], 'yyyy-MM-dd HH:mm:ss');
                else if (col.type === 'img' || col.type === 'imgs') formatValue = ImageRender(data[col.data]);
                else if (col.type === 'file' || col.type === 'files') formatValue = FileRender(data[col.data]);
                else if (col.type === 'money') formatValue = MoneyRender(data[col.data]);
                else formatValue = typeof (data[col.data]) === 'undefined' ? '' : data[col.data];
              }
              let align = col.align || 'left';
              let widthStyle = col.width ? { width: col.width } : {};
              if (col.type === 'text' || col.type === 'textarea' || col.type === 'richtext') {
                let maxLength = col.maxLength || 30;
                return <td style={{ textAlign: align, ...widthStyle }} title={formatValue} key={colKey}>{util.string.truncate(formatValue, maxLength)}</td>;
              } else {
                return <td style={{ textAlign: align, ...widthStyle }} key={colKey}>{formatValue}</td>
              }
            }
          })
        }
      </tr>
    });

    let actions = self.state.actions.map(function (action, index) {
      let checkedValues = self.state.checkedValues;
      let checkedDatas = self.state.gridDatas.items.filter(item => checkedValues.indexOf(item[primaryKey]) >= 0);
      return action.confirm
        ? <Popconfirm key={"action_" + index} okText={'确定'} cancelText={'取消'} title={'确定要' + action.name + '吗？'} onConfirm={() => action.onClick(checkedValues, checkedDatas)}><BirdButton color = {action.color} icon={action.icon} type="primary">{action.name}</BirdButton></Popconfirm>
        : <BirdButton key={"action_" + index} color = {action.color} icon={action.icon} type="primary" onClick={() => action.onClick(checkedValues, checkedDatas)}>{action.name}</BirdButton>

    });

    let filterGroups = [[]];
    let filterRules = self.state.filterRules;

    for (let i = 1, len = filterRules.length; i < len; i++) {
      let offset = i % 3;
      let groupIndex = (i - offset) / 3;
      if (offset === 0) {
        filterGroups.push([]);
        groupIndex--;
      }
      filterGroups[groupIndex].push(filterRules[i])
    }


    let filters = filterGroups.map((group, gindex) => {
      return <Row key={'filter_group_' + gindex}>
        {group.map((rule, rindex) => {
          let index = gindex * 3 + rindex + 1;//在filterRules中的index
          return <Col span={8} key={'filter_group_' + gindex + '_rule_' + rindex}>
            <Row>
              <Col span={20}>
                <BirdGridFilter fields={self.state.queryColumns} rule={rule}
                  onChange={rule => self.filterChange(index, rule)} />
              </Col>
              <Col span={4}>
                <Button icon='close' type='danger' onClick={() => self.removeFilter(index)} />
              </Col>
            </Row>
          </Col>
        })}
      </Row>
    })

    return (
      <Spin spinning={this.state.queryLoading} tip="数据加载中...">
        <Card>
          <Row>
            <Col span={10}>
              {this.state.queryColumns.length > 0 && <Row>
                <Col span={16}>
                  <BirdGridFilter fields={this.state.queryColumns} rule={this.state.filterRules[0]}
                    onChange={rule => this.filterChange(0, rule)} />
                </Col>
                <Col span={8}>
                  <Button.Group>
                    <BirdButton icon='plus' onClick={() => self.addFilter()} />
                    <Button icon='search' type="primary" onClick={() => { this.setState({ pageIndex: 1 }, this.query) }}>{gridOption.queryText || '查询'}</Button>
                  </Button.Group>
                </Col>
              </Row>}
            </Col>
            <Col span={14}>
              <div className={styles.action}>
                <Button.Group>
                  {actions}
                  <Button icon='sync' type="primary" onClick={() => this.reload()} />
                  <Popover placement="bottomRight" trigger="click" content={this.state.columns.map((col, index) =>
                    <div key={'col_opt_' + index}>
                      {(col.hide !== 'dev') && <Checkbox checked={col.hide === 'no'} onChange={() => this.switchColumn(index)}>{col.title}</Checkbox>}
                    </div>)}>
                    <Button icon='bars' type="primary" />
                  </Popover>
                </Button.Group>
              </div>
            </Col>
          </Row>
          {filters}
          <div className={styles.bird_table}>
            {/*<div className={styles.changebox1}>占位用</div>*/}
            {/* <div className={styles.bird_table_body}> */}
            <div>
              <table>
                <thead className={styles.bird_table_thead}>
                  <tr>
                    {gridOption.checkable && <th style={{ width: 15 }}><Checkbox
                      checked={this.state.checkedValues.length > 0 && this.state.checkedValues.length === this.state.gridDatas.items.length}
                      onChange={() => this.checkAllClick()} /></th>}
                    {ths}
                  </tr>
                </thead>
                <tbody className={styles.bird_table_body}>
                  {trs}
                </tbody>
              </table>
              <Pagination className={styles.gridPagination}
                showQuickJumper
                current={this.state.pageIndex}
                total={parseInt(this.state.gridDatas.totalCount, 10)}
                pageSizeOptions={gridOption.pageSizeOptions || ["10", "15", "20", "30", "50", "100", "200"]}
                pageSize={this.state.pageSize}
                showSizeChanger={true}
                onChange={(page, pageSize) => this.pageClick(page, pageSize)}
                onShowSizeChange={(page, pageSize) => this.pageSizeChange(pageSize)}
                showTotal={total => `共 ${total} 条`} />
            </div>
            {/*<div className={styles.changebox2}>占位用</div>*/}
            <Modal title={this.state.formOption.model === 'add' ? '新增' : '编辑'}
              width={this.state.formWidth}
              visible={this.state.formVisiable}
              onOk={() => this.saveClick()}
              onCancel={() => this.cancelClick()}
              confirmLoading={this.state.formConfirmLoading}
            >
              <AutoForm formOption={this.state.formOption} ref="autoForm" />
            </Modal>
          </div>
        </Card>
      </Spin>
    );
  }
}

BirdGrid.propTypes = {
  gridOption: PropTypes.object.isRequired
}

export default BirdGrid;
