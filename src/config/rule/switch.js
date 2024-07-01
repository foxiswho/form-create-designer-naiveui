import uniqueId from '@form-create/utils/lib/unique';
import { localeProps, makeRequiredRule } from '../../utils';

const label = '开关';
const name = 'switch';

export default {
  menu: 'main',
  icon: 'icon-switch',
  label,
  name,
  event: ['change'],
  rule({ t }) {
    return {
      type: name,
      field: uniqueId(),
      dbType: 'integer',
      title: t('components.switch.name'),
      info: '',
      $required: false,
      props: {
        checkedValue:1,
        uncheckedValue:2,
      },
    };
  },
  props(_, { t }) {
    return localeProps(t, name + '.props', [
      makeRequiredRule(),
      {
        type: 'switch',
        field: 'disabled',
        title: '是否禁用',
        props: {
          size: 'small',
        }
      },
      {
        type: 'radio',
        field: 'size',
        title: '尺寸',
        info: t('components.switch.props.sizeInfo'),
        value: 'medium',
        options: [
          { value: 'small', label: 'small' },
          { value: 'medium', label: 'medium' },
          { value: 'large', label: 'large' }
        ]
      },
      {
        type: 'input',
        field: 'checkedValue',
        value: 1,
        title: '选中时对应的值'
      },
      {
        type: 'input',
        field: 'uncheckedValue',
        value: 2,
        title: '未选中时对应的值'
      },
    ]);
  }
};
