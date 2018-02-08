import React from 'react';
import PropTypes from 'prop-types';
import { request, config } from 'utils';
import { Select } from 'antd';

const formatOption = options => {
  if (!options || options.length == 0) return [];

  return options.map(o => {
    if (typeof (o['disabled']) == 'string') o['disabled'] = o['disabled'] === 'true';
    return o;
  });
}

class BirdSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: '',
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
          options: formatOption(result)
        })
      });
    } else if (self.props.dicKey) {
      request({
        url: config.api.getDic + self.props.dicKey,
        method: "get"
      }).then(function (result) {
        self.setState({
          placeholder: result.placeholder,
          options: formatOption(result.options)
        });
        result.defaultCode && self.onPropsChange(result.defaultCode);
      });
    }
  }

  onPropsChange(value) {
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    let self = this;
    return (
      <Select style={{ width: self.props.width }} getPopupContainer={self.props.getPopupContainer}
        onChange={value => self.onPropsChange(value)} value={self.props.selectedValue || ''}>
        {this.state.options.map((option, index) => (
          <Select.Option key={'selector_' + self.props.dicKey + '_' + index} value={option.value}
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
  size: PropTypes.string,
  selectedValue: PropTypes.string,
  getPopupContainer: PropTypes.func,
  onChange: PropTypes.func
};

BirdSelector.defaultProps = {
  width: '100%',
  data: [],
  getPopupContainer: () => document.body
}

export default BirdSelector;
