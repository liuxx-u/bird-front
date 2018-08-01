import React from 'react';
import PropTypes from 'prop-types';
import BirdSelector from '../Form/BirdSelector';
import BirdCascader from '../Form/BirdCascader';
import moment from 'moment';
import { Select, DatePicker, Input, InputNumber } from 'antd';

const Option = Select.Option;
const InputGroup = Input.Group;

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
    if (key === 'field' && rule[key] !== value) {
      rule.value = "";
    }

    rule[key] = value;
    this.props.onChange && this.props.onChange(rule);
  }

  render() {
    let field = this.props.fields.find(f => f.data === this.props.rule.field);
    let searchOperators = operators.common;
    switch (field.type) {
      case "number":
      case "money":
      case "date":
      case "datetime":
        searchOperators = searchOperators.concat(operators.struct);
        break;
      case "text":
      case "textarea":
        searchOperators = searchOperators.concat(operators.text);
        break;
      default:
        break;
    }

    let valueField;
    switch (field.type) {
      case "text":
      case "textarea":
        valueField =
          <Input id={field.data} value={this.props.rule.value} style={{ width: '37.5%' }} onChange={(e) => this.onRuleChange('value', e.target.value)} />;
        break;
      case "number":
        valueField = <InputNumber id={field.data} min={0} value={this.props.rule.value}
          style={{ width: '37.5%' }}
          onChange={(value) => this.onRuleChange('value', value)} />;
        break;
      case "money":
        valueField = <InputNumber id={field.data} min={0} value={this.props.rule.value}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: '37.5%' }}
          onChange={(value) => this.onRuleChange('value', value)} />;
        break;
      case "switch":
        valueField = (
          <Select id={field.data} value={this.props.rule.value} onChange={value => this.onRuleChange("value", value)} style={{ width: '37.5%' }}>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        );
        break;
      case "dropdown":
        valueField = <BirdSelector dicKey={field.source.key} data={field.source.data || []} width='37.5%'
          onChange={value => this.onRuleChange('value', value)} selectedValue={this.props.rule.value} />;
        break;
      case "cascader":
        valueField = <BirdCascader data={field.source.data || []} expandTrigger='hover' width='37.5%'
          onChange={value => this.onRuleChange('value', value)} value={this.props.rule.value} />;
        break;
      case "date":
        valueField =
          <DatePicker id={field.data} value={this.props.rule.value ? moment(this.props.rule.value) : null} format={"YYYY-MM-DD"}
            style={{ width: '37.5%' }}
            onChange={(date, dateString) => this.onRuleChange('value', dateString)} />;
        break;
      case "datetime":
        valueField =
          <DatePicker id={field.data} value={this.props.rule.value ? moment(this.props.rule.value) : null}
            format={"YYYY-MM-DD HH:mm"}
            style={{ width: '37.5%' }}
            onChange={(date, dateString) => this.onRuleChange('value', dateString)} />;
        break;
      default:
        valueField = <span />;
        break;
    }

    return (
      <InputGroup compact>
        <Select style={{ width: '37.5%' }}
          value={this.props.rule.field}
          onChange={value => this.onRuleChange('field', value)}>
          {
            this.props.fields.map(function (item) {
              return <Option key={'field_option_' + item.data}
                value={item.data}>{item.title}</Option>;
            })
          }
        </Select>
        <Select placeholder="请选择操作符"
          style={{ width: '25%' }}
          value={this.props.rule.operate}
          onChange={operator => this.onRuleChange('operate', operator)}>
          {
            searchOperators.map(function (operator) {
              return <Option key={'operator_option_' + operator.value}
                value={operator.value}>{operator.text}</Option>;
            })
          }
        </Select>
        {valueField}
      </InputGroup>
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
