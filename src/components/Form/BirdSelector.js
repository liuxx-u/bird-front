import React from 'react';
import PropTypes from 'prop-types';
import { request, config, util } from 'utils';
import { Select } from 'antd';

const defaultInnerProps = {
  showSearch: true,
  filterOption: (input, option) => { return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
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
    let innerProps = this.props.innerProps || {};
    return (
      <Select {...{
        value: typeof (self.props.selectedValue) === 'undefined' ? '' : self.props.selectedValue + '',
        onChange: value => self.onPropsChange(value),
        disabled: self.props.disabled,
        style: { width: self.props.width },
        ...defaultInnerProps,
        ...innerProps
      }}>
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
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  innerProps: PropTypes.object
};

BirdSelector.defaultProps = {
  width: '100%',
  data: []
}

export default BirdSelector;
