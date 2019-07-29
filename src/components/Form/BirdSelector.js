import React from 'react';
import PropTypes from 'prop-types';
import { request, config, util } from 'utils';
import { Select } from 'antd';

const defaultInnerProps = {
  showSearch: true,
  allowClear: true,
  filterOption: (input, option) => { return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
}

const multiModes = ['multiple', 'tags'];

class BirdSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: '请选择',
      options: this.props.data || []
    }
  }

  componentDidMount() {
    let self = this;
    if (self.props.data.length > 0) return;

    if (self.props.url) {
      request({
        url: self.props.url,
        method: "get"
      }).then(function (result) {
        self.setState({
          options: result
        })
      });
    } else if (self.props.dicKey) {
      request({
        url: config.api.getDic + self.props.dicKey,
        method: "get"
      }).then(function (result) {
        self.setState({
          placeholder: result.placeholder,
          options: result.options
        });
        result.defaultCode && self.onPropsChange(result.defaultCode);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!util.object.equal(nextProps.data, this.props.data)) {
      this.setState({
        options: nextProps.data
      })
    }
  }

  onPropsChange = value => {
    let {innerProps = {}} = this.props;
    if (multiModes.includes(innerProps.mode)) {
      value = value.join();
    }

    if (typeof (value) === 'undefined') value = '';
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    let {innerProps = {},selectedValue:value} = this.props;
    value = typeof (value) === 'undefined' ? '' : value + '';

    if (multiModes.includes(innerProps.mode)) {
      value = value.split(",").filter(p => !util.string.isEmpty(p));
    }


    return (
      <Select {...{
        value: value,
        onChange: this.onPropsChange,
        disabled: this.props.disabled,
        style: { width: this.props.width },
        placeholder: this.state.placeholder,
        ...defaultInnerProps,
        ...innerProps
      }}>
        {this.state.options.map((option, index) => (
          <Select.Option key={`selector_${index}`} value={option.value}
            disabled={option.disabled + '' === 'true'}>{option.label}</Select.Option>
        ))}
      </Select>
    )
  }
}

BirdSelector.propTypes = {
  data: PropTypes.array,
  url: PropTypes.string,
  dicKey: PropTypes.string,
  disabled: PropTypes.bool,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  innerProps: PropTypes.object
};

BirdSelector.defaultProps = {
  width: '100%',
  data: []
}

export default BirdSelector;
