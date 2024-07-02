<template>
    <div class="_fd-html-editor">
        <n-button @click="visible=true" style="width: 100%;">{{ title || t('struct.title') }}</n-button>
        <n-modal class="_fd-html-editor-con" :title="title || t('struct.title')" v-show="visible"
                  :mask-closable="false" append-to-body
          :negativeText="t('props.cancel')"
          :positiveText="t('props.ok')"
                  @positive-click="onOk"
                  @negative-click="visible = false"
        >
            <div ref="editor" v-if="visible"></div>
        </n-modal>
    </div>
</template>

<script>
import {defineComponent, markRaw} from 'vue';
import errorMessage from '../utils/message';
import {EditorViewNew} from "../utils/editor";

export default defineComponent({
    name: 'HtmlEditor',
    emits: ['update:modelValue'],
    props: {
        modelValue: String,
        title: String,
        defaultValue: {
            require: false
        },
    },
    inject: ['designer'],
    computed: {
        t() {
            return this.designer.setupState.t;
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
        }
    },
    methods: {
        validateXML(xmlString) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
            const parseErrors = xmlDoc.getElementsByTagName('parsererror');
            if (parseErrors.length > 0) {
                return parseErrors[0].innerText.split('\n')[0] ?? '';
            } else {
                return '';
            }
        },
        load() {
            this.oldVal = this.modelValue;
            this.$nextTick(() => {
                // this.editor = markRaw(CodeMirror(this.$refs.editor, {
                //     lineNumbers: true,
                //     mode: 'xml',
                //     lint: true,
                //     line: true,
                //     tabSize: 2,
                //     lineWrapping: true,
                //     value: this.modelValue || ''
                // }));
              this.initCodeContent(this.modelValue || '');
            });
        },
        onOk() {
            const str = this.editor.getValue();
            if (this.validateXML(str)) {
                errorMessage(this.t('struct.errorMsg'));
                return false;
            }
            this.visible = false;
            if (str !== this.oldVal) {
                this.$emit('update:modelValue', str);
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
._fd-html-editor {
    width: 100%;
}

._fd-html-editor .el-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-html-editor-con .CodeMirror {
    height: 450px;
}

._fd-html-editor-con .CodeMirror-line {
    line-height: 16px !important;
    font-size: 13px !important;
}

._fd-html-editor-con .CodeMirror-lint-tooltip {
    z-index: 2021 !important;
}

._fd-html-editor-con .el-dialog__body {
    padding: 0px 20px;
}
</style>
