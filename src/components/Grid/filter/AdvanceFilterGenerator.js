import React from 'react';
import PropTypes from 'prop-types';
import AdvanceFilterItem from './AdvanceFilterItem';
import { Row, Col, Button } from 'antd';

class AdvanceFilterGenerator extends React.Component {
  constructor(props) {
    super(props);
  }

  /** 值改变事件 */
  filterChange = (index, rule) => {
    let { filterRules, onChange } = this.props;
    filterRules[index] = rule;

    onChange && onChange(filterRules);
  }

  /** 添加查询项 */
  addFilter = () => {
    let { queryColumns, filterRules, onChange } = this.props;
    if (queryColumns.length === 0) return;

    filterRules.push({
      field: queryColumns[0]['key'],
      operate: 'equal',
      value: ''
    });
    onChange && onChange(filterRules);
  }

  /** 移除查询项 */
  removeFilter = index => {
    let { filterRules, onChange } = this.props;
    if (index >= filterRules.length) return;

    filterRules.splice(index, 1);
    onChange && onChange(filterRules);
  }

  /** 获取静态查询条件（第一个高级查询条件，不允许删除） */
  getStaticFilter = (actions = []) => {
    let { filterRules, queryColumns } = this.props;
    return <Row>
      <Col span={16}>
        <AdvanceFilterItem queryColums={queryColumns} rule={filterRules[0]} onChange={rule => this.filterChange(0, rule)} />
      </Col>
      <Col span={8}>
        <Button.Group>
          <Button icon='plus' onClick={this.addFilter} />
          {actions.map(action => action)}
        </Button.Group>
      </Col>
    </Row>
  }

  /** 获取动态查询条件（动态添加的查询条件，可删除） */
  getDynamicFilters = () => {
    let { filterRules, queryColumns } = this.props;

    let filterGroups = [[]];
    for (let i = 1, len = filterRules.length; i < len; i++) {
      let offset = i % 3;
      let groupIndex = (i - offset) / 3;
      if (offset === 0) {
        filterGroups.push([]);
        groupIndex--;
      }
      filterGroups[groupIndex].push(filterRules[i]);
    }

    return filterGroups.map((group, gindex) => {
      return <Row key={'filter_group_' + gindex}>
        {group.map((rule, rindex) => {
          let index = gindex * 3 + rindex + 1;//在filterRules中的index
          return <Col span={8} key={'filter_group_' + gindex + '_rule_' + rindex} style={{ marginBottom: 10 }}>
            <Row>
              <Col span={20}>
                <AdvanceFilterItem queryColums={queryColumns} rule={rule} onChange={rule => this.filterChange(index, rule)} />
              </Col>
              <Col span={4}>
                <Button icon='close' type='danger' onClick={() => this.removeFilter(index)} />
              </Col>
            </Row>
          </Col>
        })}
      </Row>
    })
  }


  render() {
    return (
      <div></div>
    )
  }
}

AdvanceFilterGenerator.propTypes = {
  queryColumns: PropTypes.array.isRequired,
  filterRules: PropTypes.array.isRequired,
  onChange: PropTypes.func
};

AdvanceFilterGenerator.defaultProps = {
  queryColumns: [],
  filterRules: []
}

export default AdvanceFilterGenerator
