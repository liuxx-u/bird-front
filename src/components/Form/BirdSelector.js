import React from 'react';
import PropTypes from 'prop-types';
import { request, config, util } from 'utils';
import { Select } from 'antd';

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

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!util.object.equal(nextProps.data, this.props.data)) {
      this.setState({
        options: nextProps.data
      })
    }
  }

  onPropsChange(value) {
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    let self = this;
    return (
      <Select style={{ width: self.props.width }}
        showSearch={self.props.showSearch}
        filterOption={(input, option) => self.props.filterOption(input, option)}
        getPopupContainer={self.props.getPopupContainer}
        disabled={self.props.disabled}
        onChange={value => self.onPropsChange(value)}
        value={typeof (self.props.selectedValue) === 'undefined' ? '' : self.props.selectedValue + ''}>
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
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  getPopupContainer: PropTypes.func,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  filterOption: PropTypes.func
};

BirdSelector.defaultProps = {
  width: '100%',
  data: [],
  getPopupContainer: () => document.body,
  showSearch: true,
  filterOption: (input, option) => { return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
}

export default BirdSelector;
