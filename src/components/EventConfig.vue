<template>
    <div class="_fd-event">
        <n-badge :value="eventNum" type="warning" :hidden="eventNum < 1">
            <n-button size="small" @click="visible=true">{{ t('event.title') }}</n-button>
        </n-badge>
        <n-modal v-model:show="visible" class="_fd-event-dialog" :title="t('event.title')" preset="dialog" destroy-on-close
                   :maskClosable="false"
                   width="980px" :show-icon="false">
          <n-card
              style="width: 600px;height:600px;background-color: #ffffff"
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
          >
            <n-layout class="_fd-event-con" style="height: 600px">
                <n-layout-sider style="width:300px;">
                    <n-layout class="_fd-event-l">
                        <n-layout-header class="_fd-event-head" height="40px">
                            <n-dropdown popper-class="_fd-event-dropdown" size="small"
                                         :placement="'bottom-start'"
                            :options="options()"
                            >
                              <span class="el-dropdown-link">
                                <n-button link type="primary" size="default">
                                    {{ t('event.create') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </n-button>
                              </span>
                            </n-dropdown>
                        </n-layout-header>
                        <n-layout-content>
                            <n-menu
                                :default-active="defActive"
                                v-model="activeData">
<!--                                <template v-for="(item, name) in event">-->
<!--                                    <template v-if="Array.isArray(item)">-->
<!--                                        <template v-for="(event, index) in item" :key="name + index">-->
<!--                                            <el-menu-item :index="name + index">-->
<!--                                                <div class="_fd-event-title"-->
<!--                                                     @click.stop="edit({name, item, index})">-->
<!--                                                    <div class="_fd-event-method">-->
<!--                                                        <span>function<span>{{-->
<!--                                                                name-->
<!--                                                            }}</span></span>-->
<!--                                                    </div>-->
<!--                                                    <i class="fc-icon icon-delete"-->
<!--                                                       @click.stop="rm({name, item, index})"></i>-->
<!--                                                </div>-->
<!--                                            </el-menu-item>-->
<!--                                        </template>-->
<!--                                    </template>-->
<!--                                    <el-menu-item v-else :index="name + 0">-->
<!--                                        <div class="_fd-event-title" @click.stop="edit({name})">-->
<!--                                            <div class="_fd-event-method">-->
<!--                                                        <span>function<span>{{-->
<!--                                                                name-->
<!--                                                            }}</span></span>-->
<!--                                            </div>-->
<!--                                            <i class="fc-icon icon-delete" @click.stop="rm({name})"></i>-->
<!--                                        </div>-->
<!--                                    </el-menu-item>-->
<!--                                </template>-->
<!--                                <el-menu-item v-if="cus" style="padding-left: 10px;" index="custom">-->
<!--                                    <div class="_fd-event-title" @click.stop>-->
<!--                                        <el-input type="text" v-model="cusValue" size="default"-->
<!--                                                  @keydown.enter="addCus"-->
<!--                                                  :placeholder="t('event.placeholder')">-->
<!--                                        </el-input>-->
<!--                                        <div>-->
<!--                                            <i class="fc-icon icon-add" @click.stop="addCus"></i>-->
<!--                                            <i class="fc-icon icon-delete" @click.stop="closeCus"></i>-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                </el-menu-item>-->
                            </n-menu>
                        </n-layout-content>
                    </n-layout>
                </n-layout-sider>
                <n-layout-content>
                    <n-layout class="_fd-event-r">
                        <n-layout-header class="_fd-event-head" height="40px" v-if="activeData">
                            <div><a target="_blank" href="https://form-create.com/v3/instance">{{t('form.document')}}</a></div>
                            <div>
                                <n-button size="small" @click="close">{{ t('props.cancel') }}</n-button>
                                <n-button size="small" type="primary" @click="save" color="#2f73ff">{{
                                        t('props.save')
                                    }}
                                </n-button>
                            </div>
                        </n-layout-header>
                        <n-layout-content v-if="activeData">
                            <FnEditor ref="fn" v-model="eventStr" body :name="activeData.name"
                                      :args="fnArgs"
                                      style="height: 519px;"/>
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
          </n-card>
        </n-modal>
    </div>
</template>

<script>
import unique from '@form-create/utils/lib/unique';
import deepExtend from '@form-create/utils/lib/deepextend';
import is from '@form-create/utils/lib/type';
import {defineComponent, h} from 'vue';
import FnEditor from './FnEditor.vue';
import errorMessage from '../utils/message';
import {getInjectArg} from '../utils';

const $T = '$FNX:';

const isFNX = v => {
    return is.String(v) && v.indexOf($T) === 0;
};

export default defineComponent({
    name: 'EventConfig',
    emits: ['update:modelValue'],
    props: {
        modelValue: [Object, undefined, null],
        componentName: '',
        eventName: {
            type: Array,
            default: () => []
        }
    },
    inject: ['designer'],
    components: {
        FnEditor,
    },
    data() {
        return {
            visible: false,
            activeData: null,
            val: null,
            defActive: 'no',
            event: {},
            cus: false,
            cusValue: '',
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
                num += Array.isArray(this.modelValue[k]) ? this.modelValue[k].length : 1;
            });
            return num;
        },
        fnArgs() {
            return [getInjectArg(this.t)];
        }
    },
    watch: {
        visible(v) {
            this.event = v ? this.loadFN(deepExtend({}, this.modelValue || {})) : {};
            if (!v) {
                this.destroy();
                this.closeCus();
            }
        },
    },
    methods: {
        addCus() {
            const val = this.cusValue && this.cusValue.trim();
            if (val) {
                this.closeCus();
                this.add(val);
            }
        },
        closeCus() {
            this.cus = false;
            this.cusValue = '';
        },
        cusEvent() {
            this.cus = true;
        },
        loadFN(e) {
            const val = {};
            Object.keys(e).forEach(k => {
                if (Array.isArray(e[k])) {
                    const data = [];
                    e[k].forEach(v => {
                        if (isFNX(v)) {
                            data.push(v.replace($T, ''));
                        } else if (is.Function(v) && isFNX(v.__json)) {
                            data.push(v.__json.replace($T, ''));
                        } else if (v && v.indexOf('$GLOBAL:') === 0) {
                            data.push(v);
                        }
                    });
                    val[k] = data;
                } else if (isFNX(e[k])) {
                    val[k] = [e[k].replace($T, '')];
                } else if (is.Function(e[k]) && isFNX(e[k].__json)) {
                    val[k] = [e[k].__json.replace($T, '')];
                } else if (e[k] && e[k].indexOf('$GLOBAL:') === 0) {
                    val[k] = [e[k]];
                }
            });
            return val;
        },
        parseFN(e) {
            const on = {};
            Object.keys(e).forEach(k => {
                const lst = [];
                e[k].forEach((v, i) => {
                    lst[i] = v.indexOf('$GLOBAL:') !== 0 ? ($T + v) : v;
                });
                if (lst.length > 0) {
                    on[k] = lst.length === 1 ? lst[0] : lst;
                }
            });
            return on;
        },
        add(name) {
            let data = {};
            if (Array.isArray(this.event[name])) {
                this.event[name].push('');
                data = {
                    name,
                    item: this.event[name],
                    index: this.event[name].length - 1,
                };
            } else if (this.event[name]) {
                const arr = [this.event[name], ''];
                this.event[name] = arr;
                data = {
                    name,
                    item: arr,
                    index: 1,
                };
            } else {
                const arr = [''];
                this.event[name] = arr;
                data = {
                    name,
                    item: arr,
                    index: 0,
                };
            }
            if (!this.activeData) {
                this.edit(data);
            }
        },
        edit(data) {
            data.key = unique();
            if (data.item) {
                this.val = data.item[data.index];
            } else {
                this.val = this.event[data.name];
            }
            this.activeData = data;
            this.eventStr = this.val;
            this.defActive = data.name + (data.index || 0);
        },
        save() {
            if (!this.$refs.fn.save()) {
                return;
            }
            const str = this.eventStr;

            if (this.activeData.item) {
                this.activeData.item[this.activeData.index] = str;
            } else {
                this.event[this.activeData.name] = str;
            }
            this.destroy();
        },
        rm(data) {
            if (data.index !== undefined) {
                data.item.splice(data.index, 1);
            } else {
                this.$delete(this.event, data.name);
            }
            if (this.defActive === (data.name + (data.index || 0))) {
                this.destroy();
            }
        },
        destroy() {
            this.activeData = null;
            this.val = null;
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
            this.closeCus();
        },
      options() {
        let arr = []
        if (this.eventName) {
          for (var i in this.eventName) {
            let name = this.eventName[i]
            arr.push({
              label: () => h('div', {class: '_fd-event-item'},
                  h('span', name)
              ),
              key: i,
              props: {
                onClick: () => {
                  this.add(name)
                }
              }
            })
          }
        }
          if (this.eventName.length > 0) {
            arr.push({
              label: () => h('div', t('props.custom')),
              key: i,
              props: {
                onClick: () => {
                  this.cusEvent()
                }
              }
            })
          }

        return []
      }
    },
    beforeCreate() {
        window.$inject = {
            $f: {},
            rule: [],
            self: {},
            option: {},
            inject: {},
            args: [],
        };
    }
});
</script>

