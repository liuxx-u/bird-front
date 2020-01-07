import React from 'react';
import PropTypes from 'prop-types';
import { request } from 'utils';
import BirdForm from './BirdForm';
import { Card } from 'antd';

/**
 * 根据数据库存储的信息渲染的BirdForm组件
 */
class BirdStoredForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      option: {
        withTab: false,
        tabType: 'line',
        tabPosition: 'top',
        defaultGroupName: '基础信息',
        lineCapacity: 1,
        saveUrl: '',
        fields: []
      }
    }
  }

  isValueChanged() {
    return this.refs.form.isValueChanged();
  }

  getResult() {
    return this.refs.form.getResult();
  }

  validate() {
    return this.refs.form.validate();
  }

  componentDidMount() {
    let self = this;

    request({
      url: '/sys/form/getFormByKey?key=' + self.props.formKey,
      method: 'get'
    }).then(function (form) {
      if(!form)return;
      let defaultFormOption = self.state.option;
      let formOption = {
        withTab: form.withTab === 'true',
        tabType: form.tabType || defaultFormOption.tabType,
        tabPosition: form.tabPosition || defaultFormOption.tabPosition,
        defaultGroupName: form.defaultGroupName || defaultFormOption.defaultGroupName,
        lineCapacity: form.lineCapacity || defaultFormOption.lineCapacity
      }

      if (!self.props.isPreview) {
        formOption.saveUrl = form.saveUrl;
      };
      let fields = [];
      for (let field of form.fields) {
        field.source = {};
        field.fieldType = field.fieldType.substring(field.fieldType.lastIndexOf(":") + 1)

        if (field.optionsKey) {
          if (field.optionsKey.indexOf("/") === 0 || field.optionsKey.indexOf("http:") === 0) {
            field.source = { url: field.optionsKey };
          } else {
            field.source = { key: field.optionsKey };
          }
        }
        if (self.props.blockFields.includes(field.key)) {
          field.disabled = true;
        }
        fields.push(field);
      }
      formOption.fields = fields;
      self.props.onLoad && self.props.onLoad(formOption);

      self.setState({
        option: formOption
      }, () => {
        self.refs.form.initGroup()
      })
    })
  }

  render() {
    let formOption = {
      ...this.state.option,
      value: this.props.value,
      onChange: this.props.onChange,
      onFieldChange: this.props.onFieldChange,
      afterSave: this.props.afterSave,
      disabled: this.props.disabled
    }

    return (
      <Card>
        <BirdForm ref='form' {...formOption} />
      </Card>
    );
  }
}

BirdStoredForm.propTypes = {
  formKey: PropTypes.string.isRequired,

  value: PropTypes.object,
  onChange: PropTypes.func,
  onFieldChange: PropTypes.func,
  afterSave: PropTypes.func,

  onLoad: PropTypes.func,
  blockFields: PropTypes.array,
  disabled: PropTypes.bool,
  isPreview: PropTypes.bool
};

BirdStoredForm.defaultProps = {
  isPreview: false,
  blockFields: [],
  disabled: false,
  value: {}
};

export default BirdStoredForm;
