import React from 'react';
import PropTypes from 'prop-types';
import BirdForm from '../Form/BirdForm';
import { request, config, util, permission, arrayToHash, deepClone } from 'utils';
import styles from './BirdGrid.less';
import BirdButton from '../Form/BirdButton';
import { DropdownRender, SwitchRender, DateTimeRender, MultiRender, ImageRender, FileRender, MoneyRender } from './render';
import { Pagination, Modal, Card, message, Row, Col, Checkbox, Button, Divider, Spin, Popover, Dropdown, Menu, Icon } from 'antd';
import DefaultFilterItem from './filter/DefaultFilterItem';
import AdvanceFilterGenerator from './filter/AdvanceFilterGenerator';
const sourceTypes = ['dropdown', 'multi', 'cascader'];
const fileTypes = ['img', 'imgs', 'file', 'files'];

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
      showAdvance: false,
      queryColumns: [],
      sumFields: [],
      fileFileds: [],
      actions: [],
      pageIndex: 1,
      pageSize: gridOption.pageSize || 15,
      queryLoading: false,
      sortField: gridOption.sortField || primaryKey,
      sortDirection: gridOption.sortDirection || "desc",
      filterRules: gridOption.filterRules || [],
      gridDatas: {
        totalCount: dataSource.length,
        items: dataSource,
        sum: {}
      },
      expandIndexVisibleMap: {},
      formVisiable: false,
      formConfirmLoading: false,
      formWidth: gridOption.formWidth || 520,
      formOption: gridOption.formOption || {},
      customData: gridOption.customRules || [],
      keyTitleMap: {},
      sourceKeyMap: {},//dropdown与cascader类型key与data的hash映射
      fileNameMap: {},

      primaryKey: primaryKey,//标识列名称
      tablePermission: {},

      checkableFilter: typeof (gridOption.checkable) === 'function' ? gridOption.checkable : d => gridOption.checkable === true,
      checkedValues: [],
      autoQuery: autoQuery, //页面渲染完成之后是否自动查询，默认为true
    };

    this.form = React.createRef();
    this.advanceFilterGenerator = React.createRef();
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
        delete: p + ':delete',
        export: p + ':export'
      }
    } else {
      tp = p || {};
    }

    let url = gridOption.url;
    let columns = [], queryColumns = [], sumFields = [], fileFileds = [];
    let keyTitleMap = {}, sourceKeyMap = {};
    for (let col of gridOption.columns) {
      //过滤没有权限的列
      if (!permission.check(col.permission)) continue;

      //根据权限初始化行内按钮，没有按钮时移除command列
      if (col.type === 'command') {
        let tdActions = [];
        if (url && url.edit && permission.check(tp.edit)) {
          tdActions.unshift({ name: '编辑', onClick: this.editClick });
        }
        let actions = col.actions || [];
        for (let action of actions) {
          if (permission.check(action.permissionName)) {
            tdActions.push(action);
          }
        }
        if (url && url.delete && permission.check(tp.delete)) {
          tdActions.push({ name: '删除', color: '#f78989', onClick: data => this.deleteClick(data[this.state.primaryKey]), confirm: true })
        }
        if (tdActions.length === 0) continue;
        col.actions = tdActions;
      } else {
        keyTitleMap[col.data] = col.title;
        if ((this.state.formOption.lineCapacity > 1 || col.type === 'richtext') && this.state.formWidth === 520) {
          this.setState({ formWidth: 800 });
        }
        if (col.query) {
          let queryMode = col.query.mode || col.type;
          queryColumns.push({
            key: col.data,
            title: col.title,
            init: col.query.init,
            defaultOpt: queryMode === 'multi' ? 'in' : 'equal',
            mode: queryMode,
            source: [],//初始化时，数据源为空，在render中获取col上的数据源
            filters: []
          });
        }
        if ((col.type === 'number' || col.type === 'money') && col.sum) {
          sumFields.push(col.data);
        }
        if (fileTypes.includes(col.type)) {
          fileFileds.push(col.data);
        }

        //初始化下拉选择框的数据源,优先级：data>url>key
        if (col.source) {
          if (col.source.data && col.source.data.length > 0) {
            sourceKeyMap[col.data] = arrayToHash(col.source.data);
          } else if (col.source.url) {
            request({ url: col.source.url, method: "get" })
              .then(result => {
                col.source.data = result;
                sourceKeyMap[col.data] = arrayToHash(col.source.data);
                this.setState({ sourceKeyMap: sourceKeyMap });
              });
          } else if (col.source.key) {
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
      }

      //初始化列的隐藏层级：no、user、dev
      if (col.hide === 'user') { }
      else if (col.hide && col.hide !== 'no') { col.hide = 'dev'; }
      else { col.hide = 'no' }
      columns.push(col);
    }

    //初始化查询条件
    let filterRules = this.state.filterRules;
    if (filterRules.length === 0 && queryColumns.length > 0) {
      let firstQuery = queryColumns[0];
      filterRules.push({
        field: firstQuery['key'],
        operate: firstQuery['defaultOpt'],
        value: ''
      });
    }

    //初始化顶部按钮
    let tableActions = [];
    let optionActions = gridOption.actions || [];
    if (url && url.add && permission.check(tp.add)) {
      tableActions.push({ name: "新增", icon: "plus", onClick: this.addClick });
    }
    for (let action of optionActions) {
      if (permission.check(action.permissionName)) {
        tableActions.push(action);
      }
    }
    if (url && url.read && gridOption.export && permission.check(tp.export)) {
      tableActions.push({ name: "导出", icon: "export", confirm: true, loading: this.state.exportLoading, onClick: this.exportClick });
    }

    this.setState({
      columns: columns,
      queryColumns: queryColumns,
      sumFields: sumFields,
      fileFileds: fileFileds,
      actions: tableActions,
      keyTitleMap: keyTitleMap,
      sourceKeyMap: sourceKeyMap,
      tablePermission: tp,
      filterRules: filterRules
    }, () => {
      this.state.autoQuery && this.query()
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!(this.props.url && this.props.url.read) && !util.object.equal(nextProps.gridOption.dataSource, this.props.gridOption.dataSource)) {
      this.setState({ pageIndex: 1 }, () => this.localQuery(nextProps))
    }
  }

  /* 分页点击事件 */
  pageClick = (pageIndex, pageSize) => {
    this.setState({
      pageIndex: pageIndex
    }, this.query);
  }

  /* 每页显示数量改变事件 */
  pageSizeChange = (pageIndex, pageSize) => {
    this.setState({
      pageIndex: 1,
      pageSize: pageSize
    }, this.query);
  }

  /* 新增点击事件 */
  addClick = () => {
    let gridOption = this.props.gridOption;
    let formOption = this.state.formOption;
    formOption.model = "add";
    formOption.saveUrl = gridOption.url.add;
    formOption.value = {};
    if (gridOption.formOption && gridOption.formOption.defaultValue) {
      formOption.value = gridOption.formOption.defaultValue;
    }
    for (let extra of this.state.customData) {
      formOption.value[extra.field] = extra.value;
    }
    formOption.fields = this.state.columns
      .filter(c => c.type !== 'command' && c.data !== 'id' && c.editor && c.editor.ap !== 'hide')
      .map(c => ({
        name: c.title,
        key: c.data,
        tips: c.editor.tips,
        isRequired: c.editor.isRequired,
        validateRegular: c.editor.validateRegular,
        fieldType: c.type,
        disabled: c.editor.ap === 'disabled',
        source: c.source || {},
        groupName: c.editor.groupName,
        step: c.editor.step,
        precision: c.editor.precision,
        innerProps: c.editor.innerProps
      }));

    this.setState({
      formVisiable: true,
      formOption: formOption
    });
  }

  /** 导出点击事件 */
  exportClick = () => {
    let gridOption = this.props.gridOption;
    if (typeof (gridOption.export) === 'string') {
      window.open(gridOption.export, "_blank");
    } else {
      if (gridOption.url && !util.string.isEmpty(gridOption.url.read)) {
        let query = {
          pageIndex: this.state.pageIndex,
          pageSize: this.state.pageSize,
          sortField: this.state.sortField,
          sortDirection: this.state.sortDirection === "asc" ? 0 : 1,
          filters: this.getFilters()
        }
        let columns = [];
        if (gridOption.exportColumns && gridOption.exportColumns.length > 0) {
          columns = this.state.columns.filter(col => gridOption.exportColumns.indexOf(col.data) >= 0);
        } else {
          columns = this.state.columns.filter(col => col.hide === 'no' && col.type != 'command');
        }

        columns = columns.map(col => {
          let column = { field: col.data, name: col.title, type: col.type };

          if (col.source && (col.type === 'dropdown' || col.type === 'multi' || col.type === 'cascader')) {
            if (col.source.url) {
              column.sourceUrl = col.source.url.indexOf('//') == -1 ? config.host.api + col.source.url : col.source.url;
            } else if (col.source.key) {
              column.sourceUrl = `dic://${col.source.key}`
            }
          }
          return column;
        })

        let dto = {
          title: gridOption.title,
          url: gridOption.url.read.indexOf('//') == -1 ? config.host.api + gridOption.url.read : gridOption.url.read,
          query,
          columns
        }
        window.open(config.api.export + encodeURIComponent(JSON.stringify(dto)) + "&token=" + util.auth.getToken(), "_blank");
      }
    }
  }

  /* 编辑点击事件 */
  editClick = data => {
    let gridOption = this.props.gridOption;
    let formOption = this.state.formOption;
    formOption.model = "update";
    formOption.saveUrl = gridOption.url.edit;
    formOption.value = data;

    for (let extra of this.state.customData) {
      formOption.value[extra.field] = extra.value;
    }
    formOption.fields = this.state.columns
      .filter(c => c.type !== 'command' && c.data !== 'id' && c.editor && c.editor.ep !== 'hide')
      .map(c => ({
        name: c.title,
        key: c.data,
        tips: c.editor.tips,
        isRequired: c.editor.isRequired,
        validateRegular: c.editor.validateRegular,
        fieldType: c.type,
        disabled: c.editor.ep === 'disabled',
        source: c.source || {},
        step: c.editor.step,
        precision: c.editor.precision,
        innerProps: c.editor.innerProps
      }));

    for (let field of formOption.fields) {
      if (field.fieldType === 'switch') {
        formOption.value[field.key] = formOption.value[field.key] > 0
      }
    }

    this.setState({
      formVisiable: true,
      formOption: formOption
    });
  }

  /* 删除点击事件 */
  deleteClick = id => {
    request({
      url: this.props.gridOption.url.delete + "?id=" + id,
      method: "post"
    }).then(() => {
      message.success('删除成功');
      this.query();
    });
  }

  /**
   * 表单值改变事件
   */
  formChange = value => {
    let formOption = this.state.formOption;
    formOption.value = value;
    if (formOption.onChange) {
      value = formOption.onChange(value);
    }
    this.setState({ formOption: formOption });
  }

  /* 表单保存 */
  saveClick = () => {
    if (!this.form.current.validate()) return;

    this.setState({ formConfirmLoading: true });
    let gridOption = this.props.gridOption;
    let formOption = this.state.formOption;
    request({
      url: formOption.saveUrl,
      method: "post",
      data: formOption.value
    }).then(result => {
      message.success('保存成功');
      this.setState({
        formVisiable: false,
        formConfirmLoading: false
      });

      this.query();
      gridOption.afterSave && gridOption.afterSave(result)
    }).catch(() => {
      this.setState({
        formConfirmLoading: false
      });
    });
  }

  /* 弹出框取消事件 */
  cancelClick = () => {
    this.setState({
      formVisiable: false,
      formConfirmLoading: false
    });
  }

  /* 排序点击事件 */
  sortClick = col => {
    if (col['sortDisable'] || col.type === "command") return;
    let sortField = col['data'];
    let sortDirection = sortField !== this.state.sortField ? "asc" : this.state.sortDirection === "asc" ? "desc" : "asc";

    this.setState({
      sortField: sortField,
      sortDirection: sortDirection
    }, this.query);
  }

  /* 全选点击事件 */
  checkAllClick = () => {
    let checkableDatas = this.state.gridDatas.items.filter(this.state.checkableFilter);
    if (this.state.checkedValues.length === checkableDatas.length) {
      this.setState({ checkedValues: [] })
    } else {
      let checkValues = checkableDatas.map(p => p[this.state.primaryKey]);
      this.setState({ checkedValues: checkValues })
    }
  }

  /* 选择框点击事件 */
  checkClick = value => {
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
  getCheckValues = () => {
    return this.state.checkedValues;
  }

  /* 数据查询 */
  query = () => {
    let url = this.props.gridOption.url;
    if (!url || !url.read) { this.localQuery(this.props) }
    else {
      this.setState({ queryLoading: true });
      let dto = {
        pageIndex: this.state.pageIndex,
        pageSize: this.state.pageSize,
        sortField: this.state.sortField,
        sortDirection: this.state.sortDirection === "asc" ? 0 : 1,
        filters: this.getFilters(),
        sumFields: this.state.sumFields
      };

      request({
        url: url.read,
        method: "post",
        data: dto
      }).then(result => {
        if (result === null || typeof (result) === "undefined") {
          result = { totalCount: 0, items: [] };
        }
        this.setState({ gridDatas: result, queryLoading: false, checkedValues: [], expandIndexVisibleMap: {} }, this.formatFileName);
        this.props.gridOption.afterQuery && this.props.gridOption.afterQuery(result, this.getFilters());
      });
    }
  }

  /* 数据查询(本地) */
  localQuery = props => {
    let { pageIndex, pageSize } = this.state;
    let dataSource = deepClone(props.gridOption.dataSource);
    //筛选
    let filters = this.getFilters();
    for (let filter of filters) {
      if (dataSource.length === 0) break;
      if (util.string.isEmpty(filter.value)) continue;
      dataSource = dataSource.filter(p => {
        let data = p[filter.field];
        if (typeof (data) === 'undefined' || data === null) return false;
        data += '';
        let value = filter.value + '';

        switch (filter.operate) {
          case 'equal':
            return data === value;
          case 'notequal':
            return data !== value;
          case 'less':
            return data < value;
          case 'lessorequal':
            return data <= value;
          case 'greater':
            return data > value;
          case 'greaterorequal':
            return data >= value;
          case 'contains':
            return data.indexOf(value) >= 0;
          case 'startswith':
            return data.indexOf(value) === 0;
          case 'endswith':
            let subLen = data.length - value.length;
            return subLen > 0 && data.lastIndexOf(value) === subLen;
          case 'in':
            return value.split(",").includes(data);
          default:
            return data === value;
        }
      })
    }

    //合计
    let sum = {};
    for (let field of this.state.sumFields) {
      let fsum = 0;
      for (let data of dataSource) {
        let value = isNaN(data[field]) ? 0 : data[field];
        fsum = util.number.add(fsum, value);
      }
      sum[field] = fsum;
    }

    //排序
    let compare = (x, y) => {
      let sortField = this.state.sortField;
      let sortDirection = this.state.sortDirection;
      if (x[sortField] === y[sortField]) return 0;
      if (sortDirection === 'desc') {
        return x[sortField] > y[sortField] ? -1 : 1;
      } else {
        return x[sortField] > y[sortField] ? 1 : -1;
      }
    }
    dataSource.sort(compare);

    //分页
    let start = (pageIndex - 1) * pageSize;
    let end = start + pageSize;
    if (end >= dataSource.length) end = dataSource.length;

    let items = dataSource.slice(start, end);
    this.setState({
      gridDatas: {
        totalCount: dataSource.length,
        items: items,
        sum: sum
      },
      checkedValues: [],
      expandIndexVisibleMap: {}
    }, this.formatFileName)
  }

  /* 获取文件原名 */
  formatFileName = () => {
    let datas = this.state.gridDatas.items;
    let fileFileds = this.state.fileFileds;
    if (fileFileds.length === 0 || datas.length === 0) return;

    let files = [];
    for (let data of datas) {
      for (let field of fileFileds) {
        let url = data[field];
        if (util.string.isEmpty(url)) continue;

        let arr = url.split(",");
        for (let item of arr) {
          if (util.string.isEmpty(item)) continue;
          files.push(item)
        }
      }
    }
    request({
      url: config.api.getFileNames,
      method: 'post',
      data: files
    }).then(fileNameMap => this.setState({ fileNameMap: fileNameMap }))
  }

  reload = () => {
    let {gridOption} = this.props;
    let {queryColumns,columns } = this.state;
    let filterRules = gridOption.filterRules || [];

    if (filterRules.length === 0) {
      let firstQuery = queryColumns[0];
      filterRules.push({
        field: firstQuery['key'],
        operate: firstQuery['defaultOpt'],
        value: ''
      });
    } else {
      filterRules = deepClone(filterRules);
    }
    queryColumns.forEach(p => p.filters = []);

    this.setState({
      pageIndex: 1,
      pageSize: gridOption.pageSize || 15,
      sortField: gridOption.sortField || columns[0].data,
      sortDirection: gridOption.sortDirection || "desc",
      filterRules: filterRules,
      queryColumns: queryColumns
    }, this.query);
  }

  setFieldSource = (key, data) => {
    let columns = this.state.columns;
    let sourceKeyMap = this.state.sourceKeyMap;

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

  setCustomData = data => {
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

  /** complex查询模式下,默认的查询条件改变事件 */
  defaultQueryChange = (key, filters) => {
    let { queryColumns } = this.state;

    let index = queryColumns.findIndex(p => p.key === key);
    if (index < 0) return;

    queryColumns[index].filters = filters;
    this.setState({ queryColumns: queryColumns });
  }

  /** 高级查询条件改变事件 */
  advanceQueryChange = filters => {
    this.setState({ filterRules: filters })
  }

  /** complex状态切换事件 */
  toggleAdvance = () => {
    this.setState({ showAdvance: !this.state.showAdvance })
  }

  /** 行展开/收起 切换事件 */
  toggleExpand = rowIndex => {
    let { expandIndexVisibleMap } = this.state;
    expandIndexVisibleMap[rowIndex] = !expandIndexVisibleMap[rowIndex];

    this.setState({ expandIndexVisibleMap: expandIndexVisibleMap })
  }

  getFilters = () => {
    let { customData, filterRules, queryColumns } = this.state;
    let customRules = customData.map(data => {
      return {
        field: data.field,
        operate: data.operate ? data.operate : "equal",
        value: data.value
      }
    });

    let defaultRules = [];
    queryColumns.forEach(p => defaultRules = defaultRules.concat(p.filters));

    return defaultRules.concat(filterRules).concat(customRules)
      .filter(r => (r.value + '').length > 0)
      .map(r => {
        r.value = r.value + '';
        return r;
      })
  }

  switchColumn = index => {
    let { columns } = this.state;
    if (index < 0 || index >= columns.length) return;

    columns[index].hide = columns[index].hide === 'user' ? 'no' : 'user';
    this.setState({ columns: columns });
  }

  renderTableAction = (action, shrink, index) => {
    let actionEle;
    let eleKey = `table_action_${index}`;

    if (action.render && typeof (action.render) === 'function') {
      actionEle = action.render();
    } else {
      let { primaryKey, checkedValues, gridDatas } = this.state;
      let checkedDatas = gridDatas.items.filter(item => checkedValues.indexOf(item[primaryKey]) >= 0);

      let onClick = action.confirm ? () => {
        Modal.confirm({
          title: `确定要${action.name}吗？`,
          maskClosable: true,
          okText: "确定",
          cancelText: "取消",
          onOk: () => action.onClick(checkedValues, checkedDatas)
        });
      } : () => action.onClick(checkedValues, checkedDatas)

      actionEle = <BirdButton key={eleKey} style={shrink ? { width: '100%' } : {}} color={action.color} icon={action.icon} loading={action.loading} type="primary" onClick={onClick}>{action.name}</BirdButton>
    }
    return shrink ? <Menu.Item key={eleKey}>{actionEle}</Menu.Item> : actionEle;
  }

  renderRowAction = (action, shrink, rowData, formatData, index) => {
    let actionEle;
    let primaryKey = this.state.primaryKey;
    let eleKey = `tr_${rowData[primaryKey]}_action_${index}`;
    if (action.render && typeof (action.render) === 'function') {
      actionEle = action.render(rowData);
    } else {
      var actionName = action.nameFormat ? action.nameFormat(rowData) : action.name;
      let color = config.color[action.color] ? config.color[action.color] : action.color;
      let fds = []
      for (let key in formatData) {
        fds.push(formatData[key])
      }

      let onClick = action.confirm ? () => {
        let content = <Card>
          {fds.map((data, index) => {
            return <Row key={`${eleKey}_item_${index}`}>
              <Col span={8} style={{ textAlign: "right", paddingRight: 5 }}>{`${data.title}:`}</Col>
              <Col span={16} style={{ color: '#1890ff', fontSize: '14px' }}>{data.formatValue}</Col>
            </Row>
          })}
        </Card>;

        Modal.confirm({
          title: `确定要${actionName}吗？`,
          content: content,
          maskClosable: true,
          okText: "确定",
          cancelText: "取消",
          onOk: () => action.onClick(rowData, fds)
        });
      } : () => action.onClick(rowData, fds)

      actionEle = <a style={util.string.isEmpty(color) ? {} : { color: color }} href="javascript:void(0);" onClick={onClick}>{actionName}</a>
    }

    return shrink
      ? <Menu.Item key={eleKey}>{actionEle}</Menu.Item>
      : <span key={eleKey}>
        {index > 0 && <Divider type="vertical" />}
        {actionEle}
      </span>;
  }


  render() {
    let { gridOption } = this.props;
    let { formOption, primaryKey, columns, sortField, sortDirection, gridDatas, keyTitleMap, sourceKeyMap, fileNameMap, checkedValues, sumFields, actions, filterRules, queryColumns, pageIndex, pageSize, queryLoading, formWidth, formVisiable, formConfirmLoading, showAdvance, expandIndexVisibleMap } = this.state;
    let visibleColumns = columns.filter(c => c.hide === 'no');

    /** 获取表头 */
    let ths = visibleColumns.filter(c => c.colSpan !== 0).map((col, index) => {
      let sortClass = "";
      if (!col.sortDisable && col.type !== "command") {
        sortClass = sortField !== col.data
          ? styles.sorting
          : sortDirection === 'asc' ? styles.sorting_asc : styles.sorting_desc;
      }
      let colKey = col.type === 'command' ? 'col_command' : col.data;
      colKey += '_' + index;
      return (<th key={colKey} colSpan={col.colSpan || 1} style={col.colSpan > 1 ? { textAlign: 'center' } : {}} className={sortClass} onClick={() => this.sortClick(col)}>{col.title}</th>);
    });

    /** 获取数据列 */
    let trs = gridDatas.items.map((data, rowIndex) => {
      let backColor = "";
      if (typeof (gridOption.colorRender) === 'function') {
        backColor = gridOption.colorRender(data);
        if (backColor === 'success') backColor = "rgba(130,206,75,.4)";
        else if (backColor === 'warn') backColor = "rgba(255,253,186,.5)";
        else if (backColor === 'error') backColor = "rgba(255,128,102,.2)";
      }

      let rowDataMap = {};
      columns.forEach(col => {
        if (col.type === 'command') return;
        if (col.query) {
          let queryOption = queryColumns.find(p => p.key === col.data);
          if (sourceTypes.includes(queryOption.mode)) {
            queryOption.source = col.source.data || [];
          }
        }
        if(col.hide === 'no'){
          let formatValue;
          let title = keyTitleMap[col.data];
          let value = data[col.data];
          if (typeof (col.render) === 'function') {
            if (sourceTypes.includes(col.type)) formatValue = col.render(value, data, sourceKeyMap[col.data]);
            else if (fileTypes.includes(col.type)) formatValue = col.render(value, data, fileNameMap);
            else formatValue = col.render(value, data);
          } else {
            if (col.type === 'switch') formatValue = SwitchRender(value);
            else if (col.type === 'dropdown' || col.type === 'cascader') formatValue = DropdownRender(value, sourceKeyMap[col.data]);
            else if (col.type === 'multi') formatValue = MultiRender(value, sourceKeyMap[col.data]);
            else if (col.type === 'date') formatValue = DateTimeRender(value, 'yyyy-MM-dd');
            else if (col.type === 'datetime') formatValue = DateTimeRender(value, 'yyyy-MM-dd HH:mm:ss');
            else if (col.type === 'img' || col.type === 'imgs') formatValue = ImageRender(value, fileNameMap);
            else if (col.type === 'file' || col.type === 'files') formatValue = FileRender(value, fileNameMap);
            else if (col.type === 'money') formatValue = MoneyRender(value);
            else formatValue = typeof (value) === 'undefined' ? '' : value;
          }
          rowDataMap[col.data] = { title, value, formatValue };
        }
      })

      let trs = [<tr
        style={util.string.isEmpty(backColor) ? {} : { backgroundColor: backColor }}
        className="ant-table-row  ant-table-row-level-0" key={`tr_${rowIndex}`}>
        {gridOption.expandedRowRender && <td><Icon type={expandIndexVisibleMap[rowIndex] ? 'minus' : 'plus'} onClick={() => this.toggleExpand(rowIndex)} /></td>}
        {gridOption.checkable && <td><Checkbox disabled={!this.state.checkableFilter(data)} checked={checkedValues.indexOf(data[primaryKey]) >= 0} onChange={() => this.checkClick(data[primaryKey])} /></td>}
        {
          visibleColumns.map((col, index) => {
            if (col.type === "command") {
              let tdActions = col.actions || [];
              let colKey = `tr_${data[primaryKey]}_td_command_${index}`;
              tdActions = tdActions.filter(p => !p.hideFunc || !p.hideFunc(data));

              let showRowActionCount = gridOption.showRowActionCount || 3;
              let showRowActions = [];
              if (tdActions.length > showRowActionCount) {
                showRowActions = tdActions.slice(0, showRowActionCount - 1).map((action, index) => this.renderRowAction(action, false, data, rowDataMap, index));
                let shrinkActions = tdActions.slice(showRowActionCount - 1, tdActions.length).map((action, index) => this.renderRowAction(action, true, data, rowDataMap, index));

                let shrinkAction = <span key={`${colKey}_action_more`}><Divider type="vertical" /><Dropdown overlay={<Menu>{shrinkActions}</Menu>}><a className="ant-dropdown-link" href="#">更多<Icon type="down" /></a></Dropdown></span>
                showRowActions.push(shrinkAction);
              } else {
                showRowActions = tdActions.map((action, index) => this.renderRowAction(action, false, data, rowDataMap, index));
              }

              return <td className={styles.popover} key={colKey}>{showRowActions}</td>;
            }
            else {
              let { value, formatValue } = rowDataMap[col.data];
              let colKey = `tr_${data[primaryKey]}_td_${col.data}_${index}`;
              if (col.type === 'img' || col.type === 'imgs') {
                formatValue = ImageRender(value, fileNameMap, rowDataMap)
              } else if (col.type === 'file' || col.type === 'files') {
                formatValue = FileRender(value, fileNameMap, rowDataMap)
              }
              let align = col.align || 'left';
              let widthStyle = col.width ? { width: col.width } : {};
              let tdTitle = '';
              let displayValue = formatValue;

              if (col.type === 'text' || col.type === 'textarea' || col.type === 'richtext') {
                let maxLength = col.maxLength || 30;
                tdTitle = formatValue;
                displayValue = util.string.truncate(formatValue, maxLength);
              } else if (col.type === 'money') {
                tdTitle = util.number.cnCurrency(value || 0);
              }

              if (col.link) {
                displayValue = <a href='javascript:void(0);' target='' onClick={() => col.link.onClick(data)}>{displayValue}</a>
              }
              return <td style={{ textAlign: align, ...widthStyle }} key={colKey} title={tdTitle}>{displayValue}</td>
            }
          })
        }
      </tr>]

      if (gridOption.expandedRowRender && expandIndexVisibleMap[rowIndex]) {
        trs.push(<tr key={`tr_expand_${rowIndex}`}><td colSpan={gridOption.checkable ? visibleColumns.length + 2 : visibleColumns.length + 1}>{gridOption.expandedRowRender(rowDataMap)}</td></tr>)
      }

      return trs;
    });

    /** 获取合计的列 */
    let sumTr = <tr style={{ backgroundColor: '#f7f7f7' }}>{visibleColumns.map((col, index) => {
      let align = col.align ? col.align : col.type === 'money' ? 'right' : 'left';
      let key = `sum_col_${index}`;
      let sumColSpan = 1;
      if (gridOption.checkable) {
        sumColSpan++;
      }
      if (gridOption.expandedRowRender) {
        sumColSpan++;
      }

      if (index === 0) return <td key={key} colSpan={sumColSpan}>合计：</td>;
      else if (sumFields.includes(col.data)) {
        let value = gridDatas.sum[col.data];
        let title = value;
        if (col.type === 'money') {
          value = MoneyRender(value);
          title = util.number.cnCurrency(value || 0);
        }
        return <td key={key} style={{ textAlign: align }} title={title}>{value}</td>;
      }
      else return <td key={key} style={{ textAlign: 'center' }}>------</td>;
    })}</tr>;

    /** 获取显示的全局按钮 */
    let showActionCount = gridOption.showActionCount || 5;
    let showActions = [];
    if (actions.length > showActionCount) {
      showActions = actions.slice(0, showActionCount - 1).map((action, index) => this.renderTableAction(action, false, index));
      let shrinkActions = actions.slice(showActionCount - 1, actions.length).map((action, index) => this.renderTableAction(action, true, index));

      let shrinkAction = <Dropdown key={`table_action_more`} overlay={<Menu>{shrinkActions}</Menu>}><Button type="primary" key="btn_global_more">更多操作 <Icon type="down" /></Button></Dropdown>
      showActions.push(shrinkAction);
    } else {
      showActions = actions.map((action, index) => this.renderTableAction(action, false, index));
    }

    /** complex查询模式下，渲染<FilterPanel />组件；simple查询模式下，直接渲染AdvanceFilterItem组件 */
    let queryMode = 'none';
    let defaultQueryColumns = queryColumns.filter(p => p.init);
    if (queryColumns.length > 0) {
      queryMode = defaultQueryColumns.length > 0 ? 'complex' : 'simple';
    }
    let header = gridOption.header === null ? "" : gridOption.header || <div>
      {queryMode === 'complex' && <Card style={{ marginBottom: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Row>
            {defaultQueryColumns.map((option, index) => {
              return <Col span={8} key={`complex_query_${index}`} style={{ marginTop: 10 }}>
                <DefaultFilterItem queryOption={option} onChange={this.defaultQueryChange} />
              </Col>
            })}
          </Row>
          {showAdvance && <Divider></Divider>}
          {showAdvance && <Row style={{ marginBottom: '10px' }}><Col span={10}>{this.advanceFilterGenerator.current && this.advanceFilterGenerator.current.getStaticFilter([])}</Col></Row>}
          {showAdvance && this.advanceFilterGenerator.current && this.advanceFilterGenerator.current.getDynamicFilters()}
        </div>

      </Card>}
      {queryMode === 'simple' && this.advanceFilterGenerator.current && this.advanceFilterGenerator.current.getDynamicFilters()}
      <Row>
        {queryMode === 'simple' && <Col span={10}>
          {this.advanceFilterGenerator.current && this.advanceFilterGenerator.current.getStaticFilter(
            [<Button type="primary" key="btn_simple_query" onClick={() => { this.setState({ pageIndex: 1 }, this.query) }}>查询</Button>
              , <Button icon='sync' type="primary" key="btn_simple_sync" onClick={this.reload} />
            ])}
        </Col>}
        <Col span={queryMode === 'simple' ? 14 : 24}>
          <div className={styles.action}>
            <Button.Group>
              {showActions}
              {queryMode === 'complex' && <Button icon='search' type="primary" key="btn_complex_query" onClick={() => { this.setState({ pageIndex: 1 }, this.query) }}>查询</Button>}
              {queryMode === 'complex' && <Button icon={showAdvance ? 'caret-down' : 'caret-up'} type="primary" onClick={this.toggleAdvance}> 高级查询</Button>}
              {queryMode === 'complex' && <Button icon='sync' type="primary" key="btn_complex_sync" onClick={this.reload} />}
              <Popover placement="bottomRight" trigger="click" content={columns.map((col, index) =>
                <div key={'col_opt_' + index}>
                  {(col.hide !== 'dev') && <Checkbox checked={col.hide === 'no'} onChange={() => this.switchColumn(index)}>{col.title}</Checkbox>}
                </div>)}>
                <Button icon='bars' type="primary" />
              </Popover>
            </Button.Group>
          </div>
        </Col>
      </Row>
    </div>

    /** 获取表格的footer */
    let footer = gridOption.footer === null ? "" : gridOption.footer || <Pagination className={styles.gridPagination}
      showQuickJumper
      current={pageIndex}
      total={parseInt(gridDatas.totalCount, 10)}
      pageSizeOptions={gridOption.pageSizeOptions || ["10", "15", "20", "30", "50", "100", "200", "500"]}
      pageSize={pageSize}
      showSizeChanger={true}
      onChange={this.pageClick}
      onShowSizeChange={this.pageSizeChange}
      showTotal={total => `共 ${total} 条`} />

    let checkableDatas = gridDatas.items;
    if (gridOption.checkable) {
      checkableDatas = checkableDatas.filter(this.state.checkableFilter);
    }

    return (
      <Spin spinning={queryLoading} tip="数据加载中...">
        <Card>
          <div className={styles.bird_header}>
            {/* AdvanceFilterGenerator 只用作生成高级查询的相关的元素，不做具体渲染*/}
            <AdvanceFilterGenerator ref={this.advanceFilterGenerator} queryColumns={queryColumns} filterRules={filterRules} onChange={this.advanceQueryChange} />
            {header}
          </div>
          <div className={styles.bird_table}>
            {/*<div className={styles.changebox1}>占位用</div>*/}
            {/* <div className={styles.bird_table_body}> */}
            <table>
              <thead className={styles.bird_table_thead}>
                <tr>
                  {gridOption.expandedRowRender && <th></th>}
                  {gridOption.checkable && <th style={{ width: 15 }}><Checkbox
                    checked={checkedValues.length > 0 && checkedValues.length === checkableDatas.length}
                    onChange={this.checkAllClick} /></th>}
                  {ths}
                </tr>
              </thead>
              <tbody className={styles.bird_table_body}>
                {trs}
                {gridDatas.items.length > 0 && gridDatas.sum && sumFields.length > 0 && sumTr}
              </tbody>
            </table>
            {/*<div className={styles.changebox2}>占位用</div>*/}
            <Modal centered title={formOption.model === 'add' ? (formOption.addTitle || '新增') : (formOption.editTitle || '编辑')}
              width={formWidth}
              visible={formVisiable}
              onOk={this.saveClick}
              onCancel={this.cancelClick}
              confirmLoading={formConfirmLoading}
              destroyOnClose={true}
            >
              <BirdForm fields={formOption.fields || []} lineCapacity={formOption.lineCapacity || 1} withTab={formOption.withTab} value={formOption.value} onChange={this.formChange} ref={this.form} />
            </Modal>
          </div>
          <div className={styles.bird_footer}>
            {footer}
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
