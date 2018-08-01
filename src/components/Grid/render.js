import style from './BirdGrid.less';
import { util } from 'utils';
import { Icon } from 'antd';

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

const ImageRender = function (v) {
  if (!v) v = '';

  let images = v.split(',');
  return images.map(path => {
    return <div key={path} className={style.img_item}>
      <a href={path} target="_blank" rel="noopener noreferrer">
        <img src={path} alt="" />
      </a>
    </div>
  });
}

const getFileIcon = function (path) {
  if (!path || path.length === 0) {
    return <span />
  }
  let ext = path.substring(path.lastIndexOf('.'));
  switch (ext) {
    case '.doc':
    case '.docx':
      return <Icon type="file-word" />;
    case '.xls':
    case '.xlsx':
      return <Icon type="file-excel" />;
    case '.ppt':
    case '.pptx':
      return <Icon type="file-ppt" />;
    case '.pdf':
      return <Icon type="file-pdf" />;
    case '.txt':
      return <Icon type="file-text" />;
    default:
      return <Icon type="file" />;
  }
}
const FileRender = function (v) {
  if (!v) return '';

  let files = v.split(',');
  return files.map(path => {
    return <div key={path}>
      <span>
        {getFileIcon(path)}
        <a href={path} target="_blank" rel="noopener noreferrer" title="file">file</a>
      </span>
    </div>
  })
}

const MoneyRender = function (v) {
  if (isNaN(v)) v = 0;
  let money = (Math.round(v * 100) / 100).toFixed(2);
  return `${money}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { DropdownRender, SwitchRender, DateTimeRender, MultiRender, ImageRender, FileRender, MoneyRender }
