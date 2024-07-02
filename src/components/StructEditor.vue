<template>
    <div class="_fd-struct-editor">
        <div ref="editor"></div>
    </div>
</template>

<script>
import {toJSON} from '../utils/index';
import {defineComponent, markRaw} from 'vue';
import errorMessage from '../utils/message';
import {EditorViewNew} from "../utils/editor";

export default defineComponent({
    name: 'StructEditor',
    props: {
        modelValue: [Object, Array, Function],
        defaultValue: {
            require: false
        }
    },
    inject: ['designer'],
    data() {
        return {
            editor: null,
            visible: false,
            err: false,
            oldVal: null,
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.load();
        });
    },
    methods: {
        load() {
            const val = this.modelValue ? toJSON(this.modelValue) : '';
            this.oldVal = val;
            this.$nextTick(() => {
                // this.editor = markRaw(CodeMirror(this.$refs.editor, {
                //     lineNumbers: true,
                //     mode: 'javascript',
                //     lint: true,
                //     line: true,
                //     tabSize: 2,
                //     lineWrapping: true,
                //     value: val || ''
                // }));
              this.initCodeContent(val);
            });
        },
        save() {
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
                this.err = true;
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
          this.editor = EditorViewNew(this.$refs.editor,val || 'Press Ctrl-Space in here...\n')
        }, 500);
      },
    }
});
</script>

<style>
._fd-struct-editor {
    flex: 1;
    width: 100%;
}

._fd-struct-editor > div {
    height: 100%;
}
</style>