<style>

._fd-event .el-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-event .el-badge {
    width: 100%;
}

._fd-event-dialog .el-dialog__body {
    padding: 10px 20px;
}

._fd-event-con .el-main {
    padding: 0;
}

._fd-event-l, ._fd-event-r {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    border: 1px solid #ececec;
}

._fd-event-dropdown .el-dropdown-menu {
    max-height: 500px;
    overflow: scroll;
}

._fd-event-head {
    display: flex;
    padding: 5px 15px;
    border-bottom: 1px solid #eee;
    background: #f8f9ff;
    align-items: center;
}

._fd-event-head .el-button.is-link {
    color: #2f73ff;
}

._fd-event-r {
    border-left: 0 none;
}

._fd-event-r ._fd-event-head {
    justify-content: space-between;
}

._fd-event-l > .el-main, ._fd-event-r > .el-main {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    width: 100%;
}

._fd-event-r > .el-main {
    flex-direction: column;
}

._fd-event-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 250px;
    font-size: 14px;
    overflow: hidden;
    white-space: pre-wrap;
}

._fd-event-l .el-menu {
    padding: 0 10px 5px;
    border-right: 0 none;
    width: 100%;
    border-top: 0 none;
    overflow: auto;
}

._fd-event-l .el-menu-item.is-active {
    background: #e4e7ed;
    color: #303133;
}

._fd-event-l .el-menu-item {
    height: auto;
    line-height: 1em;
    border: 1px solid #ECECEC;
    border-radius: 5px;
    padding: 0;
    margin-top: 5px;
}

._fd-event-method {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 225px;
    font-size: 14px;
    font-family: monospace;
    color: #9D238C;
    overflow: hidden;
    white-space: pre-wrap;
}

._fd-event-method > span:first-child, ._fd-fn-list-method > span:first-child {
    color: #9D238C;
}

._fd-event-method > span:first-child > span, ._fd-fn-list-method > span:first-child > span {
    color: #000;
    margin-left: 10px;
}

._fd-event-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0;
}

._fd-event-title .fc-icon {
    margin-right: 6px;
    font-size: 18px;
    color: #282828;
}

._fd-event-title .el-input {
    width: 200px;
}

._fd-event-title .el-input__wrapper {
    box-shadow: none;
}

._fd-event-title .el-menu-item.is-active i {
    color: #282828;
}

._fd-event-con .CodeMirror {
    height: 100%;
    width: 100%;
}

._fd-event-con .CodeMirror-wrap pre.CodeMirror-line {
    padding-left: 20px;
}
</style>
