import React from 'react';
import PropTypes from 'prop-types';
import BirdButton from '../Form/BirdButton';
import AutoForm from './BirdGridForm';
import BirdGridFilter from './BirdGridFilter';
import { request, config, util, permission, arrayToHash } from 'utils';
import styles from './BirdGrid.less';
import { DropdownRender, SwitchRender, MultiRender, ImageRender, FileRender } from './render';
import { Pagination, Modal, Card, Popconfirm, message, Row, Col, Checkbox, Button, Divider } from 'antd';

class BirdGrid extends React.Component {
  constructor(props) {
    super(props);

    let gridOption = this.props.gridOption;
    let primaryKey = gridOption.primaryKey || gridOption.columns[0]['data'];
    let autoQuery = gridOption.autoQuery;
    if (typeof (autoQuery) == 'undefined') autoQuery = true;

    this.state = {
      columns: [],
      queryColumns: [],
      actions: [],
      pageIndex: 1,
      pageSize: gridOption.pageSize || 15,
      sortField: gridOption.sortField || primaryKey,
      sortDirection: gridOption.sortDirection || "desc",
      filterRules: [],
      gridDatas: {
        totalCount: 0,
        items: []
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
  componentWillMount() {
    let self = this;

    let p = self.props.gridOption.permission;
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

    let columns = [], queryColumns = [];
    let sourceKeyMap = {};
    for (let col of self.props.gridOption.columns) {
      if (col.type === 'richtext' && self.state.formWidth === 520) {
        self.setState({ formWidth: 800 });
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
            .then(function (result) {
              col.source.data = result;
              sourceKeyMap[col.data] = arrayToHash(col.source.data);
              self.setState({sourceKeyMap:sourceKeyMap});
            });
        } else if (col.source.key && (col.type === 'dropdown' || col.type === 'multi')) {
          request({ url: config.api.getDic + col.source.key, method: "get" })
            .then(function (result) {
              col.source.data = result.options;
              sourceKeyMap[col.data] = arrayToHash(col.source.data);
              self.setState({sourceKeyMap:sourceKeyMap});
            });
        } else {
          sourceKeyMap[col.data] = {};
        }
      }
      columns.push(col);
    }

    let filterRules = [];
    filterRules.push({
      field: queryColumns.length > 0 ? queryColumns[0]['data'] : '',
      operate: 'equal',
      value: ''
    });

    let defaultActions = [];
    if (self.props.gridOption.url.add && permission.check(tp.add)) {
      defaultActions.push({
        name: "新增",
        icon: "plus",
        onClick: () => {
          self.addClick()
        }
      });
    }
    let optionActions = self.props.gridOption.actions || [];
    optionActions = optionActions.concat(defaultActions);
    if (queryColumns.length > 0) {
      optionActions.unshift({
        name: '查询',
        icon: 'search',
        onClick: () => {
          self.query()
        }
      })
    }

    self.setState({
      columns: columns,
      queryColumns: queryColumns,
      actions: optionActions,
      sourceKeyMap: sourceKeyMap,
      tablePermission: tp,
      filterRules: filterRules
    }, () => {
      self.state.autoQuery && self.query()
    });
  }

  resetSourceKeyMap(key, data) {
    let columns = this.state.columns;
    let sourceKeyMap = this.state.sourceKeyMap;

    for (let col of columns) {
      if (col.data !== key) continue;
      if (col.type !== 'dropdown' && col.type !== 'cascader') continue;
      col.source = { data: data }
    }

    sourceKeyMap[key] = arrayToHash(data);
    this.setState({
      columns: columns,
      sourceKeyMap: sourceKeyMap
    })
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
    let self = this;
    request({
      url: this.props.gridOption.url.delete + "?id=" + id,
      method: "post"
    }).then(function () {
      message.success('删除成功');
      self.query();
    });
  }

  /* 表单保存 */
  saveClick() {
    let self = this;
    if (!self.refs.autoForm.validate()) return;

    self.setState({
      formConfirmLoading: true
    });
    self.refs.autoForm.saveClick(function () {
      self.setState({
        formVisiable: false,
        formConfirmLoading: false
      });
      self.query();
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
    if (this.state.checkedValues.length == this.state.gridDatas.items.length) {
      this.setState({ checkedValues: [] })
    } else {
      let checkValues = this.state.gridDatas.items.map(p => p[this.state.primaryKey]);
      this.setState({ checkedValues: checkValues })
    }
  }

  /* 选择框点击事件 */
  checkClick(value) {
    let checkValues = this.state.checkedValues;
    let index = checkValues.findIndex(p => p == value);
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
    let self = this;
    let customRules = this.state.customData.map(function (data) {
      return {
        field: data.field,
        operate: "equal",
        value: data.value
      }
    });

    let dto = {
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize,
      sortField: this.state.sortField,
      sortDirection: this.state.sortDirection === "asc" ? 0 : 1,
      filters: this.state.filterRules.concat(customRules).filter(r => r.value.length > 0)
    };

    request({
      url: this.props.gridOption.url.read,
      method: "post",
      data: dto
    }).then(function (result) {
      self.setState({
        gridDatas: result || { totalCount: 0, items: [] }
      });
      self.props.gridOption.afterQuery && self.props.gridOption.afterQuery(result);
    });
  }

  reload() {
    this.setState({
      pageIndex: 1,
      pageSize: this.props.gridOption.pageSize || 15,
      sortField: this.props.gridOption.sortField || this.state.columns[0].data,
      sortDirection: this.props.gridOption.sortDirection || "desc",
      filterRules: [{
        field: this.state.queryColumns.length > 0 ? this.state.queryColumns[0]['data'] : '',
        operate: 'equal',
        value: ''
      }],
    }, this.query);
  }

  setCustomData(data) {
    let customData = this.state.customData;
    for (let filter of data) {
      let exsitIndex = customData.findIndex(f => f.field == filter.field);
      if (exsitIndex < 0) {
        customData.push(filter)
      } else {
        customData[exsitIndex] = filter;
      }
    }
    this.setState({
      customData: data
    }, this.reload);
  }

  filterChange(index, rule) {
    let rules = this.state.filterRules;
    rules[index] = rule;
    this.setState({
      filterRules: rules
    })
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
    this.setState({
      rules: rules
    })
  }

  removeFilter(index) {
    let rules = this.state.filterRules;
    if (index >= rules.length) return;

    rules.splice(index, 1);
    this.setState({
      filterRules: rules
    })
  }

  render() {
    let self = this;
    let gridOption = self.props.gridOption;

    let ths = self.state.columns.map(function (col, index) {
      if (col.hide) return;

      let sortClass = "";
      if (!col.sortDisable && col.type !== "command") {
        sortClass = self.state.sortField !== col.data
          ? styles.sorting
          : self.state.sortDirection === 'asc' ? styles.sorting_asc : styles.sorting_desc;
      }
      let colKey = col.type === 'command' ? 'col_command' : col.data;
      colKey += '_' + index;
      return (<th key={colKey} className={sortClass} onClick={() => {
        self.sortClick(col)
      }}>
        {col.title}
      </th>);
    });
    let trs = self.state.gridDatas.items.map(function (data) {
      let primaryKey = self.state.primaryKey;
      return <tr
        style={gridOption.errorFinder && gridOption.errorFinder(data) ? { backgroundColor: '#fef0ef' } : {}}
        className="ant-table-row  ant-table-row-level-0" key={'tr_' + data[primaryKey]}>
        {gridOption.checkable && <td><Checkbox checked={self.state.checkedValues.indexOf(data[primaryKey]) >= 0}
          onChange={() => self.checkClick(data[primaryKey])} /></td>}
        {
          self.state.columns.map(function (col, index) {
            if (col.hide) return;

            if (col.type === "command") {
              let tdActions = col.actions || [];
              let hasEdit = gridOption.url.edit && permission.check(self.state.tablePermission.edit);
              let hasPrev = hasEdit;
              let colKey = 'tr_' + data[primaryKey] + '_td_command_' + index;
              return <td key={colKey}>
                {hasEdit && <a href="#" onClick={() => self.editClick(data)}>编辑</a>}
                {
                  tdActions.map(function (action, aIndex) {
                    if (!permission.check(action.permissionName)) return;
                    if (action.hideFunc && action.hideFunc(data)) return;

                    let withDivider = hasPrev;
                    hasPrev = true;
                    var actionName = action.nameFormat ? action.nameFormat(data) : action.name;
                    return <span key={'tr_' + data[primaryKey] + '_action_' + aIndex}>
                      {withDivider && <Divider type="vertical" />}
                      {action.confirm ? <Popconfirm title={'确定要' + actionName + '吗？'} onConfirm={() => {
                        action.onClick(data)
                      }}><a href="#">{actionName}</a></Popconfirm> :
                        <a href="javascript:void(0);" onClick={() => action.onClick(data)}>{actionName}</a>}

                    </span>
                  })
                }

                {gridOption.url.delete && permission.check(self.state.tablePermission.delete) &&
                  <Popconfirm title="确定要删除这条记录吗？" onConfirm={() => {
                    self.deleteClick(data[primaryKey])
                  }}>
                    <span>
                      {hasPrev && <Divider type="vertical" />}
                      <a href="#">删除</a>
                    </span>
                  </Popconfirm>}
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
                else if (col.type === 'img' || col.type === 'imgs') formatValue = ImageRender(data[col.data]);
                else if (col.type === 'file' || col.type === 'files') formatValue = FileRender(data[col.data]);
                else formatValue = typeof (data[col.data]) === 'undefined' ? '' : data[col.data];
              }

              /*对于文本列长度超过30，则省略*/
              if (col.type === 'text' || col.type === 'textarea' || col.type === 'richtext') {
                return <td title={formatValue} key={colKey}>{util.string.truncate(formatValue, 30)}</td>;
              } else {
                return <td key={colKey}>{formatValue}</td>
              }
            }
          })
        }
      </tr>
    });

    let actions = self.state.actions.map(function (action, index) {
      return <BirdButton permissionName={action.permissionName}
        key={"action_" + index}
        icon={action.icon}
        type="primary"
        onClick={() => {
          let primaryKey = self.state.primaryKey;
          let checkedValues = self.state.checkedValues;
          let checkedDatas = self.state.gridDatas.items.filter(item => checkedValues.indexOf(item[primaryKey]) >= 0);
          action.onClick(checkedValues, checkedDatas);
        }}>{action.name}</BirdButton>
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
                <Button icon='close' onClick={() => self.removeFilter(index)} />
              </Col>
            </Row>
          </Col>
        })}
      </Row>
    })

    return (
      <Card>
        <Row>
          <Col span={8}>
            {self.state.queryColumns.length > 0 && <Row>
              <Col span={20}>
                <BirdGridFilter fields={self.state.queryColumns} rule={self.state.filterRules[0]}
                  onChange={rule => self.filterChange(0, rule)} />
              </Col>
              <Col span={4}>
                <Button icon='plus' onClick={() => self.addFilter()} />
              </Col>
            </Row>}
          </Col>
          <Col span={12} offset={4}>
            <div className={styles.action}>
              <Button.Group>
                {actions}
              </Button.Group>
            </div>
          </Col>
        </Row>
        {filters}
        <div className={styles.bird_table}>
          {/*<div className={styles.changebox1}>占位用</div>*/}
          <div className={styles.bird_table_body}>
            <table>
              <thead className={styles.bird_table_thead}>
                <tr>
                  {gridOption.checkable && <th style={{ width: 15 }}><Checkbox
                    checked={this.state.checkedValues.length > 0 && this.state.checkedValues.length == this.state.gridDatas.items.length}
                    onChange={() => this.checkAllClick()} /></th>}
                  {ths}
                </tr>
              </thead>
              <tbody className={styles.bird_table_body}>
                {trs}
              </tbody>
            </table>
            <Pagination className={styles.gridPagination}
              current={this.state.pageIndex}
              total={parseInt(this.state.gridDatas.totalCount)}
              pageSizeOptions={gridOption.pageSizeOptions || ["10", "15", "20", "30", "50", "100"]}
              pageSize={this.state.pageSize}
              onChange={(page, pageSize) => {
                this.pageClick(page, pageSize)
              }}
              showSizeChanger={true}
              onShowSizeChange={(page, pageSize) => {
                this.pageSizeChange(pageSize)
              }}
              showTotal={function (total) {
                return `共 ${total} 条`;
              }} />
          </div>
          {/*<div className={styles.changebox2}>占位用</div>*/}
          <Modal title={this.state.formOption.model === 'add' ? '新增' : '编辑'}
            width={this.state.formWidth}
            visible={this.state.formVisiable}
            onOk={() => {
              this.saveClick()
            }}
            onCancel={() => {
              this.cancelClick()
            }}
            confirmLoading={this.state.formConfirmLoading}
          >
            <AutoForm formOption={this.state.formOption} ref="autoForm" />
          </Modal>
        </div>
      </Card>
    );
  }
}

BirdGrid.propTypes = {
  gridOption: PropTypes.object.isRequired
}

export default BirdGrid;
