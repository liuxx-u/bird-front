import React from 'react';
import PropTypes from 'prop-types';
import BirdSelector from '../../Form/BirdSelector';
import BirdCascader from '../../Form/BirdCascader';
import BirdMulti from '../../Form/BirdMulti';
import moment from 'moment';
import { Select, DatePicker, Input, InputNumber, Row, Col } from 'antd';

const { RangePicker } = DatePicker;

class DefaultFilterItem extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * 默认值改变事件
   */
  onDefaultChange = value => {
    let { queryOption, onChange } = this.props;
    let { key, defaultOpt } = queryOption;

    let filters = [{ field: key, operate: defaultOpt || 'equal', value: value }];
    onChange && onChange(key, filters);
  }

  /** 日期范围值改变事件 */
  onDateRangeChange = values => {
    if (values.length !== 2) return;

    let { queryOption, onChange } = this.props;
    let { key } = queryOption;

    values[1] = values[1] + " 23:59:59";
    let filters = [{ field: key, operate: 'greaterorequal', value: values[0] }, { field: key, operate: 'lessorequal', value: values[1] }];
    onChange && onChange(key, filters);
  }

  /** 数字范围值改变事件 */
  onNumberRangeChange = (value, isEnd) => {
    let { queryOption, onChange } = this.props;
    let { key, filters } = queryOption;

    let start, end;
    if (isEnd) {
      end = value;
      start = filters.length > 0 ? filters[0].value : '';
    } else {
      start = value;
      end = filters.length > 1 ? filters[1].value : '';
    }

    filters = [
      { field: key, operate: 'greaterorequal', value: start },
      { field: key, operate: 'lessorequal', value: end }
    ];

    onChange && onChange(key, filters);
  }

  render() {

    let { queryOption } = this.props;
    let { title, mode, source, filters, innerProps } = queryOption;
    let values = filters.map(p => p.value);
    let value = values.length > 0 ? values[0] : '';

    let valueField;
    switch (mode) {
      case "number":
        valueField = <InputNumber {...{
          min: 0,
          value: value,
          style: { width: '100%' },
          onChange: this.onDefaultChange,
          ...innerProps
        }} />;
        break;
      case "money":
        valueField = <InputNumber {...{
          min: 0,
          value: value,
          formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: value => value.replace(/\$\s?|(,*)/g, ''),
          style: { width: '100%' },
          onChange: this.onDefaultChange,
          ...innerProps
        }} />;
        break;
      case "switch":
        valueField = <Select {...{
          value: value,
          onChange: this.onDefaultChange,
          style: { width: '100%' },
          ...innerProps
        }}>
          <Option value="1">是</Option>
          <Option value="0">否</Option>
        </Select>
          ;
        break;
      case "dropdown":
        valueField = <BirdSelector {...{
          data: source,
          width: '100%',
          onChange: this.onDefaultChange,
          selectedValue: value,
          innerProps: innerProps
        }} />;
        break;
      case "multi":
        valueField = <BirdMulti {...{
          selectedValue: value,
          onChange: this.onDefaultChange,
          options: source,
          innerProps: innerProps
        }} />;
        break;
      case "cascader":
        valueField = <BirdCascader {...{
          data: source,
          expandTrigger: 'hover',
          width: '100%',
          value: value,
          onChange: this.onDefaultChange,
          innerProps: innerProps
        }} />;
        break;
      case "date":
        valueField = <DatePicker {...{
          value: value ? moment(value) : null,
          format: "YYYY-MM-DD",
          style: { width: '100%' },
          onChange: (date, dateString) => this.onDefaultChange(dateString),
          ...innerProps
        }} />;
        break;
      case "datetime":
        valueField = <DatePicker {...{
          value: value ? moment(value) : null,
          format: "YYYY-MM-DD HH:mm",
          style: { width: '100%' },
          onChange: (date, dateString) => this.onDefaultChange(dateString),
          ...innerProps
        }} />;
        break;
      case "date_range":
        valueField =
          <RangePicker {...{
            value: values.map(p => p ? moment(p) : null),
            format: "YYYY-MM-DD",
            style: { width: '100%' },
            onChange: (dates, dateStrings) => this.onDateRangeChange(dateStrings),
            ...innerProps
          }} />;
        break;
      case "number_range":
        valueField =
          <Input.Group compact>
            <InputNumber style={{ width: '45%', textAlign: 'center' }} value={value} onChange={value => this.onNumberRangeChange(value, false)} />
            <Input style={{ width: '10%', borderLeft: 0, padding: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
            <InputNumber style={{ width: '45%', textAlign: 'center', borderLeft: 0 }} value={values.length > 1 ? values[1] : ''} onChange={value => this.onNumberRangeChange(value, true)} />
          </Input.Group>;
        break;

      default:
        valueField = <Input {...{
          value: value,
          style: { width: '100%' },
          onChange: (e) => this.onDefaultChange(e.target.value),
          ...innerProps
        }} />;
    }

    return (
      <Row>
        <Col span={6} style={{ textAlign: 'right', lineHeight: '32px' }}>{title}：</Col>
        <Col span={14}>{valueField}</Col>
      </Row>
    );
  }
}

DefaultFilterItem.propTypes = {
  queryOption: PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    defaultOpt: PropTypes.string,
    mode: PropTypes.string,
    source: PropTypes.array,
    filters: PropTypes.array,
    innerProps: PropTypes.object
  }),
  onChange: PropTypes.func
}

DefaultFilterItem.defaultProps = {
  queryOption: {
    defaultOpt: 'equal',
    mode: 'text',
    source: [],
    filters: [],
    innerProps: {}
  }
}

export default DefaultFilterItem;
