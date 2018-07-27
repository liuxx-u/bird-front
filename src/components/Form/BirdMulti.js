import React from 'react';
import PropTypes from 'prop-types';
import { request, config, util } from 'utils';
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

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
          options: result
        })
      });
    } else if (self.props.dicKey) {
      request({
        url: config.api.getDic + self.props.dicKey,
        method: "get"
      }).then(function (result) {
        self.setState({
          options: result.options
        });
        result.defaultCode && self.onPropsChange(result.defaultCode);
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!util.object.equal(nextProps.options, this.props.options)) {
      this.setState({
        options: nextProps.options
      })
    }
  }

  checkAll = () => {
    let allValues = this.state.options.filter(o => !o.disabled).map(p => p.value);
    if (allValues.length === 0) return;

    let checkedValues = this.props.selectedValue ? this.props.selectedValue.split(',') : [];
    let isCheckAll = checkedValues.length === this.state.options.length;
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
    let innerProps = this.props.innerProps || {};
    let checkedValues = this.props.selectedValue ? this.props.selectedValue.split(',') : [];
    let isCheckAll = checkedValues.length === this.state.options.length;

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
        <CheckboxGroup {...{
          value:checkedValues,
          onChange:cvs => {let fv = cvs.join();this.onPropsChange(fv);},
          disabled:this.props.disabled,
          options:this.state.options,
          ...innerProps
        }}
          options={this.state.options}
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
  onChange: PropTypes.func,
  innerProps: PropTypes.object
};

BirdMulti.defaultProps = {
  options: [],
  disabled: false,
  canCheckAll: false
}

export default BirdMulti;
