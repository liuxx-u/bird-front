import React from 'react';
import PropTypes from 'prop-types';
import BirdSelector from '../../Form/BirdSelector';
import BirdCascader from '../../Form/BirdCascader';
import moment from 'moment';
import { Select, DatePicker, Input, InputNumber } from 'antd';

const Option = Select.Option;
const InputGroup = Input.Group;

const operators = {
  common: [{ value: "equal", text: "等于" }, { value: "notequal", text: "不等于" }],
  struct: [{ value: "less", text: "小于" }, { value: "lessorequal", text: "小于等于" }, { value: "greater", text: "大于" }, { value: "greaterorequal", text: "大于等于" }],
  text: [{ value: "contains", text: "包含" }, { value: "startswith", text: "开始于" }, { value: "endswith", text: "结束于" }]
}
class AdvanceFilterItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  /** rule值改变事件 */
  onRuleChange = (key, value) => {
    let rule = this.props.rule;
    if (key === 'field' && rule[key] !== value) {
      rule.value = "";
    }

    rule[key] = value;
    this.props.onChange && this.props.onChange(rule);
  }

  render() {
    let { queryColums, rule } = this.props;

    let queryOption = queryColums.find(f => f.key === rule.field);
    if (!queryOption) return <span />;
    let queryOperators = operators.common;
    switch (queryOption.mode) {
      case "number":
      case "number_range":
      case "money":
      case "money_range":
      case "date":
      case "date_range":
      case "datetime":
        queryOperators = queryOperators.concat(operators.struct);
        break;
      case "text":
      case "textarea":
        queryOperators = queryOperators.concat(operators.text);
        break;
      default:
        break;
    }

    let valueField;
    switch (queryOption.mode) {
      case "number":
        valueField = <InputNumber {...{
          min: 0,
          value: rule.value,
          style: { width: '37.5%' },
          onChange: value => this.onRuleChange('value', value),
          ...queryOption.innerProps
        }} />;
        break;
      case "money":
        valueField = <InputNumber {...{
          min: 0,
          value: rule.value,
          style: { width: '37.5%' },
          onChange: value => this.onRuleChange('value', value),
          formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: value => value.replace(/\$\s?|(,*)/g, ''),
          ...queryOption.innerProps
        }} />;
        break;
      case "switch":
        valueField = <Select {...{
          value: rule.value,
          style: { width: '37.5%' },
          onChange: value => this.onRuleChange('value', value),
          ...queryOption.innerProps
        }}>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>;
        break;
      case "dropdown":
        valueField = <BirdSelector {...{
          data: queryOption.source || [],
          width: '37.5%',
          onChange: value => this.onRuleChange('value', value),
          selectedValue: rule.value,
          innerProps: queryOption.innerProps
        }} />;
        break;
      case "cascader":
        valueField = <BirdCascader {...{
          data: queryOption.source || [],
          expandTrigger: 'hover',
          width: '37.5%',
          value: rule.value,
          onChange: value => this.onRuleChange('value', value),
          innerProps: queryOption.innerProps
        }} />;
        break;
      case "date":
        valueField = <DatePicker {...{
          value: rule.value ? moment(rule.value) : null,
          format: "YYYY-MM-DD",
          style: { width: '37.5%' },
          onChange: (date, dateString) => this.onRuleChange('value', dateString),
          ...queryOption.innerProps
        }} />;
        break;
      case "datetime":
        valueField = <DatePicker {...{
          value: rule.value ? moment(rule.value) : null,
          format: "YYYY-MM-DD HH:mm",
          style: { width: '37.5%' },
          onChange: (date, dateString) => this.onRuleChange('value', dateString),
          ...queryOption.innerProps
        }} />;
        break;
      default:
        valueField = <Input {...{
          value: rule.value,
          style: { width: '37.5%' },
          onChange: e => this.onRuleChange('value', e.target.value),
          ...queryOption.innerProps
        }} />;
    }

    return (
      <InputGroup compact>
        <Select style={{ width: '37.5%' }}
          value={rule.field}
          onChange={value => this.onRuleChange('field', value)}>
          {
            queryColums.map(item => <Option key={'field_option_' + item.key} value={item.key}>{item.title}</Option>)
          }
        </Select>
        <Select placeholder="请选择操作符"
          style={{ width: '25%' }}
          value={rule.operate}
          onChange={operator => this.onRuleChange('operate', operator)}>
          {
            queryOperators.map(operator => <Option key={'operator_option_' + operator.value} value={operator.value}>{operator.text}</Option>)
          }
        </Select>
        {valueField}
      </InputGroup>
    );
  }
}

AdvanceFilterItem.propTypes = {
  queryColums: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  rule: PropTypes.object
}

AdvanceFilterItem.defaultProps = {
  queryColums: []
}

export default AdvanceFilterItem;
