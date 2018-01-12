import React from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { config } from 'utils';
import BirdSelector from './BirdSelector';
import BirdCascader from './BirdCascader';
import LzEditor from 'components/LzEditor';
import styles from './AutoField.less';

import {Form,Input,Button, DatePicker,Switch,Icon,Upload,InputNumber,Tooltip } from 'antd';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class AutoField extends React.Component {
  constructor(props) {
    super(props)
  }

  onChange(value) {
    let dataKey = this.props.fieldOption.key;
    this.props.onChange && this.props.onChange(dataKey, value);
  }

  getValueTag(field) {
    let self = this;
    if (typeof (field.value) == 'undefined' || field.value == 'null') {
      field.value = '';
    }
    if (field.render && typeof (field.render) === 'function') return field.render(field.value);

    switch (field.fieldType) {
      case "text":
        return <Input value={field.value} disabled={field.disabled}
                      onChange={e => self.onChange(e.target.value)}/>;
      case "textarea":
        return <TextArea value={field.value} autosize={true} disabled={field.disabled}
                         onChange={e => self.onChange(e.target.value)}/>
      case "number":
        let step = field.step || 1;
        let precision = field.precision || 0;
        return <InputNumber min={0} step={step} precision={precision}
                            style={{width:'100%'}}
                            value={field.value} disabled={field.disabled}
                            onChange={value => self.onChange(value)}/>;
      case "switch":
        return <Switch disabled={field.disabled}
                       checked={field.value == true}
                       checkedChildren={<Icon type="check"/>}
                       unCheckedChildren={<Icon type="cross"/>}
                       onChange={value => self.onChange(value ? "1" : "0")}/>;
      case "dropdown":
        return <BirdSelector dicKey={field.source.key} data={field.source.data || []} url={field.source.url}
                             onChange={value => self.onChange(value)} selectedValue={field.value}/>;

      case "cascader":
        return <BirdCascader data={field.source.data || []} url={field.source.url}
                             onChange={value => self.onChange(value)} value={field.value}/>
      case "img":
        let fileProps = {
          action: config.api.upload,
          listType: 'picture',
          defaultFileList: [{
            uid: -1,
            name: 'pic.png',
            status: 'done',
            url: field.value,
            thumbUrl: field.value,
          }],
          onChange: function (file, fileList, event) {
            if (file.file.status === "done") {
              file.fileList.shift();
              self.onChange(file.file.response.path);
            }
          },
          onRemove: function (file) {
            self.onChange("");
          }
        };
        return <Upload {...fileProps}>
          <Button type="ghost" disabled={field.disabled}>
            <Icon type="upload"/> 点击上传
          </Button>
        </Upload>;
      case "date":
        return <DatePicker value={field.value ? moment(field.value) : null} disabled={field.disabled}
                           format={"YYYY-MM-DD"}
                           style={{width:'100%'}}
                           onChange={(date, dateString) => self.onChange(dateString)}/>;
      case "datetime":
        return <DatePicker value={field.value ? moment(field.value) : null} disabled={field.disabled}
                           format={"YYYY-MM-DD HH:mm"}
                           style={{width:'100%'}}
                           onChange={(date, dateString) => self.onChange(dateString)} showTime={true}/>;
      case "richtext":
        return <LzEditor initValue={field.value} onChange={value => self.onChange(value)}/>;
      default:
        return <span/>;
    }
  }

  render() {
    let fieldOption = this.props.fieldOption;
    let formItemLayout = {
      labelCol: {span: this.props.labelColSpan},
      wrapperCol: {span: 20 - this.props.labelColSpan},
    };

    return <FormItem {...formItemLayout} label={
      <span>
        {fieldOption.isRequired && <span style={{color: '#f46e65', marginRight: 4}}>*</span>}
        {fieldOption.name}
        {fieldOption.tips && <span style={{marginLeft: 5, fontStyle: 'normal', color: 'rgba(0, 0, 0, 0.45)'}}>
          <Tooltip title={fieldOption.tips}>
            <Icon type="info-circle-o" style={{marginRight: 4}}/>
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
  labelColSpan:PropTypes.number,
  onChange: PropTypes.func,
}

AutoField.defaultProps = {
  labelColSpan: 6
}


export default AutoField
