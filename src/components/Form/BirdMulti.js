import React from 'react';
import PropTypes from 'prop-types';
import { request, config } from 'utils';
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

const formatOption = options => {
  if (!options || options.length == 0) return [];

  return options.map(o => {
    if (typeof (o['disabled']) == 'string') o['disabled'] = o['disabled'] === 'true';
    return o;
  });
}

class BirdMulti extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: this.props.options || []
    }
  }

  componentDidMount() {
    let self = this;
    if (self.props.options.length > 0) return;

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
          options: formatOption(result.options)
        });
        result.defaultCode && self.onPropsChange(result.defaultCode);
      });
    }
  }

  checkAll = () => {
    let allValues = this.state.options.filter(o => !o.disabled).map(p => p.value);
    if (allValues.length == 0) return;

    let checkedValues = this.props.selectedValue ? this.props.selectedValue.split(',') : [];
    let isCheckAll = checkedValues.length == this.state.options.length;
    if (isCheckAll) {
      this.onPropsChange('');
    } else {
      this.onPropsChange(allValues.join());
    }
  }

  onPropsChange = (value) => {
    this.props.onChange && this.props.onChange(value);
  }

  render() {
    let checkedValues = this.props.selectedValue ? this.props.selectedValue.split(',') : [];
    let isCheckAll = checkedValues.length == this.state.options.length;
    let options = this.state.options.map(option => { option.disabled = option.disabled + ''==='true'; return option });

    return (
      <div>
        {this.props.canCheckAll && <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={checkedValues.length > 0 && !isCheckAll}
            onChange={this.checkAll}
            checked={checkedValues.length > 0 && isCheckAll}
          >
            全选
          </Checkbox>
          <br />
        </div>}
        <CheckboxGroup
          options={options}
          value={checkedValues}
          disabled={this.props.disabled}
          onChange={cvs => {
            let fv = cvs.join();
            this.onPropsChange(fv);
          }}
        />
      </div>
    )
  }
}

BirdMulti.propTypes = {
  options: PropTypes.array,
  url: PropTypes.string,
  dicKey: PropTypes.string,

  disabled: PropTypes.bool,
  selectedValue: PropTypes.string,//多个值以逗号分隔
  canCheckAll: PropTypes.bool,
  onChange: PropTypes.func
};

BirdMulti.defaultProps = {
  options: [],
  disabled: false,
  canCheckAll: false
}

export default BirdMulti;
