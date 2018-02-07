import React from 'react';
import PropTypes from 'prop-types';
import BirdSelector from '../Form/BirdSelector';
import BirdCascader from '../Form/BirdCascader';
import { Icon, Popover, Form, Select, Col, Row, Button, DatePicker, TimePicker, Input, InputNumber } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const operators = {
  common: [{ value: "equal", text: "等于" }, { value: "notequal", text: "不等于" }],
  struct: [{ value: "less", text: "小于" }, { value: "lessorequal", text: "小于等于" }, { value: "greater", text: "大于" }, { value: "greaterorequal", text: "大于等于" }],
  text: [{ value: "contains", text: "包含" }, { value: "startswith", text: "开始于" }, { value: "endswith", text: "结束于" }]
}
class BirdGridQuery extends React.Component {
  constructor(props) {
    super(props);

    let field = this.props.field;
    let searchOperators = operators.common;
    switch (field.type) {
      case "number":
      case "date":
      case "datetime":
      case "datetime":
        searchOperators = searchOperators.concat(operators.struct);
        break;
      case "text":
      case "textarea":
        searchOperators = searchOperators.concat(operators.text);
      default:
        break;
    }
    this.state = {
      searchOperators: searchOperators,
      oprator: "equal",
      value: ""
    }
  }

  query() {
    if (this.state.value === "") {
      return;
    }
    console.log({
      field: this.props.field.data,
      operate: this.state.oprator,
      value: this.state.value
    });
    this.props.onFilter({
      field: this.props.field.data,
      operate: this.state.oprator,
      value: this.state.value
    });
  }

  clear() {
    this.setState({
      value: "",
      oprator: "equal"
    });
    this.props.onClear({
      field: this.props.field.data,
      operate: this.state.oprator,
      value: this.state.value
    });
  }

  onOpratorChange(operator) {
    this.setState({
      oprator: operator
    });
  }

  onValueChange(value) {
    this.setState({
      value: value
    });
  }

  render() {
    let field = this.props.field;
    let searchOperators = this.state.searchOperators;

    let getContainer = function (el) {
      return el;
    };

    let valueField;
    switch (field.type) {
      case "text":
      case "textarea":
        valueField =
          <Input id={field.data} value={this.state.value} onChange={(e) => this.onValueChange(e.target.value)} />;
        break;
      case "number":
        valueField = <InputNumber id={field.data} min={0} value={this.state.value}
          onChange={(e) => this.onValueChange(e.target.value)} />;
        break;
      case "switch":
        valueField = (
          <Select id={field.data} value={this.state.value} onChange={(value) => this.onValueChange(value)}
            style={{ width: '100%' }}
            getPopupContainer={getContainer}>
            <Option value="true">是</Option>
            <Option value="false">否</Option>
          </Select>
        );
        break;
      case "dropdown":
        valueField = <BirdSelector dicKey={field.source.key} data={field.source.data || []}
          onChange={value => this.onValueChange(value)} selectedValue={this.state.value}
          getPopupContainer={getContainer} />;
        break;
      case "cascader":
        valueField = <BirdCascader data={field.source.data || []} expandTrigger='hover'
          onChange={value => this.onValueChange(value)} value={this.state.value}
          getPopupContainer={getContainer} />;
        break;
      case "date":
        valueField =
          <DatePicker id={field.data} value={this.state.value} format={"yyyy-MM-dd"}
            onChange={(date, dateString) => this.onValueChange(dateString)}
            getCalendarContainer={getContainer} />;
        break;
      case "datetime":
        valueField =
          <DatePicker id={field.data} value={this.state.value} format={"yyyy-MM-dd HH:mm"}
            onChange={(date, dateString) => this.onValueChange(dateString)}
            getCalendarContainer={getContainer} />;
        break;
      default:
        valueField = <span />;
        break;
    }

    let queryContent =
      <Form>
        <FormItem>
          <Select placeholder="请选择操作符"
            style={{ width: '100%' }}
            value={this.state.oprator}
            onChange={(operator => this.onOpratorChange(operator))}
            getPopupContainer={getContainer}>
            {
              searchOperators.map(function (operator) {
                return <Option key={'operator_option_' + operator.value}
                  value={operator.value}>{operator.text}</Option>;
              })
            }
          </Select>
        </FormItem>
        <FormItem>
          {valueField}
        </FormItem>
        <Row gutter={16}>
          <Col sm={12}>
            <Button type="ghost" onClick={() => {
              this.query()
            }}>搜索</Button>
          </Col>
          <Col sm={12}>
            <Button type="ghost" style={{ float: "right" }} onClick={() => {
              this.clear()
            }}>清除</Button>
          </Col>
        </Row>
      </Form>

    return (
      <Popover placement="bottomLeft" content={queryContent} trigger="click">
        <Icon type="search" style={{ marginRight: 5 }} onClick={function (e) {
          e.stopPropagation();
        }}></Icon>
      </Popover>
    );
  }
}

BirdGridQuery.propTypes = {
  field: PropTypes.object.isRequired,
  onFilter: PropTypes.func,
  onClear: PropTypes.func
}

export default BirdGridQuery;
