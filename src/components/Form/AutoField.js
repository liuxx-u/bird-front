import React from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { util } from 'utils';
import BirdSelector from './BirdSelector';
import BirdCascader from './BirdCascader';
import BirdMulti from './BirdMulti';
import BraftEditor from './BraftEditor';
import BirdUpload from '../File/BirdUpload';

import { Form, Input, DatePicker, Switch, Icon, InputNumber, Tooltip } from 'antd';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class AutoField extends React.Component {

  onChange(value) {
    let fieldOption = this.props.fieldOption;
    let dataKey = fieldOption.key;
    this.props.onChange && this.props.onChange(dataKey, value);
  }

  getValueTag(field) {
    let self = this;
    if (typeof (field.value) === 'undefined' || field.value === 'null') {
      field.value = '';
    }
    if (field.render && typeof (field.render) === 'function') return field.render(field.value);

    let innerProps = field.innerProps || {};

    switch (field.fieldType) {
      case "text":
        return <Input {...{
          value: field.value,
          onChange: e => self.onChange(e.target.value),
          disabled: field.disabled,
          placeholder: field.placeholder,
          ...innerProps
        }} />;
      case "textarea":
        return <TextArea {...{
          value: field.value,
          onChange: e => self.onChange(e.target.value),
          disabled: field.disabled,
          placeholder: field.placeholder,
          autosize: { minRows: 4, maxRows: 8 },
          ...innerProps
        }} />;
      case "number":
        return <InputNumber {...{
          value: field.value || 0,
          onChange: value => self.onChange(util.string.isEmpty(value) ? 0 : value),
          disabled: field.disabled,
          placeholder: field.placeholder,
          min: 0,
          step: field.step || 1,
          precision: field.precision || 0,
          style: { width: '100%' },
          ...innerProps
        }} />;
      case "money":
        return <div>
          <InputNumber {...{
            value: field.value || 0,
            onChange: value => self.onChange(util.string.isEmpty(value) ? 0 : value),
            disabled: field.disabled,
            placeholder: field.placeholder,
            min: 0,
            step: field.step || 1,
            precision: field.precision || 2,
            style: { width: '100%' },
            formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            parser: value => value.replace(/\$\s?|(,*)/g, ''),
            ...innerProps
          }} />
          {!innerProps.hideCn && <span>
            {util.number.cnCurrency(field.value || 0)}
          </span>}
        </div>;
      case "switch":
        return <Switch {...{
          checked: field.value + '' === "1" || field.value + '' === 'true',
          onChange: value => self.onChange(value ? true : false),
          disabled: field.disabled,
          checkedChildren: <Icon type="check" />,
          unCheckedChildren: <Icon type="close" />,
          ...innerProps
        }} />;
      case "dropdown":
        return <BirdSelector {...{
          selectedValue: field.value,
          onChange: value => self.onChange(value),
          disabled: field.disabled,
          data: field.source.data || [],
          url: field.source.url,
          dicKey: field.source.key,
          innerProps: innerProps
        }} />;
      case "multi":
        return <BirdMulti {...{
          selectedValue: field.value,
          onChange: value => self.onChange(value),
          disabled: field.disabled,
          options: field.source.data || [],
          url: field.source.url,
          dicKey: field.source.key,
          innerProps: innerProps
        }} />;

      case "cascader":
        return <BirdCascader {...{
          value: field.value,
          onChange: value => self.onChange(value),
          disabled: field.disabled,
          data: field.source.data || [],
          url: field.source.url,
          placeholder: field.placeholder,
          innerProps: innerProps
        }} />;
      case "img":
      case "imgs":
      case "file":
      case "files":
        let fileProps = {
          multiple: field.fieldType === 'imgs' || field.fieldType === 'files',
          disabled: field.disabled,
          listType: field.fieldType === 'img' || field.fieldType === 'imgs' ? 'picture' : 'text',
          value: field.value,
          onChange: value => self.onChange(value),
          ...innerProps
        };

        if (field.fieldType === 'img' || field.fieldType === 'imgs') {
          fileProps.accept = "image/png,image/jpeg,image/jpg,image/gif,image/bmp";
        }

        return <BirdUpload {...fileProps} />;
      case "date":
        return <DatePicker {...{
          value: field.value ? moment(field.value) : null,
          onChange: (date, dateString) => self.onChange(dateString),
          disabled: field.disabled,
          format: "YYYY-MM-DD",
          style: { width: '100%' },
          ...innerProps
        }} />;
      case "datetime":
        return <DatePicker {...{
          value: field.value ? moment(field.value) : null,
          onChange: (date, dateString) => self.onChange(dateString),
          disabled: field.disabled,
          showTime: true,
          format: "YYYY-MM-DD HH:mm:ss",
          style: { width: '100%' },
          ...innerProps
        }} />;
      case "richtext":
        return <BraftEditor {...{
          initValue: field.value,
          contentId: field.key,
          onChange: value => self.onChange(value),
          innerProps: innerProps
        }} />;
      default:
        return <span />;
    }
  }

  render() {
    let fieldOption = this.props.fieldOption;
    let formItemLayout = {
      labelCol: { span: this.props.labelColSpan },
      wrapperCol: { span: 20 - this.props.labelColSpan }
    };

    return <FormItem {...formItemLayout} label={
      <span>
        {(fieldOption.isRequired || fieldOption.required) && <span style={{ color: '#f46e65', marginRight: 4 }}>*</span>}
        {fieldOption.name}
        {fieldOption.tips && <span style={{ marginLeft: 5, fontStyle: 'normal', color: 'rgba(0, 0, 0, 0.45)' }}>
          <Tooltip title={fieldOption.tips}>
            <Icon type="question-circle-o" style={{ marginRight: 4 }} />
          </Tooltip>
        </span>}
      </span>
    }
    >
      {this.getValueTag(fieldOption)}
    </FormItem>;
  }
}

AutoField.propTypes = {
  fieldOption: PropTypes.object.isRequired,
  labelColSpan: PropTypes.number,
  onChange: PropTypes.func
};

AutoField.defaultProps = {
  labelColSpan: 6
};

export default AutoField
