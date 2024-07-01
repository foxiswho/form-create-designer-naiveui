import uniqueId from '@form-create/utils/lib/unique';
import { localeProps, makeOptionsRule, makeRequiredRule } from '../../utils/index';

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
      title: t('components.radio.name'),
      info: '',
      effect: {
        fetch: ''
      },
      $required: false,
      props: {
        type:'default',
      },
      options: [1, 2].map(value => {
        return {
          label: opt + value,
          value,
        }
      })
    };
  },
  props(_, {t}) {
    return localeProps(t, name + '.props', [
      makeRequiredRule(),
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