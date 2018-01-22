
const DropdownRender=function(v,source) {
  if (!source) return v;
  if(typeof v ==='undefined')return '';

  let item = source[v];
  return item ? item.label : v;
};

const MultiRender = function (v,source) {
  if (!source) return v;
  if (typeof v === 'undefined') return '';

  let vArr = v.split(',');
  let textArr = vArr.map(p => {
    let item = source[p];
    return item ? item.label : ''
  });
  return textArr.join()
}

const SwitchRender=function(v) {
  return v ? '是' : '否';
};

const DateTimeRender=function (v,format) {

}

export {DropdownRender,SwitchRender,MultiRender}
