import uniqueId from '@form-create/utils/lib/unique';
import { localeProps, makeOptionsRule, makeRequiredRule,makeTreeOptions } from '../../utils/index';

const label = '单选框';
const name = 'radio'

export default {
  menu: 'main',
  icon: 'icon-radio',
  label,
  name,
  event: ['change'],
  validate: ['string', 'number'],
  rule({ t }) {
    const opt = t('props.option');
    return {
      type: name,
      field: uniqueId(),
      dbType: 'integer',
      title: t('com.radio.name'),
      info: '',
      effect: {
        fetch: ''
      },
      $required: false,
      props: {
        type:'default',
      },
      options: makeTreeOptions(t('props.option'), {label: 'label', value: 'value'}, 1)
    };
  },
  props(_, {t}) {
    return localeProps(t, name + '.props', [
      makeOptionsRule(t, 'options'),
      {
        type: 'switch', 
        field: 'disabled', 
        title: '是否禁用', 
        props: {
          size: 'small',
        }
      },
      { 
        type: 'switch',
        field: 'type',
        title: '按钮形式',
        value: 'default',
        props: {
          checkedValue: 'button',
          uncheckedValue: 'default',
          size: 'small'
        }
      },
    ])
  }
}