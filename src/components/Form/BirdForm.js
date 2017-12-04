import React from 'react';
import PropTypes from 'prop-types';
import { request, deepClone } from 'utils';
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
      activeKey: this.props.activeGroupName,
      group: [],

      initValue: initValue,
      submitting: false
    }
  }

  componentDidMount() {
    this.initGroup();
  }

  initGroup() {
    if (!this.props.withTab || this.props.fields.length == 0 || this.state.group.length > 0) return;

    let group = [];
    for (let i = 0, len = this.props.fields.length; i < len; i++) {
      let field = this.props.fields[i];
      let groupName = field.groupName || this.props.defaultGroupName;
      console.log(groupName);

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
      initValue: initValue
    });
  }

  getResult() {
    return this.state.initValue;
  }

  save() {
    let self = this;
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
    let capacity = self.props.lineCapacity;

    let rows = [];
    let fillHash = {};//rows中剩余容量与行序号数组的hash表
    for (let i = capacity - 1; i > 0; i--) {
      fillHash[i] = [];
    }

    for (let i = 0, len = fields.length; i < len; i++) {
      let field = fields[i];
      field.value = self.state.initValue[field.key];

      let colSpan = field.colSpan || 1;
      if (colSpan > capacity || field.fieldType === 'richtext') {//富文本占据整行
        colSpan = capacity;
      }

      let hasFill = false;
      let col = {colSpan: colSpan, field: field};
      for (let i = colSpan; i < capacity; i++) {
        if (fillHash[i].length > 0) {
          hasFill = true;
          let index = fillHash[i][0];
          rows[index].push(col);
          if (colSpan == i) {
            fillHash[i].shift();
          } else {
            let sub = i - colSpan;
            fillHash[sub].push(index);
          }
          break;
        }
      }
      if (!hasFill) {
        rows.push([col]);
        let sub = capacity - colSpan;
        if (sub > 0) {
          fillHash[sub].push(rows.length - 1)
        }
      }
    }


    let autoFields = rows.map((row,index) => {
      return <Row key={'row_'+index}>
        {row.map(col => {
          let unit = 24 / self.props.lineCapacity;
          return <Col span={col.colSpan * unit} key={'field_' + col.field.key}>
            <AutoField fieldOption={col.field}
                       onChange={(key, value) => self.onFieldChange(key, value)}/>
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
