<template>
  <div class="_fc_struct">
    <n-button @click="visible = true" style="width: 100%">{{
      title || t("struct.title")
    }}</n-button>
    <n-modal
      v-model:show="visible"
      preset="dialog"
      :show-icon="false"
      :title="title || t('struct.title')"
      style="width: 800px;min-height: 600px"
    >
      <div ref="editor" v-if="visible" style="min-height: 600px"></div>
      <template #action>
          <n-space>
            <n-button @click="visible = false" size="small">{{ t('props.cancel') }}</n-button>
            <n-button type="primary" @click="onOk" size="small" color="#2f73ff">{{ t('props.ok') }}</n-button>
          </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script>
import {deepParseFn, toJSON} from '../utils/index';
import {deepCopy} from '@form-create/utils/lib/deepextend';
import {defineComponent, markRaw} from 'vue';
import is from '@form-create/utils/lib/type';
import errorMessage from '../utils/message';
import {EditorViewNew} from "../utils/editor";

export default defineComponent({
  name: 'Struct',
  emits: ['update:modelValue'],
  props: {
    modelValue: [Object, Array, Function],
    title: String,
    defaultValue: {
      require: false
    },
    validate: Function,
  },
  inject: ['designer'],
  computed: {
    t() {
      return this.designer.setupState.t;
    },
    configured() {
      return !is.empty(this.modelValue);
    },
  },
  data() {
    return {
      editor: null,
      visible: false,
      oldVal: null,
    };
  },
  watch: {
    modelValue() {
      this.load();
    },
    visible(n) {
      if (n) {
        this.load();
      }
    },
  },
  methods: {
    load() {
      const val = toJSON(deepParseFn(this.modelValue ? deepCopy(this.modelValue) : this.defaultValue));
      this.oldVal = val;
      this.$nextTick(() => {
        // this.editor = markRaw(CodeMirror(this.$refs.editor, {
        //   lineNumbers: true,
        //   mode: 'javascript',
        //   lint: true,
        //   line: true,
        //   tabSize: 2,
        //   lineWrapping: true,
        //   value: val || ''
        // }));
        this.initCodeContent(val|| '');
      });
    },
    onOk() {
      const str = this.editor.state.doc;
      let val;
      try {
        val = (new Function('return ' + str))();
      } catch (e) {
        console.error(e);
        errorMessage(this.t('struct.errorMsg'));
        return false;
      }
      if (this.validate && false === this.validate(val)) {
        errorMessage(this.t('struct.errorMsg'));
        return false;
      }
      this.visible = false;
      if (toJSON(val, null, 2) !== this.oldVal) {
        this.$emit('update:modelValue', val);
      }
      return true;
    },
    initCodeContent(val) {
      setTimeout(() => {
        if (this.editor) {
          this.editor.destroy();
        }
        //创建编辑器
        this.editor = EditorViewNew(this.$refs.editor,val)
      }, 500);
    },
  }
});
</script>

<style>
._fd-struct {
  width: 100%;
}

._fd-struct .el-badge {
  width: 100%;
}

._fd-struct .el-button {
  font-weight: 400;
  width: 100%;
  border-color: #2E73FF;
  color: #2E73FF;
}

._fd-struct .CodeMirror {
  height: 450px;
}

._fd-struct .CodeMirror-line {
  line-height: 16px !important;
  font-size: 13px !important;
}

._fd-struct-con .CodeMirror-lint-tooltip {
  z-index: 2021 !important;
}

._fd-struct-con .el-dialog__body {
  padding: 0px 20px;
}
</style>
