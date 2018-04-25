// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

module.exports = () => {
  const themePath = path.join(__dirname, './src/themes/default.less'); //导入覆盖样式的less
  return lessToJs(fs.readFileSync(themePath, 'utf8'));
};
