<template>
    <div class="_fd-gfc">
        <n-badge type="warning" dot :show="!configured">
            <n-button @click="visible=true" size="small">{{ t('struct.title') }}</n-button>
        </n-badge>
    </div>
      <n-modal class="_fd-gfc-dialog" preset="dialog" :title="t('fetch.optionsType.fetch')" v-model:show="visible"
               :mask-closable="false"
               style="width: 980px">
        <n-layout style="height: 450px;">
          <n-tabs v-model:value="activeTab" class="_fc-tabs" style="width: 100%">
            <n-tab-pane :tab="t('fetch.config')" name="first">
              <DragForm v-model:api="form.api" v-model="form.formData" :rule="form.rule" class="req"
                        :option="form.options"></DragForm>
            </n-tab-pane>
            <n-tab-pane display-directive="show:lazy" :tab="t('fetch.parse')" name="second">
                                      <FnEditor style="height: 415px;" v-model="form.parse" name="parse"
                                                :args="[{name:'res', info: t('fetch.response')}]"
                                                ref="parse"></FnEditor>
            </n-tab-pane>
            <n-tab-pane display-directive="show:lazy" :tab="t('fetch.onError')" name="third">
                                      <FnEditor style="height: 415px;" v-model="form.onError" name="onError"
                                                :args="['e']"
                                                ref="error"></FnEditor>
            </n-tab-pane>
          </n-tabs>
        </n-layout>
        <template #action>
          <div>
            <n-button size="small" @click="visible=false">{{ t('props.cancel') }}</n-button>
            <n-button type="primary" size="small" @click="save" color="#2f73ff">{{
                t('props.ok')
              }}
            </n-button>
          </div>
        </template>
      </n-modal>
</template>

<script>
import {deepCopy} from '@form-create/utils/lib/deepextend';
import FnEditor from './FnEditor.vue';
import StructEditor from './StructEditor.vue';
import {defineComponent} from 'vue';
import {designerForm} from '../utils/form';
import errorMessage from '../utils/message';
import is from '@form-create/utils/lib/type';

const makeRule = (t) => {
    return [
        {
            type: 'input',
            field: 'action',
            title: t('fetch.action'),
            value: '',
            $required: true,
            props: {size: 'small'},
            validate: [{type: 'url', message: t('fetch.actionRequired'), trigger: 'blur'}]
        },
        {
            type: 'radio',
            field: 'method',
            title: t('fetch.method'),
            value: 'GET',
            props: {
                size: 'medium'
            },
            options: [
                {label: 'GET', value: 'GET'},
                {label: 'POST', value: 'POST'},
            ],
            $required: true,
        },
        {
            type: 'TableOptions',
            field: 'headers',
            title: t('fetch.headers'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'small'
            },
        },
        {
            type: 'TableOptions',
            field: 'data',
            title: t('fetch.data'),
            value: {},
            props: {
                column: [{label: t('props.key'), key: 'label'}, {label: t('props.value'), key: 'value'}],
                valueType: 'object',
                size: 'small'
            },
        }
        ];
}

export default defineComponent({
    name: 'FetchConfig',
    emits: ['update:modelValue'],
    props: {
        modelValue: [Object, String],
        to: String,
    },
    components: {
        DragForm: designerForm.$form(),
        FnEditor,
        StructEditor
    },
    inject: ['designer'],
    data() {
        return {
          activeTab: 'first',
            visible: false,
            value: deepCopy(this.modelValue || {}),
            form: {
                api: {},
                formData: {},
                rule: [],
                options: {
                    form: {
                        labelWidth: '90px',
                        size: 'default'
                    },
                    submitBtn: false,
                    resetBtn: false,
                }
            }
        };
    },
    computed: {
        t() {
            return this.designer.setupState.t;
        },
        configured() {
            return !is.empty(this.modelValue);
        },
    },
    watch: {
        visible(v) {
            if (v) {
                this.value = deepCopy(this.modelValue || {});
            }
        },
    },
    methods: {
        open() {
            this.visible = true;
        },
        active() {
            const formData = this.value;
            this.form.rule = formData.type === 'static' ? [] : makeRule(this.t);
            this.form.formData = {...formData};
            this.form.label = formData.label;
            this.form.type = formData.type;
            this.form.data = formData.data;
            this.form.parse = formData.parse || '';
            this.form.onError = formData.onError || '';
        },
        save() {
            this.form.api.validate().then(() => {
                const formData = {...this.form.formData};
                if ((this.$refs.parse && !this.$refs.parse.save()) || (this.$refs.error && !this.$refs.error.save())) {
                    return;
                }
                formData.parse = this.form.parse;
                formData.onError = this.form.onError;
                formData.label = this.form.label;
                formData.type = this.form.type;
                formData.to = this.to || 'options';
                this.$emit('update:modelValue', formData);
                this.visible = false;
            }).catch(err => {
                console.error(err);
                errorMessage(err[Object.keys(err)[0]][0].message);
            });
        },
    },
    created() {
        this.active();
    }
});
</script>

<style scoped>
._fd-gfc-dialog .el-tabs__header {
    margin-bottom: 0;
}

._fd-gfc-dialog .form-create {
    margin-top: 15px;
}

._fd-gfc-dialog .req .n-col {
   line-height: 30px;
}

._fd-gfc-con .CodeMirror {
    height: 100%;
    width: 100%;
}

._fd-gfc-con .CodeMirror-wrap pre.CodeMirror-line {
    padding-left: 20px;
}
</style>
