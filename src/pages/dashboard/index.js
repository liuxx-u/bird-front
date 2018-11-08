import React from 'react';
import { BirdGrid } from 'components/Grid';

class DashBoardPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let gridOption = {
      title: "表格示例",
      url: {
        // read: "/api/v1/table",
        add: "/test/add",
        edit: "/test/edit",
        delete: "/test/delete"
      },
      dataSource: [
        {
          "id": 1,
          "field-text": "文本1",
          "field-number": 10,
          "field-float": 11.11,
          "field-switch": "true",
          "field-dropdown": "1",
          "field-multi": "1,2",
          "field-cascader": "16",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.doc",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "sss"
        },
        {
          "id": 2,
          "field-text": "文本2",
          "field-number": 20,
          "field-float": 22.22,
          "field-switch": "true",
          "field-dropdown": "2",
          "field-multi": "2,3",
          "field-cascader": "14",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.docx",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "wwww"
        },
        {
          "id": 3,
          "field-text": "文本3",
          "field-number": 30,
          "field-float": 33.33,
          "field-switch": "false",
          "field-dropdown": "4",
          "field-multi": "1,2,4",
          "field-cascader": "21",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.xls",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "33333"
        },
        {
          "id": 4,
          "field-text": "文本4",
          "field-number": 40,
          "field-float": 44.44,
          "field-switch": "false",
          "field-dropdown": "3",
          "field-multi": "1,2,3,4",
          "field-cascader": "13",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.xlsx",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "44444"
        },
        {
          "id": 5,
          "field-text": "文本5",
          "field-number": 50,
          "field-float": 55.55,
          "field-switch": "true",
          "field-dropdown": "1",
          "field-multi": "2,3",
          "field-cascader": "15",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.ppt",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "5555"
        },
        {
          "id": 6,
          "field-text": "文本6",
          "field-number": 60,
          "field-float": 66.66,
          "field-switch": "false",
          "field-dropdown": "3",
          "field-multi": "1,2,3,4",
          "field-cascader": "12",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.pptx",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "6666"
        },
        {
          "id": 7,
          "field-text": "文本7",
          "field-number": 70,
          "field-float": 77.77,
          "field-switch": "true",
          "field-dropdown": "1",
          "field-multi": "1,2",
          "field-cascader": "17",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.pdf",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "7777"
        },
        {
          "id": 8,
          "field-text": "文本8",
          "field-number": 80,
          "field-float": 88.88,
          "field-switch": "false",
          "field-dropdown": "1",
          "field-multi": "1,2,4",
          "field-cascader": "16",
          "field-img": "",
          "field-imgs": "",
          "field-file": "aa.txt",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "8888"
        },
        {
          "id": 9,
          "field-text": "文本9",
          "field-number": 90,
          "field-float": 99.99,
          "field-switch": "true",
          "field-dropdown": "1",
          "field-multi": "2,4",
          "field-cascader": "13",
          "field-img": "",
          "field-imgs": "",
          "field-file": "",
          "field-files": "",
          "field-datetime": "2017-12-01 17:53:04",
          "field-richtext": "9999"
        }
      ],
      checkable: true,
      actions: [{
        name: '外部按钮',
        onClick: function () { }
      }],
      columns: [
        { title: "编号", data: "id", type: "number" },
        { title: "文本", data: "field-text", type: "text", editor: {}, query: true },
        { title: "整数", data: "field-number", type: "number", editor: {}, sum: true, query: true },
        { title: "小数", data: "field-float", type: "number", editor: { step: 0.1, precision: 2 }, sum: true, query: true },
        { title: "布尔值", data: "field-switch", type: "switch", editor: {}, query: true },
        { title: "单选", data: "field-dropdown", type: "dropdown", editor: {}, source: { url: '/api/v1/getOptions' }, query: true },
        { title: "多选", data: "field-multi", type: "multi", editor: {}, source: { key: 'xx' } },
        { title: "级联选择", data: "field-cascader", type: "cascader", editor: {}, source: { url: '/api/v1/tree' }, query: true },
        { title: "图片", data: "field-img", type: "img", editor: { ap: 'hide', ep: 'hide' }, hide: true },
        { title: "多图片", data: "field-imgs", type: "imgs", editor: { ap: 'hide', ep: 'hide' }, hide: true },
        { title: "文件", data: "field-file", type: "file", editor: {} },
        { title: "多文件", data: "field-files", type: "files", editor: { ap: 'hide', ep: 'hide' }, hide: true },
        { title: "时间", data: "field-datetime", type: "datetime", editor: {}, query: true },
        // { title: "富文本", data: "field-richtext", type: "richtext", editor: {}, query: true },
        {
          title: "操作选项", type: "command", actions: [{
            name: '行内按钮',
            onClick: (data) => {
              console.log(data);
            }
          }]
        }
      ]
    };
    return (
      <div>
        <BirdGrid gridOption={gridOption} />
      </div>
    )
  }
}

export default DashBoardPage
