import React from 'react'
import moment from 'moment';
import PropTypes from 'prop-types';
import { config, util } from 'utils';
import BirdSelector from './BirdSelector';
import BirdCascader from './BirdCascader';
import BirdMulti from './BirdMulti';
import BraftEditor from './BraftEditor';

import { Form, Input, Button, DatePicker, Switch, Icon, Upload, InputNumber, Tooltip } from 'antd';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

class AutoField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileList: []
    }
  }

  onFileChange(file) {
    let fileList = file.fileList;
    let field = this.props.fieldOption;
    let multiple = field.fieldType === 'imgs' || field.fieldType === 'files';
    let success = false;

    // read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.path;
      }
      return file;
    });

    // filter successfully uploaded files according to response from server
    fileList = fileList.filter(file => {
      if (file.response) {
        success = file.response.success;
        return success;
      }
      return true;
    });

    //删除response属性，确保每次拿到response时都是服务端最后一次返回的response
    fileList.forEach(file => {
      if (file.response) {
        delete file.response
      }
    })

    //对于单文件上传成功后，移除其他文件
    if (!multiple && success) {
      fileList = fileList.splice(fileList.length - 1, 1);
    }


    this.setState({
      fileList: fileList
    }, () => {
      let pathArr = this.state.fileList.map(f => f.url);
      let strPath = pathArr.filter(path => !util.string.isEmpty(path)).join();
      if (!util.string.isEmpty(strPath) && field.value !== strPath) {
        this.onChange(strPath)
      }
    });
  }

  onFileRemove(file) {
    let fileList = this.state.fileList.filter(f => {
      return f.uid !== file.uid;
    });
    this.setState({
      fileList: fileList
    }, () => {
      let pathArr = this.state.fileList.map(f => f.url);
      this.onChange(pathArr.join())
    });
  }

  initFileFields(field) {
    if (!field) return;
    if (field.fieldType == 'img' || field.fieldType == 'imgs' || field.fieldType == 'file' || field.fieldType == 'files') {
      let fieldValue = field.value || '';
      let fileArr = [];
      if (fieldValue.length > 0) {
        fileArr = fieldValue.split(',').map((p, i) => {
          let ext = p.substring(p.lastIndexOf('.'));
          return {
            uid: i,
            name: 'file' + ext,
            status: 'done',
            url: p,
            thumbUrl: p
          }
        });
      }
      this.setState({
        fileList: fileArr
      })
    }
  }

  componentDidMount() {
    let field = this.props.fieldOption;
    this.initFileFields(field);
  }

  componentWillReceiveProps(nextProps) {
    let field = nextProps.fieldOption;

    if (!util.object.equal(nextProps.field, this.props.fieldOption)) {
      this.initFileFields(field);
    }
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
          onChange={e => self.onChange(e.target.value)} />;
      case "textarea":
        return <TextArea value={field.value} autosize={{ minRows: 4, maxRows: 8 }} disabled={field.disabled}
          onChange={e => self.onChange(e.target.value)} />
      case "number":
        return <InputNumber min={0} step={field.step || 1} precision={field.precision || 0}
          style={{ width: '100%' }}
          value={field.value || 0} disabled={field.disabled}
          onChange={value => self.onChange(util.string.isEmpty(value) ? 0 : value)} />;
      case "money":
        return <InputNumber min={0} step={field.step || 1} precision={field.precision || 0}
          style={{ width: '100%' }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          value={field.value || 0} disabled={field.disabled}
          onChange={value => self.onChange(util.string.isEmpty(value) ? 0 : value)} />;
      case "switch":
        return <Switch disabled={field.disabled}
          checked={field.value == true}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="cross" />}
          onChange={value => self.onChange(value ? "1" : "0")} />;
      case "dropdown":
        return <BirdSelector dicKey={field.source.key} data={field.source.data || []} url={field.source.url}
          onChange={value => self.onChange(value)} selectedValue={field.value} />;
      case "multi":
        return <BirdMulti dicKey={field.source.key} options={field.source.data || []} url={field.source.url}
          onChange={value => self.onChange(value)} selectedValue={field.value} />

      case "cascader":
        return <BirdCascader data={field.source.data || []} url={field.source.url}
          onChange={value => self.onChange(value)} value={field.value} />
      case "img":
      case "imgs":
      case "file":
      case "files":
        let multiple = field.fieldType === 'imgs' || field.fieldType === 'files';
        let fileProps = {
          action: config.api.upload,
          multiple: multiple,
          disabled: field.disabled,
          listType: field.fieldType === 'img' || field.fieldType === 'imgs' ? 'picture' : 'text',
          fileList: self.state.fileList,
          onChange: file => self.onFileChange(file),
          onRemove: file => self.onFileRemove(file)
        };

        if (field.fieldType === 'img' || field.fieldType === 'imgs') {
          fileProps.accept = "image/png,image/jpeg,image/jpg,image/gif,image/bmp";
        }

        return <Upload {...fileProps}>
          <Button type="ghost" disabled={field.disabled}>
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>;
      case "date":
        return <DatePicker value={field.value ? moment(field.value) : null} disabled={field.disabled}
          format={"YYYY-MM-DD"}
          style={{ width: '100%' }}
          onChange={(date, dateString) => self.onChange(dateString)} />;
      case "datetime":
        return <DatePicker value={field.value ? moment(field.value) : null} disabled={field.disabled}
          format={"YYYY-MM-DD HH:mm:ss"}
          style={{ width: '100%' }}
          onChange={(date, dateString) => self.onChange(dateString)} showTime={true} />;
      case "richtext":
        return <BraftEditor initValue={field.value} contentId={field.key} onChange={value => self.onChange(value)} />;
      default:
        return <span />;
    }
  }

  render() {
    let fieldOption = this.props.fieldOption;
    let formItemLayout = {
      labelCol: { span: this.props.labelColSpan },
      wrapperCol: { span: 20 - this.props.labelColSpan },
    };

    return <FormItem {...formItemLayout} label={
      <span>
        {fieldOption.isRequired && <span style={{ color: '#f46e65', marginRight: 4 }}>*</span>}
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
  onChange: PropTypes.func,
}

AutoField.defaultProps = {
  labelColSpan: 6
}


export default AutoField
