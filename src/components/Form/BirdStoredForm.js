import React from 'react';
import PropTypes from 'prop-types';
import { request, deepClone } from 'utils';
import BirdForm from './BirdForm';
import {Card} from 'antd';

/**
 * 根据数据库存储的信息渲染的BirdForm组件
 */
class BirdStoredForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      withTab: false,
      saveUrl: '',
      tabType: 'line',
      tabPosition: 'top',
      defaultGroupName: '基础信息',
      lineCapacity:1,
      fields: []
    }
  }

  componentWillMount() {
    let self = this;

    request({
      url: '/sys/form/getFormByKey?key=' + self.props.formKey,
      method: 'get'
    }).then(function (form) {
      let withTab = form.withTab === 'true';
      let tabType = form.tabType || self.state.tabType;
      let tabPosition = form.tabPosition || self.state.tabPosition;
      let defaultGroupName = form.defaultGroupName || self.state.defaultGroupName;
      let lineCapacity = form.lineCapacity||self.state.lineCapacity;
      let saveUrl = self.props.isPreview && form.saveUrl;
      let fields = [];
      for (let field of form.fields) {
        field.source = {};
        let arr = field.fieldType.split(":");
        if (arr.length === 2) {
          field.fieldType = arr[1];
        }
        if (field.optionsKey) {
          field.source = {key: field.optionsKey};
        }
        fields.push(field);
      }
      self.setState({
        withTab: withTab,
        saveUrl: saveUrl,
        tabType: tabType,
        tabPosition: tabPosition,
        defaultGroupName: defaultGroupName,
        lineCapacity:lineCapacity,
        fields: fields
      }, () => {
        self.refs.form.initGroup()
      })
    })
  }

  render() {
    return (
      <Card>
        <BirdForm ref='form'
                  fields={this.state.fields}
                  defaultGroupName={this.state.defaultGroupName}
                  tabPosition={this.state.tabPosition}
                  tabType={this.state.tabType}
                  withTab={this.state.withTab}
                  lineCapacity={this.state.lineCapacity}
                  saveUrl={this.state.saveUrl}/>
      </Card>
    );
  }
}

BirdStoredForm.propTypes = {
  formKey:PropTypes.string.isRequired,
  isPreview:PropTypes.bool
};

BirdStoredForm.defaultProps = {
  isPreview: false
};

export default BirdStoredForm;
