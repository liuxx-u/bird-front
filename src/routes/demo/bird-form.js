import React from 'react';
import { request } from 'utils';
import {Card} from 'antd';
import {BirdForm} from 'components/Form';

const fields=[
  {
    name: '标题',
    key: 'title',
    fieldType: 'text',
    isRequired: true,
    tips:'我是提示啊',
    groupName:'基础信息'
  },
  {
    name: '简介',
    key: 'brief',
    fieldType: 'text',
    groupName:'基础信息'
  },
  {
    name: '链接地址',
    key: 'link',
    fieldType: 'text',
    groupName:'基础信息'
  },
  {
    name: '封面',
    key: 'cover',
    fieldType: 'img',
    groupName:'扩展信息'
  },
  {
    name: '内容',
    key: 'content',
    fieldType: 'richtext',
    groupName:'扩展信息'
  }
];

class BirdFormDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    return (
      <Card>
        <BirdForm fields={fields} lineCapacity={1} saveUrl={'/saveUrl'} withTab={true} value={{}}/>
      </Card>
    )
  }
}

export default BirdFormDemoPage
