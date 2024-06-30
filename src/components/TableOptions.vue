<template>
  <div class="_fc_table_opt">
    <n-data-table :data="value" :columns="columns" :size="size || 'small'" :single-line="false" />
    <n-button text @click="add">
      <template #icon>
        <i class="fc-icon icon-add"></i>
      </template>
      {{ t('tableOptions.add') }}
    </n-button>
  </div>
</template>
<script>
import { NButton, NInput } from "naive-ui";
import { defineComponent, h, inject} from "vue";
import {copy} from '@form-create/utils/lib/extend';

export default defineComponent({
  name: "TableOptions",
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: [Array, Object],
    column: {
      type: Array,
      default: () => [{label: 'label', key: 'label'}, {label: 'value', key: 'value'}]
    },
    valueType: String,
    max: Number,
    size: String,
  },
  inject: ['designer'],
  watch: {
    modelValue() {
      this.value = this.tidyModelValue();
    }
  },
  computed: {
    t() {
      return this.designer.setupState.t;
    },
  },
  data() {
    let that = this
    return {
      columns : this.createColumns({
        del (index) {
          that.del(index)
        }
      }),
      value: this.tidyModelValue(),
    };
  },
  methods: {
    tidyModelValue() {
      const modelValue = this.modelValue;
      if (this.valueType === 'string') {
        return (modelValue || []).map(value => {
          return {value: '' + value}
        })
      } else if (this.valueType === 'object') {
        return Object.keys((modelValue || {})).map(label => {
          return {label, value: modelValue[label]}
        })
      } else {
        return [...modelValue || []].map(v => {
          return copy(v);
        });
      }
    },
    tidyValue() {
      if (this.valueType === 'object') {
        const obj = {};
        this.value.forEach(v => {
          if (v.label && v.value) {
            obj[v.label] = v.value;
          }
        })
        return obj;
      } else {
        return this.value.map(v => {
          if (this.valueType === 'string') {
            return v.value;
          }
          return {...v}
        });
      }
    },
    onInput(item) {
      if (this.column.length === 1 && !item[this.column[0].key]) {
        return;
      }
      const flag = this.column.every(v => {
        if (v.required === false) {
          return true;
        }
        if (['object', 'string'].indexOf(this.valueType) > -1) {
          return item[v.key] !== undefined && item[v.key] !== '' && item[v.key] !== null;
        }
        return item[v.key] !== undefined;
      })
      if (flag) {
        this.input();
      }
    },
    input() {
      const value = this.tidyValue();
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
    add() {
      this.value.push(this.column.reduce((initial, v) => {
        initial[v.key] = '';
        return initial;
      }, {}));
    },
    del(idx) {
      this.value.splice(idx, 1);
      this.input();
    },
    createColumns({ del }){
      return [
        {
          title: "label",
          key: "label",
          render(row, index) {
            return h(NInput, {
              value: row.label,
              onUpdateValue(v) {
                modelValue[index].label = v;
                onInput(row);
              },
            });
          },
        },
        {
          title: "value",
          key: "value",
          render(row, index) {
            return h(NInput, {
              value: row.value.toString(),
              showButton: false,
              onUpdateValue(v) {
                modelValue[index].value = Number(v);
                onInput(row);
              },
            });
          },
        },
        {
          title: "操作",
          key: "action",
          width: 50,
          align: 'center',
          render(_, index) {
            return h(
                NButton,
                {
                  text: true,
                  size: "small",
                  onClick: () => del(index),
                },
                {
                  default: () =>
                      h("i", { class: "fc-icon icon-delete" }),
                }
            );
          },
        },
      ];
    }
  }
});
</script>
<style scoped>
._td-table-opt {
  width: 100%;
}

._td-table-opt-handle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 5px;
}
</style>
