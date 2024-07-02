import uniqueId from '@form-create/utils/lib/unique';
import { localeProps, makeOptionsRule, makeRequiredRule,makeTreeOptions } from '../../utils/index';

const label = '树形控件';
const name = 'tree';

export default {
  menu: 'main',
  icon: 'icon-tree',
  label,
  name,
  event: ['nodeClick', 'nodeContextmenu', 'checkChange', 'check', 'currentChange', 'nodeExpand', 'nodeCollapse', 'nodeDragStart', 'nodeDragEnter', 'nodeDragLeave', 'nodeDragOver', 'nodeDragEnd', 'nodeDrop'],
  validate: ['string', 'number', 'array'],
  rule({ t }) {
    const opt = t('props.option');
    return {
      type: name,
      field: uniqueId(),
      dbType: 'integer',
      title: t('com.tree.name'),
      info: '',
      effect: {
        fetch: ''
      },
      $required: false,
      props: {
        props: {
          label: 'label',
        },
        nodeKey: 'key',
        data: makeTreeOptions(t('props.option'), {label: 'label', value: 'id'}, 3),
      },
    };
  },
  props(_, { t }) {
    return localeProps(t, name + '.props', [
      makeOptionsRule(t, 'props.data', false),
      {
        type: 'switch',
        field: 'accordion',
        title: '是否使用手风琴展开模式',
        props: {
          size: 'small'
        }
      },
      {
        type: 'switch',
        field: 'animated',
        title: '是否有展开动画',
        value: true,
        props: {
          size: 'small'
        }
      },
      {
        type: 'switch',
        field: 'cancelable',
        title: '选中之后是否允许取消',
        value: true,
        props: {
          size: 'small'
        }
      },
      {
        type: 'switch',
        field: 'cascade',
        title: '是否关联选项',
        props: {
          size: 'small'
        }
      },
      {
        type: 'switch',
        field: 'checkable',
        title: '是否显示选择框',
        value: true,
        props: {
          size: 'small'
        },
        control: [
          {
            value: true,
            rule: [
              {
                type: 'select',
                field: 'checkboxPlacement',
                title: '复选框的位置',
                value: 'left',
                options: [
                  { label: '左边', value: 'left' },
                  { label: '右边', value: 'right' },
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'select',
        field: 'checkStrategy',
        title: '勾选策略',
        value: 'all',
        info: t('com.tree.props.checkStrategyInfo'),
        options: [
          { label: t('com.tree.props.all'), value: 'all' },
          { label: t('com.tree.props.parent'), value: 'parent' },
          { label: t('com.tree.props.child'), value: 'child' }
        ]
      },
      {
        type: 'input',
        field: 'childrenField',
        title: '自定义 children 字段名',
        info: t('com.tree.props.customInfo'),
        props: {
          placeholder: 'children'
        }
      },
      {
        type: 'input',
        field: 'keyField',
        title: '自定义 key 字段名',
        props: {
          placeholder: 'key'
        }
      },
      {
        type: 'input',
        field: 'labelField',
        title: '自定义 label 字段名',
        props: {
          placeholder: 'label'
        }
      },
      {
        type: 'input',
        field: 'disabledField',
        title: '自定义 disabled 字段名',
        props: {
          placeholder: 'disabled'
        }
      },
    ]);
  }
};
