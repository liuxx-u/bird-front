
const DropdownRender=function(v,soucre) {
  let item = soucre.find(p => p.value == v);
  return item ? item.label : '';
};

const SwitchRender=function(v) {
  return v ? '是' : '否';
};

export {DropdownRender,SwitchRender}
