import React from 'react';
import PropTypes from 'prop-types';
import { request,config } from 'utils';
import {Select} from 'antd';
const Option = Select.Option;

class BirdSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placeholder: '',
      options: this.props.data || [],
      selectedValue: '',
    }
  }

  componentDidMount() {
    let self = this;
    if (!self.props.dicKey) return;

    request({
      url: config.api.getDic + self.props.dicKey,
      method: "get"
    }).then(function (result) {
      self.setState({
        placeholder: result.placeholder,
        options: result.options,
        selectedValue: self.props.selectedValue || result.defaultCode
      })
    });
  }

  onPropsChange(value) {
    this.setState({
      selectedValue: value
    })
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    let self = this;
    return (
      <Select style={{width: self.props.width}} getPopupContainer={self.props.getPopupContainer}
              onChange={value => self.onPropsChange(value)} value={self.state.selectedValue}>
        {this.state.options.map((option, index) => (
          <Option key={'selector_' + self.props.dicKey + '_' + index} value={option.value}
                  disabled={option.disable == 'true'}>{option.label}</Option>
        ))}
      </Select>
    )
  }
}

BirdSelector.propTypes = {
  dicKey:PropTypes.string,
  data:PropTypes.array,
  disabled:PropTypes.bool,
  size:PropTypes.string,
  selectedValue:PropTypes.string,
  width:PropTypes.string,
  getPopupContainer:PropTypes.func,
  onChange:PropTypes.func
};

BirdSelector.defaultProps={
  width:'100%',
  getPopupContainer:() => document.body
}

export default BirdSelector;
