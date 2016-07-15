import React from 'react';
import EmptyTag from '../../../uis/empty/empty';
import {Icon,Popover,Form,Select,Col,Row,Button,DatePicker,TimePicker,Switch,Input,InputNumber } from 'antd';

const FormItem=Form.Item;
const Option=Select.Option;

const render = function() {
    let field=this.props.field;
    let searchOperators=this.state.searchOperators.common;
    switch(field.type){
        case "number":
        case "datepicker":
        case "datetimepicker":
        case "timepicker":
            searchOperators=searchOperators.concat(this.state.searchOperators.struct);
            break;
        case "text":
        case "textarea":
            searchOperators=searchOperators.concat(this.state.searchOperators.text);
        default:
            break;
    }

    let queryOpratorChange=this.onOpratorChange;
    let onOpratorChange=function (operator) {
        queryOpratorChange(operator);
    };

    let queryValueChange=this.onValueChange;
    let onInputChange=function (evnt) {
        queryValueChange(evnt.target.value);
    };
    let onSelectChange=function (value) {
        queryValueChange(value);
    };
    let onDateTimeChange=function (date,dateString) {
        queryValueChange(dateString);
    };

    let getContainer=function (el) {
        return el;
    };

    let valueField;
    switch (field.type) {
        case "text":
        case "textarea":
            valueField = <Input id={field.data} value={this.state.value} onChange={onInputChange}/>;
            break;
        case "number":
            valueField = <InputNumber id={field.data} min={0} value={this.state.value} onChange={onInputChange}/>;
            break;
        case "switch":
            valueField = (
                <Select id={field.data} value={this.state.value} onChange={onSelectChange} style={{ width: '100%' }} getPopupContainer={getContainer}>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                </Select>
            );
            break;
        case "dropdown":
            valueField = (
                <Select id={field.data}
                        value={this.state.value}
                        onChange={onSelectChange}
                        style={{ width: '100%' }}
                        getPopupContainer={getContainer}>
                    {
                        field.source.map(function (option) {
                            return (
                                <Option value={option.value}>{option.text}</Option>
                            )
                        })
                    }
                </Select>
            );
            break;
        case "datepicker":
            valueField =
                <DatePicker id={field.data} value={this.state.value} format={"yyyy-MM-dd"} onChange={onDateTimeChange} getCalendarContainer={getContainer}/>;
            break;
        case "datetimepicker":
            valueField = <DatePicker id={field.data} value={this.state.value} format={"yyyy-MM-dd HH:mm"} onChange={onDateTimeChange} getCalendarContainer={getContainer}/>;
            break;
        case "timepicker":
            valueField =
                <TimePicker id={field.data} value={this.state.value} format={"HH:mm"} onChange={onDateTimeChange} getCalendarContainer={getContainer}/>;
            break;
        default:
            valueField = <EmptyTag />;
            break;
    }

    let queryContent=
        <Form>
            <FormItem>
                <Select placeholder="请选择操作符"
                        style={{ width: '100%' }}
                        value={this.state.oprator}
                        onChange={onOpratorChange}
                        getPopupContainer={getContainer}>
                    {
                        searchOperators.map(function (operator) {
                            return <Option value={operator.value}>{operator.text}</Option>;
                        })
                    }
                </Select>
            </FormItem>
            <FormItem>
                {valueField}
            </FormItem>
            <Row gutter={16}>
                <Col sm={12}>
                    <Button type="ghost" onClick={this.query}>搜索</Button>
                </Col>
                <Col sm={12}>
                    <Button type="ghost" style={{float:"right"}} onClick={this.clear}>清除</Button>
                </Col>
            </Row>
        </Form>

    return (
        <Popover placement="bottomLeft" content={queryContent} trigger="click">
            <Icon  type="search" style={{marginRight:5}} onClick={function(e) {e.stopPropagation();}}></Icon>
        </Popover>
    );
};

export default render;
