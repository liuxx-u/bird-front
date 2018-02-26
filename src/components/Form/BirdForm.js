import React from 'react';
import PropTypes from 'prop-types';
import { request, deepClone,util } from 'utils';
import AutoField from './AutoField';
import {Form,message,Button,Tabs,Row,Col} from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

/**
 * BirdForm组件
 * props中有saveUrl参数，则自动渲染保存按钮并支持提交
 * props中有withTab=true，则自动分组渲染
 */

class BirdForm extends React.Component {
  constructor(props) {
    super(props);

    let initValue = deepClone(this.props.value);
    this.state = {
      formKey: util.string.generateRandom(6),

      activeKey: this.props.activeGroupName,
      group: [],

      initValue: initValue,
      submitting: false,
      isValueChange: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.props.value) {
      let initValue = deepClone(nextProps.value)
      this.setState({
        initValue: initValue
      })
    }
  }

  componentDidMount() {
    this.initGroup();
  }

  initGroup() {
    if (!this.props.withTab || this.props.fields.length == 0 || this.state.group.length > 0) return;

    let group = [];
    for (let field of this.props.fields) {
      let groupName = field.groupName || this.props.defaultGroupName;

      let index = group.findIndex(g => g.groupName == groupName);
      if (index < 0) {
        group.push({
          groupName: groupName,
          fields: [field]
        })
      } else {
        group[index].fields.push(field)
      }
    }
    this.setState({
      group: group,
      activeKey: this.props.activeGroupName || group[0].groupName
    })
  }

  onFieldChange(key, value) {
    let initValue = this.state.initValue;
    initValue[key] = value;
    this.setState({
      initValue: initValue,
      isValueChange: true
    });
  }

  isValueChanged() {
    return this.state.isValueChange
  }

  getResult() {
    return this.state.initValue;
  }

  validate() {
    let dto = this.getResult();
    //验证数据合法性
    for (let field of this.props.fields) {
      if (field.isRequired && util.string.isEmpty(dto[field.key])) {
        message.error('`' + field.name + '`不能为空.');
        return false;
      }
      if (field.validateRegular) {
        let reg = typeof (field.validateRegular) === 'string' ? new RegExp(field.validateRegular) : field.validateRegular;
        if (reg.test && !reg.test(dto[field.key])) {
          message.error('`' + field.name + '`数据格式不正确.');
          return false;
        }
      }
    }
    return true;
  }

  save() {
    let self = this;
    if(!self.validate())return;

    let dto = self.getResult();
    self.setState({submitting: true})

    request({
      url: this.props.saveUrl,
      method: "post",
      data: dto
    }).then(function () {
      self.setState({submitting: false});
      message.success('保存成功');
    }).catch(function () {
      self.setState({submitting: false});
    });
  }

  getFields(fields) {
    let self = this;
    let formKey = self.state.formKey;
    let capacity = self.props.lineCapacity;

    let rows = [[]];
    let lastRowCapacity = capacity;

    for (let field of fields) {
      field.value = self.state.initValue[field.key] || '';
      //colSpan默认为1，最大为4
      let colSpan = field.colSpan || 1;
      if (colSpan > 4) {
        colSpan = 4;
      }

      if (lastRowCapacity < colSpan) {
        rows.push([]);
        lastRowCapacity = capacity;
      }
      rows[rows.length - 1].push(field);
      lastRowCapacity = lastRowCapacity - colSpan;
    }

    let autoFields = rows.map((row, index) => {
      return <Row key={formKey+'_row_' + index}>
        {row.map(field => {
          let colSpan = field.colSpan||1;
          if (colSpan > 4) {
            colSpan = 4;
          }
          let unit = 24 / self.props.lineCapacity;
          return <Col span={colSpan * unit} key={formKey+'_field_' + field.key}>
            {field.fieldType !== 'empty' &&
            <AutoField fieldOption={field} labelColSpan={6 / colSpan}
                       onChange={(key, value) => self.onFieldChange(key, value)}/>}
          </Col>
        })}
      </Row>
    });
    return autoFields;
  }

  render() {
    let self = this;

    const submitFormLayout = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };

    const button = <Button type="primary" loading={this.state.submitting} icon='save' onClick={() => self.save()}>
      提交
    </Button>;

    return (
      self.props.withTab
        ? <Tabs type={self.props.tabType} tabPosition={self.props.tabPosition}
                tabBarExtraContent={this.props.saveUrl && button}>
          {self.state.group.map((group, index) => {
            return <TabPane tab={group.groupName} key={'group_' + index}>
              <Form>
                {self.getFields(group.fields)}
              </Form>
            </TabPane>
          })}
        </Tabs>
        : <Form>
          {self.getFields(self.props.fields)}
          {this.props.saveUrl && <FormItem {...submitFormLayout} style={{marginTop: 32}}>
            {button}
          </FormItem>}
        </Form>
    );
  }
}

BirdForm.propTypes = {
  fields:PropTypes.array.isRequired,
  lineCapacity:PropTypes.number,//每行容量
  withTab:PropTypes.bool,//是否使用tab展示
  defaultGroupName: PropTypes.string,//默认的分组名
  activeGroupName: PropTypes.string,//选中的分组名
  tabType: PropTypes.string,//tab类型
  tabPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),//tab的位置

  saveUrl:PropTypes.string,
  value:PropTypes.object
};

BirdForm.defaultProps = {
  lineCapacity: 1,
  withTab: false,
  defaultGroupName: '基础信息',
  tabType: 'line',
  tabPosition: 'top',

  saveUrl: '',
  value: {}
};

export default BirdForm;
