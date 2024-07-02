import { uniqueId } from "@form-create/utils";
import {localeProps, makeOptionsRule, makeTreeOptions} from '../../utils/index';

const label = '多选框'
const name = 'checkbox'

export default {
  menu: 'main',
  icon: 'icon-checkbox',
  label,
  name,
  event: ['change'],
  validate: ['array'],
  rule({ t }) {
    const opt = t('props.option');
    return {
      type: name,
      field: uniqueId(),
      dbType: 'array[integer]',
      title: t('com.checkbox.name'),
      info: '',
      effect: {
        fetch: ''
      },
      $required: false,
      props: {},
      options: makeTreeOptions(t('props.option'), {label: 'label', value: 'value'}, 1)
    };
  },
  props(_, { t }) {
    return localeProps(t, name + '.props', [
      makeOptionsRule(t, 'options'),
      {
        type: 'switch', 
        field: 'disabled', 
        title: '是否禁用',
        props: {
          size: 'small'
        }
      },
      {
        type: 'inputNumber',
        field: 'min',
        title: '可被勾选的 checkbox 的最小数量',
        props: { min: 0 },
      },
      {
        type: 'inputNumber',
        field: 'max',
        title: '可被勾选的 checkbox 的最大数量',
        props: { min: 0 }
      }
    ]);
  }
};