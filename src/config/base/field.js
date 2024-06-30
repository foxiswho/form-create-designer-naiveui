import IconRefresh from '../../components/IconRefresh.vue';
import { markRaw } from 'vue';

export default function field({ t }) {
  return [
    {
      type: 'select',
      field: 'dbType',
      value: 'string',
      title: t("validate.typeDb"),
      options: [
        { value: "", label: t("validate.typePlaceholder") },
        { value: "string", label: "String" },
        { value: "number", label: "Number" },
        { value: "integer", label: "Integer" },
        { value: "date", label: "Date" },
        { value: "dateTime", label: "dateTime" },
        { value: "time", label: "time" },
        { value: "object", label: "Object" },
        { value: "boolean", label: "boolean" },
        { value: "array|string", label: "Array<string>" },
        { value: "array|number", label: "Array<number>" },
        { value: "array|integer", label: "Array<integer>" },
      ]
    },
    {
      type: 'input',
      field: 'field',
      value: '',
      title: t('form.field'),
    }, {
      type: 'input',
      field: 'title',
      value: '',
      title: t('form.title'),
    }, {
      type: 'input',
      field: 'info',
      value: '',
      title: t('form.info'),
    }, {
      type: 'Struct',
      field: '_control',
      value: [],
      title: t('form.control'),
      props: {
        defaultValue: [],
        validate(val) {
          if (!Array.isArray(val)) return false;
          if (!val.length) return true;
          return !val.some(({ rule }) => {
            return !Array.isArray(rule);
          });
        }
      }
    }, {
      type: 'col',
      props: {
        span: 24
      },
      children: [
        {
          type: 'n-space',
          children: [
            {
              type: 'n-button',
              props: {
                type: 'info',
                size: 'tiny',
              },
              inject: true,
              on: {
                click({ $f }) {
                  const rule = $f.activeRule;
                  if (rule) {
                    rule.__fc__.updateKey();
                    rule.value = undefined;
                    rule.__fc__.$api.sync(rule);
                  }
                },
              },
              native: true,
              children: [{ type: 'i', class: 'fc-icon icon-delete' }, t('form.clear')]
            }, {
              type: 'n-button',
              props: {
                type: 'success',
                size: 'tiny'
              },
              inject: true,
              on: {
                click({ $f }) {
                  const rule = $f.activeRule;
                  if (rule) {
                    rule.__fc__.updateKey(true);
                    rule.__fc__.$api.sync(rule);
                  }
                },
              },
              native: true,
              children: [{type: 'template', slot: 'icon', children: [{type: 'n-icon', props: {component: markRaw(IconRefresh)}}]  }, t('form.refresh')]
            },
          ]
        }
      ]
    }
  ];
}
