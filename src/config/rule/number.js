import uniqueId from '@form-create/utils/lib/unique';
import { localeProps, makeRequiredRule } from '../../utils';

const label = '计数器'
const name = 'inputNumber'

export default {
  menu: 'main',
  icon: 'icon-number',
  label,
  name,
  event: ['blur', 'focus', 'change'],
  validate: ['number', 'integer', 'float'],
  rule({ t }) {
    return {
      type: name,
      field: uniqueId(),
      dbType: 'number',
      title: t('com.inputNumber.name'),
      info: '',
      $required: false,
      props: {
        precision:0,
        step:1,
        showButton:true,
      }
    }
  },
  props(_, { t }) {
    return localeProps(t, name + '.props', [makeRequiredRule(), {
      type: 'inputNumber',
      field: 'min',
      title: '设置计数器允许的最小值'
    }, {
      type: 'inputNumber',
      field: 'max',
      title: '设置计数器允许的最大值',
    }, {
      type: 'inputNumber',
      field: 'precision',
      title: '数值保留的精度值',
      value: 0,
      props: { min: 0 }
    }, {
      type: 'inputNumber',
      field: 'step',
      title: '计数器步长',
      props: { min: 0 }
    }, {
      type: 'switch',
      field: 'disabled',
      title: '是否禁用计数器',
      props: {
        size: 'small',
      }
    }, {
      type: 'switch',
      field: 'showButton',
      title: '是否有按钮',
      value: true,
      props: {
        size: 'small',
      }
    }, {
      type: 'select',
      field: 'buttonPlacement',
      title: '加减按钮的位置',
      value: 'right',
      options: [{ label: 'right', value: 'right' }, { label: 'both', value: 'both' }]
    }, {
      type: 'input',
      field: 'placeholder',
      title: '提示信息',
    }
    ])
  }
};