import React from 'react';
import {Card} from 'antd';
import {BirdForm} from 'components/Form';

const fields=[
  {
    name: '标题',
    key: 'title',
    fieldType: 'text',
    isRequired: true,
    tips:'我是提示啊',
    groupName:'基础信息',
    innerProps:{
      addonAfter:'after'
    }
  },
  {
    name: '链接地址',
    key: 'link',
    fieldType: 'text',
    groupName:'基础信息',
    innerProps:{
      addonBefore:'http://'
    }
  },
  {
    name: '简介',
    key: 'brief',
    fieldType: 'textarea',
    groupName:'基础信息',
    innerProps:{
      autosize:{ minRows: 2, maxRows: 60 }
    }
  },
  {
    name: '排序号',
    key: 'orderNo',
    fieldType: 'number',
    groupName:'基础信息',
    innerProps:{
      step:10
    }
  },
  {
    name: '是否发布',
    key: 'publish',
    fieldType: 'switch',
    groupName:'基础信息',
    innerProps:{
      checkedChildren:"yes"
    }
  },
  {
    name: '发布时间',
    key: 'publishTime',
    fieldType: 'datetime',
    groupName:'基础信息',
    innerProps:{
      disabledDate:()=>{return true}
    }
  },
  {
    name: '单选测试',
    key: 'test1',
    fieldType: 'dropdown',
    source:{url:'/api/v1/getOptions'},
    groupName:'基础信息',
    innerProps:{
      allowClear:false
    }
  },
  {
    name: '多选测试',
    key: 'test2',
    fieldType: 'multi',
    source:{url:'/api/v1/getOptions'},
    groupName:'基础信息'
  },
  {
    name: '级联测试',
    key: 'test3',
    fieldType: 'cascader',
    source:{url:'/api/v1/tree'},
    groupName:'基础信息',
    innerProps:{
      allowClear:false
    }
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
    groupName:'扩展信息',
    innerProps:{
      height : 500
    }
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
