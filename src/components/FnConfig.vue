<template>
    <div class="_fd-fn-list">
        <n-badge :value="eventNum" type="warning" :show="eventNum < 1">
            <n-button @click="visible=true" size="small">{{ t('event.title') }}</n-button>
        </n-badge>
        <n-modal class="_fd-fn-list-dialog" :title="t('event.title')" v-if="visible" destroy-on-close
                   :close-on-click="false"
                   :style="{width:'980px'}">
            <n-layout class="_fd-fn-list-con" style="height: 600px">
                <n-layout-sider style="width:300px;">
                    <n-layout class="_fd-fn-list-l">
                        <n-layout-header class="_fd-fn-list-head" height="40px">
                            <n-text type="primary" size="default">
                                {{ t('event.list') }}
                            </n-text>
                        </n-layout-header>
                        <n-layout-content>
                            <n-menu
                                :options="options"
                                v-model="activeData">
                            </n-menu>
                        </n-layout-content>
                    </n-layout>
                </n-layout-sider>
                <n-layout-content>
                    <n-layout class="_fd-fn-list-r">
                        <n-layout-header class="_fd-fn-list-head" height="40px" v-if="activeData">
                            <n-button size="small" @click="close">{{ t('props.cancel') }}</n-button>
                            <n-button size="small" type="primary" @click="save" color="#2f73ff">{{
                                    t('props.save')
                                }}
                            </n-button>
                        </n-layout-header>
                        <n-layout-content v-if="activeData">
                            <FnEditor ref="fn" v-model="eventStr" :name="activeData.item.name"
                                      :args="activeData.item.args"/>
                        </n-layout-content>
                    </n-layout>
                </n-layout-content>
            </n-layout>
            <template #footer>
                <div>
                    <n-button size="small" @click="visible=false">{{ t('props.cancel') }}</n-button>
                    <n-button type="primary" size="small" @click="submit" color="#2f73ff">{{
                            t('props.ok')
                        }}
                    </n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script>
import unique from '@form-create/utils/lib/unique';
import deepExtend from '@form-create/utils/lib/deepextend';
import {defineComponent,h} from 'vue';
import FnEditor from './FnEditor.vue';
import errorMessage from '../utils/message';

const PREFIX = '[[FORM-CREATE-PREFIX-';
const SUFFIX = '-FORM-CREATE-SUFFIX]]';

export default defineComponent({
    name: 'FnConfig',
    emits: ['update:modelValue'],
    props: {
        modelValue: [Object, undefined, null],
        eventConfig: {
            type: Array,
            default: () => []
        },
    },
    inject: ['designer'],
    components: {
        FnEditor,
    },
    data() {
        return {
            visible: false,
            activeData: null,
            defActive: 'no',
            event: {},
            cus: false,
            eventStr: '',
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        eventNum() {
            let num = 0;
            Object.keys(this.modelValue || {}).forEach(k => {
                if (this.modelValue[k]) {
                    num++;
                }
            });
            return num;
        },
    },
    watch: {
        visible(v) {
            this.event = v ? this.loadFN(deepExtend({}, this.modelValue || {})) : {};
            if (!v) {
                this.destroy();
            }
        },
    },
    methods: {
        getArgs(item) {
            return item.args.join(', ');
        },
        loadFN(e) {
            const val = {};
            this.eventConfig.forEach(item => {
                const k = item.name;
                const fn = e[k] || '';
                val[k] = {
                    item, fn
                }
            });
            return val;
        },
        parseFN(e) {
            const on = {};
            Object.keys(e).forEach(k => {
                if (e[k].fn) {
                    on[k] = e[k].fn;
                }
            });
            return on;
        },
        edit(data) {
            data.key = unique();
            this.activeData = data;
            this.eventStr = data.fn || (PREFIX + `function ${data.item.name}(${this.getArgs(data.item)}){}` + SUFFIX);
            this.defActive = data.item.name;
        },
        save() {
            if (this.$refs.fn.save()) {
                this.activeData.fn = this.eventStr;
                this.destroy();
            }
        },
        destroy() {
            this.activeData = null;
            this.defActive = 'no';
        },
        close() {
            this.destroy();
        },
        submit() {
            if (this.activeData) {
                return errorMessage(this.t('event.saveMsg'));
            }
            this.$emit('update:modelValue', this.parseFN(this.event));
            this.visible = false;
            this.destroy();
        },
      options(){
        let arr=[]
        for(var i in this.event){
          let item = this.event[i]
          arr.push({
            label: () =>
                h(
                    'div',
                    {
                      class: '_fd-fn-list-method',
                      onClick: () => {
                        this.edit(item)
                      }
                    },
                    h(
                        'span',
                        {},
                        [
                            'function',
                          h(
                              'span',
                              {},
                              i
                          )
                        ]
                    ),
                ),
            value:i
          })
        }
        return arr;
      }
    }
});
</script>

<style>
._fd-fn-list, ._fd-fn-list .el-badge {
    width: 100%;
}

._fd-fn-list .el-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-fn-list-dialog .el-dialog__body {
    padding: 10px 20px;
  width: 980px;
}

._fd-fn-list-con .el-main {
    padding: 0;
}

._fd-fn-list-l, ._fd-fn-list-r {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    border: 1px solid #ececec;
}

._fd-fn-list-head {
    display: flex;
    padding: 5px 15px;
    border-bottom: 1px solid #eee;
    background: #f8f9ff;
    align-items: center;
}

._fd-fn-list-head .el-button.is-link {
    color: #2f73ff;
}

._fd-fn-list-r {
    border-left: 0 none;
}

._fd-fn-list-r ._fd-fn-list-head {
    justify-content: flex-end;
}

._fd-fn-list-l > .el-main, ._fd-fn-list-r > .el-main {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    width: 100%;
}

._fd-fn-list-r > .el-main {
    flex-direction: column;
}

._fd-fn-list-l .el-menu {
    padding: 0 10px 5px;
    border-right: 0 none;
    width: 100%;
    border-top: 0 none;
    overflow: auto;
}

._fd-fn-list-l .el-menu-item.is-active {
    background: #e4e7ed;
    color: #303133;
}

._fd-fn-list-l .el-menu-item {
    height: auto;
    line-height: 1em;
    border: 1px solid #ECECEC;
    border-radius: 5px;
    padding: 0;
    margin-top: 5px;
}

._fd-fn-list-method {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 0;
    font-size: 14px;
    line-height: 1em;
    font-family: monospace;
    width: 100%;
    overflow: hidden;
    white-space: pre-wrap;
}

._fd-fn-list-method-info > span:first-child, ._fd-fn-list-method > span:first-child {
    color: #9D238C;
}

._fd-fn-list-method-info > span:first-child > span, ._fd-fn-list-method > span:first-child > span {
    color: #000;
    margin-left: 10px;
}

._fd-fn-list-con .CodeMirror {
    height: 100%;
    width: 100%;
}

._fd-fn-list-con .CodeMirror-wrap pre.CodeMirror-line {
    padding-left: 20px;
}
</style>
