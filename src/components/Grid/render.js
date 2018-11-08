import { util } from 'utils';
import FileIcon from '../File/FileIcon';
import { Row, Col } from 'antd';

const DropdownRender = function (v, source) {
  if (!source) return v;
  if (typeof v === 'undefined' || v === null) return '';

  let item = source[v + ''];
  return item ? item.label : v;
};

const MultiRender = function (v, source) {
  if (!source) return v;
  if (typeof v === 'undefined' || v === null) return '';

  let vArr = v.split(',');
  let textArr = vArr.map(p => {
    let item = source[p];
    return item ? item.label : ''
  });
  return textArr.join()
}

const SwitchRender = function (v) {
  return v ? '是' : '否';
};

const DateTimeRender = function (v, format) {
  if (util.string.isEmpty(v)) return '';

  return util.date.format(v, format);
}

const getPreviewExtra = function (rowData) {
  if (!rowData) return '';

  let datas = []
  for (let key in rowData) {
    datas.push(rowData[key])
  }
  return <Row>
    {datas.map((data, index) => {
      return <Col span={8} key={`preview_${index}`} style={{ height: 22, lineHeight: '22px' }}>
        <Row>
          <Col span={8} style={{ textAlign: "right", paddingRight: 5 }}>{`${data.title}:`}</Col>
          <Col span={16}>{data.formatValue}</Col>
        </Row>
      </Col>
    })}
  </Row>;
}

const ImageRender = function (v, rowData) {
  if (!v) v = '';

  let images = v.split(',');
  return images.map(path => {
    let ext = path.substring(path.lastIndexOf('.'));
    return <FileIcon url={path} width={20} height={20} nameVisible={false} fileName={'file' + ext} previewExtra={getPreviewExtra(rowData)} />
  });
}

const FileRender = function (v, rowData) {
  if (!v) return '';

  let files = v.split(',');
  return files.map(path => {
    let ext = path.substring(path.lastIndexOf('.'));
    return <FileIcon url={path} mode="inline" width={20} height={20} fileName={'file' + ext} previewExtra={getPreviewExtra(rowData)} />
  })
}

const MoneyRender = function (v) {
  if (isNaN(v)) v = 0;
  let money = (Math.round(v * 100) / 100).toFixed(2);
  return `${money}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { DropdownRender, SwitchRender, DateTimeRender, MultiRender, ImageRender, FileRender, MoneyRender }
