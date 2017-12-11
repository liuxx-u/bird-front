import React from 'react';
import PropTypes from 'prop-types';
import BirdButton from '../Form/BirdButton';
import AutoForm from './BirdGridForm';
import BirdGridQuery from './BirdGridQuery';
import { request,config,util,permission } from 'utils';
import styles from './BirdGrid.less';
import {DropdownRender,SwitchRender} from './render';
import {Pagination,Modal,Card,Popconfirm,message,Row, Col,Tag,Checkbox,Button } from 'antd';

const operatorMap = {
  "equal":"等于",
  "notequal":"不等于",
  "less":"小于",
  "lessorequal":"小于等于",
  "greater":"大于",
  "greaterorequal":"大于等于",
  "contains":"包含",
  "startswith":"开始于",
  "endswith":"结束于"
};

class BirdGrid extends React.Component {
  constructor(props) {
    super(props);

    let primaryKey = this.props.gridOption.primaryKey || this.props.gridOption.columns[0]['data'];
    this.state = {
      actions: [],
      pageIndex: 1,
      pageSize: this.props.gridOption.pageSize || 15,
      sortField: this.props.gridOption.sortField || primaryKey,
      sortDirection: this.props.gridOption.sortDirection || "desc",
      filterRules: [],
      gridDatas: {
        totalCount: 0,
        items: []
      },
      formVisiable: false,
      formConfirmLoading: false,
      formWidth: 520,
      formOption: {
        saveUrl: "",
        fields: [],
        value: {}
      },
      customData: this.props.gridOption.customRules || [],
      sourceKeyMap: {},//下拉选择器key与data的映射
      fieldTitleMap: {},

      primaryKey: primaryKey,//标识列名称
      tablePermission: {},

      checkedValues: []
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

    let sourceKeyMap = {};
    let fieldTitleMap = {};
    for (let i = 0, len = self.props.gridOption.columns.length; i < len; i++) {
      let col = self.props.gridOption.columns[i];
      fieldTitleMap[col.data] = col.title;
      if (col.type === 'richtext' && self.state.formWidth === 520) {
        self.setState({formWidth: 800});
      }
      if (col.type === 'dropdown' && col.source) {
        if (col.source.key) {
          request({
            url: config.api.getDic + col.source.key,
            method: "get"
          }).then(function (result) {
            sourceKeyMap[col.data] = result.options;
          });
        } else {
          sourceKeyMap[col.data] = col.source.data || [];
        }
      }
    }

    self.setState({
      actions: optionActions,
      sourceKeyMap: sourceKeyMap,
      fieldTitleMap: fieldTitleMap,
      tablePermission: tp
    }, self.query);
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
      fields: this.props.gridOption.columns,
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
      fields: this.props.gridOption.columns,
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
      this.setState({checkedValues: []})
    } else {
      let checkValues = this.state.gridDatas.items.map(p => p[this.state.primaryKey]);
      this.setState({checkedValues: checkValues})
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
    this.setState({checkedValues: checkValues})
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
      filters: this.state.filterRules.concat(customRules)
    };

    request({
      url: this.props.gridOption.url.read,
      method: "post",
      data: dto
    }).then(function (result) {
      self.setState({
        gridDatas: result
      })
    });
  }

  reload() {
    this.setState({
      pageIndex: 1,
      pageSize: this.props.gridOption.pageSize || 15,
      sortField: this.props.gridOption.sortField || this.props.gridOption.columns[0].data,
      sortDirection: this.props.gridOption.sortDirection || "desc",
      filterRules: [],
    }, this.query);
  }

