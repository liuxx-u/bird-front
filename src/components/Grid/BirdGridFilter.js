import React from 'react';
import PropTypes from 'prop-types';
import BirdSelector from '../Form/BirdSelector';
import BirdCascader from '../Form/BirdCascader';
import moment from 'moment';
import { Form, Select, Col, Row, Button, DatePicker, Input, InputNumber } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const operators = {
  common: [{ value: "equal", text: "等于" }, { value: "notequal", text: "不等于" }],
  struct: [{ value: "less", text: "小于" }, { value: "lessorequal", text: "小于等于" }, { value: "greater", text: "大于" }, { value: "greaterorequal", text: "大于等于" }],
  text: [{ value: "contains", text: "包含" }, { value: "startswith", text: "开始于" }, { value: "endswith", text: "结束于" }]
}
class BirdGridFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  onRuleChange(key, value) {
    let rule = this.props.rule;
    rule[key] = value;

    this.props.onChange && this.props.onChange(rule);
  }

  render() {
    let field = this.props.fields.find(f => f.data === this.props.rule.field);
    let searchOperators = operators.common;
    switch (field.type) {
      case "number":
      case "date":
      case "datetime":
        searchOperators = searchOperators.concat(operators.struct);
        break;
      case "text":
      case "textarea":
        searchOperators = searchOperators.concat(operators.text);
      default:
        break;
    }

    let valueField;
    switch (field.type) {
      case "text":
      case "textarea":
        valueField =
          <Input id={field.data} value={this.props.rule.value} onChange={(e) => this.onRuleChange('value', e.target.value)} />;
        break;
      case "number":
        valueField = <InputNumber id={field.data} min={0} value={this.props.rule.value}
          style={{ width: '100%' }}
          onChange={(e) => this.onRuleChange('value', e.target.value)} />;
        break;
      case "switch":
        valueField = (
          <Select id={field.data} value={this.props.rule.value} onChange={(value) => this.onRuleChange('value', value)}
            style={{ width: '100%' }}>
            <Option value="true">是</Option>
            <Option value="false">否</Option>
          </Select>
        );
        break;
      case "dropdown":
        valueField = <BirdSelector dicKey={field.source.key} data={field.source.data || []}
          onChange={value => this.onRuleChange('value', value)} selectedValue={this.props.rule.value} />;
        break;
      case "cascader":
        valueField = <BirdCascader data={field.source.data || []} expandTrigger='hover'
          onChange={value => this.onRuleChange('value', value)} value={this.props.rule.value} />;
        break;
      case "date":
        valueField =
          <DatePicker id={field.data} value={this.props.rule.value ? moment(this.props.rule.value) : null} format={"YYYY-MM-DD"}
            style={{ width: '100%' }}
            onChange={(date, dateString) => this.onRuleChange('value', dateString)} />;
        break;
      case "datetime":
        valueField =
          <DatePicker id={field.data} value={this.props.rule.value ? moment(this.props.rule.value) : null}
            format={"YYYY-MM-DD HH:mm"}
            style={{ width: '100%' }}
            onChange={(date, dateString) => this.onRuleChange('value', dateString)} />;
        break;
      default:
        valueField = <span />;
        break;
    }

    return (
      <Row>
        <Col span={9}>
          <Select style={{ width: '100%' }}
            value={this.props.rule.field}
            onChange={value => this.onRuleChange('field', value)}>
            {
              this.props.fields.map(function (item) {
                return <Option key={'field_option_' + item.data}
                  value={item.data}>{item.title}</Option>;
              })
            }
          </Select>
        </Col>
        <Col span={6}>
          <Select placeholder="请选择操作符"
            style={{ width: '100%' }}
            value={this.props.rule.operate}
            onChange={operator => this.onRuleChange('operate', operator)}>
            {
              searchOperators.map(function (operator) {
                return <Option key={'operator_option_' + operator.value}
                  value={operator.value}>{operator.text}</Option>;
              })
            }
          </Select>
        </Col>
        <Col span={9}>
          {valueField}
        </Col>
      </Row>
    );
  }
}

BirdGridFilter.propTypes = {
  fields: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  rule: PropTypes.object
}

BirdGridFilter.defaultProps = {
  fields: []
}

export default BirdGridFilter;
