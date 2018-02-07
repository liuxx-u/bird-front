import style from './BirdGrid.less';

const DropdownRender = function (v, source) {
  if (!source) return v;
  if (typeof v === 'undefined' || v === null) return '';

  let item = source[v];
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

}

const ImageRender = function (v) {
  if (!v) v = '';

  let images = v.split(',');
  return images.map(path => {
    return <div key={path} className={style.img_item}>
      <a href={path} target="_blank">
        <img src={path} />
      </a>
    </div>
  });
}

const FileRender = function (v) {
  if (!v) return '';

  let files = v.split(',');
  return files.map(path => {
    return <div key={path}>
      <span>
        <i className="anticon anticon-paper-clip"></i>
        <a href={path} target="_blank" title="file">file</a>
      </span>
    </div>
  })
}

export { DropdownRender, SwitchRender, MultiRender, ImageRender, FileRender }
