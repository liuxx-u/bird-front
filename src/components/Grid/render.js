
const DropdownRender=function(v,source) {

  if (!source) return v;
  let item = source[v];
  return item ? item.label : v;
};

const SwitchRender=function(v) {
  return v ? '是' : '否';
};

export {DropdownRender,SwitchRender}
