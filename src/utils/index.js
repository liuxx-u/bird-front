/* global window */
import classnames from 'classnames';
import lodash from 'lodash';
import config from './config';
import request from './request';
import util from './util';
import permission from './permission';
import { color } from './theme';

/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'parentId', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * 数组格式转hash表
 * @param array
 * @param key
 * @returns {{}}
 */
const arrayToHash=(array,key='value')=> {
  let hash = {}
  let data = lodash.cloneDeep(array)
  data.forEach(item => {
    hash[item[key]] = item;
  })
  return hash;
}

/**
 * 深拷贝对象
 * @param p 源对象
 * @param c 目标对象
 * @returns {*}
 */
const deepClone = (p,c) => {
  var c = c ? c : p.constructor === Array ? [] : {};
  for (var i in p) {
    if (typeof p[i] === 'object') {
      if (p[i] == null) {
        c[i] = null;
        continue;
      }
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepClone(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}

export {
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  arrayToHash,
  deepClone,
  util,
  permission
}
