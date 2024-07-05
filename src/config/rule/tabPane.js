import { localeProps } from '../../utils';
import tabname from '../../utils/tabname';

const label = '标签页';
const name = 'nTabPane';

export default {
  label,
  name,
  inside: true,
  drag: true,
  dragBtn: false,
  mask: false,
  rule({ t }) {
    return {
      type: name,
      props: {
        tab: t('com.nTabPane.name'),
        name: String(tabname()),
      },
      children: []
    };
  },
  props(_, { t }) {
    return localeProps(t, name + '.props', [
      {
        type: 'input',
        field: 'tab',
        title: '选项卡标题'
      },
      {
        type: 'switch',
        field: 'closable',
        title: '是否允许关闭标签',
        info: t('com.nTabPane.props.closableInfo'),
      },
      {
        type: 'switch',
        field: 'disabled',
        title: '是否禁用'
      },
      {
        type: 'input',
        field: 'name',
        title: '标签页标识',
        info: t('com.nTabPane.props.nameInfo')
      },
      {
        type: 'select',
        field: 'displayDirective',
        title: '选择性渲染使用的指令',
        value: 'if',
        options: [
          { label: t('com.nTabPane.props.if'), value: 'if' },
          { label: t('com.nTabPane.props.show'), value: 'show' },
          { label: t('com.nTabPane.props.showLazy'), value: 'show:lazy' },
        ]
      }
    ]);
  }
};
