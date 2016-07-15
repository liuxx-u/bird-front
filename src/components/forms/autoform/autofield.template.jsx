import React from 'react';
import EmptyTag from '../../uis/empty/empty';
import {ServerHost} from '../../../assets/js/bode/bode.conf';
import {Form,Input,Row,Col,Button, DatePicker,TimePicker,Switch,Icon,Select,Upload,InputNumber } from 'antd';

const FormItem = Form.Item;
const Option=Select.Option;

const render = function() {
    let thisField=this;
    let dataKey=this.props.fieldOption.data;
    let getValueTag=function (field) {
        let onInputChange=function (evnt) {
            thisField.props.onFieldChange(dataKey,evnt.target.value);
        };
        let onSelectChange=function (value) {
            thisField.props.onFieldChange(dataKey,value);
        };
        let onDateTimeChange=function (date,dateString) {
            thisField.props.onFieldChange(dataKey,dateString);
        };
        
        switch (field.type){
            case "text":
                return <Input id={field.data} value={field.initValue} onChange={onInputChange} />;
            case "textarea":
                return <Input id={field.data} value={field.initValue} type="textarea" rows={5} onChange={onInputChange} />;
            case "number":
                return <InputNumber id={field.data} min={0} value={field.initValue} onChange={onInputChange} />;
            case "switch":
                return <Switch id={field.data}
                               checked={field.initValue}
                               checkedChildren={<Icon type="check" />}
                               unCheckedChildren={<Icon type="cross" />}
                               onChange={onSelectChange} />;
            case "dropdown":
                return (
                <Select id={field.data} value={field.initValue} onChange={onSelectChange}>
                    {
                        field.source.map(function (option) {
                            return (
                                <Option value={option.value}>{option.text}</Option>
                            )
                        })
                    }
                </Select>
                );
            case "img":
                let fileProps = {
                    action: ServerHost+'api/File/UploadPic',
                    listType: 'picture',
                    defaultFileList: [{
                        uid: -1,
                        name: 'pic.png',
                        status: 'done',
                        url: field.initValue,
                        thumbUrl: field.initValue,
                    }],
                    onChange:function (file,fileList,event) {
                        if(file.file.status==="done"){
                            file.fileList.shift();
                            thisField.props.onFieldChange(dataKey,file.file.response);
                        }
                    },
                    onRemove:function (file) {
                        thisField.props.onFieldChange(dataKey,"");
                    }
                };
                return <Upload {...fileProps}>
                    <Button type="ghost">
                        <Icon type="upload" /> 点击上传
                    </Button>
                </Upload>;
            case "datepicker":
                return <DatePicker id={field.data} value={field.initValue} format={"yyyy-MM-dd"} onChange={onDateTimeChange} />;
            case "datetimepicker":
                return <DatePicker id={field.data} value={field.initValue} format={"yyyy-MM-dd HH:mm"} onChange={onDateTimeChange} />;
            case "timepicker":
                return <TimePicker id={field.data} value={field.initValue} format={"HH:mm"} onChange={onDateTimeChange} />;
            default:
                return <EmptyTag />;
        }
    }

    let formRow;
    let fieldOption=this.props.fieldOption;
    let formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };
    if(fieldOption[0]){
        let field1=fieldOption[0];
        let field2=fieldOption[1]||false;
        formRow=(
            <Row gutter={16}>
                <Col sm={12}>
                    <FormItem {...formItemLayout} label={field1.title}>
                        {getValueTag(field1)}
                    </FormItem>
                </Col>
                <Col sm={12}>
                    {field2?<FormItem {...formItemLayout} label={field2.title}>{getValueTag(field2)}</FormItem>:<EmptyTag />}
                </Col>
            </Row>
        );
    }
    else {
        formRow=<FormItem {...formItemLayout} label={fieldOption.title}>
            {getValueTag(fieldOption)}
        </FormItem>;
    }

    return formRow;
};

export default render;
