import React from 'react';
import EmptyTag from '../../uis/empty/empty';
import AutoField from './autofield';
import {BodeTools} from '../../../assets/js/bode/bode'
import {Form,message,Button} from 'antd';

const render = function() {
    let value=this.state.initValue;
    let isSeparate=this.props.formOption.isSeparate;

    let fieldOptionGroup=[],cacheArr=[];

    for(let field of this.props.formOption.fields){
        if(field.type==="command")continue;
        field.initValue=value[field.data];
        if(field.isSeparate){
            cacheArr.push(field);
        }
        else if(!isSeparate){
            fieldOptionGroup.push(field);
        }
        else {
            cacheArr.push(field);
        }

        if(cacheArr.length==2){
            let optionArr=BodeTools.deepClone(cacheArr);
            cacheArr.length=0;
            fieldOptionGroup.push(optionArr);
        }
    }
    if(cacheArr.length>0){
        fieldOptionGroup.push(cacheArr);
    }

    let fieldKey=0;
    let fieldChange=this.onFieldChange;
    let fields=fieldOptionGroup.map(function (field) {
        return <AutoField key={fieldKey++} fieldOption={field} onFieldChange={fieldChange} />;
    });

    let formHead,formFoot;
    if(this.props.formOption.isModelForm){
        formHead=<EmptyTag />;
        formFoot=<EmptyTag />;
    }
    else {
        formFoot=<div style={{width:"100%",textAlign:"center"}}>
            <Button type="primary" onClick={this.saveClick}>保存</Button>
        </div>;
    }


    return (
        <Form horizontal onFieldsChange={this.onChange}>
            {fields}
            {formFoot}
        </Form>
    );
};

export default render;