  setCustomData(data) {
    let customData = this.state.customData;
    for (let i = 0, len = data.length; i < len; i++) {
      let filter = data[i];
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

  removeFilter(rule) {
    let rules = this.state.filterRules;
    rules = rules.filter(r => r.field !== rule.field);
    this.setState({
      filterRules: rules
    }, this.query)
  }

  setFilter(rule) {
    let rules = this.state.filterRules;
    let index = rules.findIndex(r => r.field == rule.field);
    if (index == -1) {
      rules.push(rule);
    } else {
      rules[index] = rule;
    }
    this.setState({
      filterRules: rules
    }, this.query)
  }

  removeTag(colKey) {
    this.refs['query_' + colKey].clear();
  }

  render() {
    let self = this;
    let gridOption = self.props.gridOption;

    let ths = gridOption.columns.map(function (col) {
      if (col.hide) return;

      let sortClass = "";
      if (!col.sortDisable && col.type !== "command") {
        sortClass = self.state.sortField !== col.data
          ? styles.sorting
          : self.state.sortDirection === 'asc' ? styles.sorting_asc : styles.sorting_desc;
      }
      let colKey = col.type === 'command' ? 'col_command' : col.data;
      return (<th key={colKey} className={sortClass} onClick={() => {
        self.sortClick(col)
      }}>
        {col.query &&
        <BirdGridQuery key={'query_' + colKey} field={col}
                       ref={'query_' + colKey}
                       onFilter={rule => self.setFilter(rule)}
                       onClear={rule => self.removeFilter(rule)}/>}
        {col.title}
      </th>);
    });
    let trs = self.state.gridDatas.items.map(function (data) {
      let primaryKey = self.state.primaryKey;
      return <tr className="ant-table-row  ant-table-row-level-0" key={'tr_' + data[primaryKey]}>
        {gridOption.checkable && <td><Checkbox checked={self.state.checkedValues.indexOf(data[primaryKey]) >= 0}
                                               onChange={() => self.checkClick(data[primaryKey])}/></td>}
        {
          gridOption.columns.map(function (col) {
            if (col.hide) return;

            if (col.type === "command") {
              let tdActions = col.actions || [];

              return <td key={'tr_' + data[primaryKey] + '_td_' + col.data}>
                {self.props.gridOption.url.edit && permission.check(self.state.tablePermission.edit) &&
                <a href="#" onClick={() => self.editClick(data)}>编辑</a>}

                {
                  tdActions.map(function (action, aIndex) {
                    if (!permission.check(action.permissionName)) return;
                    if (action.hideFunc && action.hideFunc(data)) return;
                    var actionName = action.nameFormat ? action.nameFormat(data) : action.name;
                    return <span key={'tr_' + data[primaryKey] + '_action_' + aIndex}>
                      <span className="ant-divider"></span>
                      {action.confirm ? <Popconfirm title={'确定要' + actionName + '吗？'} onConfirm={() => {
                          action.onClick(data)
                        }}><a href="#">{actionName}</a></Popconfirm> :
                        <a href="javascript:void(0);" onClick={() => action.onClick(data)}>{actionName}</a>}

                    </span>
                  })
                }

                {self.props.gridOption.url.delete && permission.check(self.state.tablePermission.delete) &&
                <Popconfirm title="确定要删除这条记录吗？" onConfirm={() => {
                  self.deleteClick(data[primaryKey])
                }}>
                  <span>
                    <span className="ant-divider"></span>
                    <a href="#">删除</a>
                  </span>
                </Popconfirm>}
              </td>;
            }
            else {
              let formatValue;
              if (col.render) {
                formatValue = col.render(data[col.data], data)
              } else {
                if (col.type === 'switch') formatValue = SwitchRender(data[col.data]);
                else if (col.type === 'dropdown') formatValue = DropdownRender(data[col.data], self.state.sourceKeyMap[col.data]);
                else formatValue = data[col.data] || "";
              }

              /*对于文本列长度超过30，则省略*/
              if (col.type === 'text' || col.type === 'textarea' || col.type === 'richtext') {
                return <td title={formatValue} key={col.data}>{util.string.truncate(formatValue, 30)}</td>;
              } else {
                return <td key={col.data}>{formatValue}</td>
              }
            }
          })
        }
      </tr>
    });

    let actions = self.state.actions.map(function (action, index) {
      return <BirdButton permissionName={action.permissionName} key={"action_" + index} icon={action.icon}
                         type="primary" onClick={() => {
        action.onClick(self.state.checkedValues)
      }}>{action.name}</BirdButton>
    });

    let filters = self.state.filterRules.map(filter => {
      let formatValue = filter.value;
      if (self.state.sourceKeyMap[filter.field]) {
        formatValue = DropdownRender(filter.value, self.state.sourceKeyMap[filter.field]);
      }
      return <Tag color="blue" closable key={'filter_' + filter.field}
                  onClose={() => this.removeTag(filter.field)}>`{self.state.fieldTitleMap[filter.field]}`{operatorMap[filter.operate]}`{formatValue}`</Tag>
    });

    return (
      <Card>
        <Row>
          <Col span={12}>
            {self.state.filterRules.length > 0 && <div className={styles.filter}>
              当前筛选条件：
              {filters}
            </div>}
          </Col>
          <Col span={12}>
            <div className={styles.action}>
              <Button.Group>
                {actions}
              </Button.Group>
            </div>
          </Col>
        </Row>
        <div className={styles.bird_table}>
          <div className={styles.bird_table_body}>
            <table>
              <thead className={styles.bird_table_thead}>
              <tr>
                {gridOption.checkable && <th style={{width: 15}}><Checkbox
                  checked={this.state.checkedValues.length == this.state.gridDatas.items.length}
                  onChange={() => this.checkAllClick()}/></th>}
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
                        pageSizeOptions={this.props.gridOption.pageSizeOptions || ["10", "15", "20", "30", "50", "100"]}
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
                        }}/>
          </div>

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
            <AutoForm formOption={this.state.formOption} ref="autoForm"/>
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
