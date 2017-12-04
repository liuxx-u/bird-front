import React from 'react';
import PropTypes from 'prop-types';
import { request, deepClone } from 'utils';
import AutoField from '../Form/AutoField';
import {Form,message} from 'antd';

class BirdGridForm extends React.Component {
  constructor(props) {
    super(props);

    let initValue = deepClone(this.props.formOption.value);
    this.state = {
      initValue: initValue,
      extraParams: this.props.formOption.extraParams
    }
  }

  componentWillReceiveProps(nextProps) {
    var initValue = deepClone(nextProps.formOption.value);
    this.setState({
      initValue: initValue,
      extraParams: nextProps.formOption.extraParams
    });
  }

  onFieldChange(key, value) {
    let initValue = this.state.initValue;
    initValue[key] = value;
    this.setState({
      initValue: initValue
    });
  }

  saveClick(callback) {
    let dto = this.state.initValue;
    let extraParams = this.state.extraParams;
    for (let i = 0; i < extraParams.length; i++) {
      dto[extraParams[i].field] = extraParams[i].value;
    }
    request({
      url: this.props.formOption.saveUrl,
      method: "post",
      data: dto
    }).then(function (result) {
      message.success('保存成功');
      if (callback) callback(result);
    });
  }

  render() {
    let self = this;
    let fieldOptions = [];

    for (let field of this.props.formOption.fields) {
      if (field.type === "command") continue;
      if (field.data === "id") continue;
      if (!field.editor) continue;

      let pattern = self.props.formOption.model === 'add' ? field.editor.ap : field.editor.ep;
      if (pattern === 'hide') continue;

      let fieldOption = {
        name: field.title,
        key: field.data,
        tips: field.editor.tips,
        isRequired: field.editor.isRequired,
        fieldType: field.type,
        value: self.state.initValue[field.data],
        disabled: pattern === 'disabled',
        source: field.source || {}
      }
      fieldOptions.push(fieldOption);
    }
    let fields = fieldOptions.map(function (field, index) {

      return <AutoField key={'auto_field_' + index} fieldOption={field} onChange={(key, value) => {
        self.onFieldChange(key, value)
      }}/>;
    });

    return (
      <Form>
        {fields}
      </Form>
    );
  }
}

BirdGridForm.propTypes = {
  formOption: PropTypes.object.isRequired,
  onChange: PropTypes.func,
}

export default BirdGridForm
