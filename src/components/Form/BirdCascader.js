import React from 'react';
import PropTypes from 'prop-types';
import { Cascader } from 'antd';
import { request, util,deepClone } from 'utils';

class BirdCascader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemHash: {},
      options: []
    }
  }

  onPropsChange(valueArr) {
    this.props.onChange && this.props.onChange(valueArr[valueArr.length - 1], valueArr);
  }

  componentDidMount() {
    if (this.props.data.length > 0) {
      this.initData(this.props.data);
    } else if (this.props.url) {
      request({
        url: this.props.url,
        method: 'GET'
      }).then(data => {
        this.initData(data);
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!util.object.equal(nextProps.data, this.props.data)) {
      this.initData(nextProps.data)
    }
  }

  initData(data) {
    let treeData = deepClone(data);

    let folderNodes = [];
    let options = [];
    let hash = {}
    treeData.forEach(item => {
      hash[item['value']] = item;
      if (item.folder + '' === 'true') {
        folderNodes.push(item);
      }
    });

    treeData.forEach((item) => {
      let hashVP = hash[item['parentValue']]
      if (hashVP) {
        !hashVP['children'] && (hashVP['children'] = [])
        hashVP['children'].push(item)
      } else {
        options.push(item)
      }
    });

    //folder节点,子节点为空时,递归删除
    for (let i = 0, len = folderNodes.length; i < len; i++) {
      let curNode = folderNodes[i];

      while (curNode !== null && typeof (curNode) !== 'undefined') {
        let value = curNode['value'];
        if (hash[value]['children'] && hash[value]['children'].length > 0) break;

        let pValue = curNode['parentValue'];
        let pNode = hash[pValue];
        let pArr = pNode ? pNode['children'] : options;

        let index = pArr.findIndex(item => item['value'] === value);
        if (index === -1) break;

        pArr.splice(index, 1)
        curNode = hash[pValue];
      }
    }


    this.setState({
      itemHash: hash,
      options: options
    });
  }

  formatValue(value) {
    let result = [];

    let hash = this.state.itemHash;
    let curNode = hash[value];
    while (curNode) {
      result.unshift(curNode['value']);
      let pValue = curNode['parentValue'];
      curNode = hash[pValue]
    }
    return result;
  }


  render() {
    let innerProps = this.props.innerProps || {};
    let fValue = this.formatValue(this.props.value);

    return <Cascader {...{
      value: fValue,
      onChange: value => this.onPropsChange(value),
      options: this.state.options,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
      style: { width: this.props.width || '100%' },
      ...innerProps
    }} />
  }
}

BirdCascader.propTypes = {
  url: PropTypes.string,
  data: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  innerProps: PropTypes.object
};

BirdCascader.defaultProps = {
  data: [],
  disabled: false
}



export default BirdCascader;
