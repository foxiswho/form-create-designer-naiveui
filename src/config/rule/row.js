import { localeProps } from '../../utils';

const label = '栅格布局';
const name = 'row';

export default {
  menu: 'layout',
  icon: 'icon-row',
  label,
  name,
  mask: false,
  children: 'col',
  childrenLen: 2,
  rule() {
    return {
      type: 'FcRow',
      props: {},
      children: []
    };
  },
  props(_, { t }) {
    return localeProps(t, name + '.props', [
      {
        type: 'inputNumber',
        field: 'gutter',
        title: '栅格间隔',
        props: { min: 0 }
      }
    ]);
  }
};
