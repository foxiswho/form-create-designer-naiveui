<template>
    <div class="_fd-gfc">
        <n-badge type="warning" is-dot :show="!configured">
            <n-button @click="visible=true" size="small">{{ t('struct.title') }}</n-button>
        </n-badge>
        <n-dialog class="_fd-gfc-dialog" :title="t('fetch.optionsType.fetch')" v-if="visible" destroy-on-close
                   :mask-closable="false"
                   append-to-body
                   width="980px">
            <n-layout class="_fd-gfc-con" style="height: 450px;">
                <n-tabs model-value="first" class="_fc-tabs" style="width: 100%">
                    <n-tab-pane :tab="t('fetch.config')" name="first">
                        <DragForm v-model:api="form.api" v-model="form.formData" :rule="form.rule"
                                  :option="form.options"></DragForm>
                    </n-tab-pane>
                    <n-tab-pane lazy :tab="t('fetch.parse')" name="second">
                        <FnEditor style="height: 415px;" v-model="form.parse" name="parse"
                                  :args="[{name:'res', info: t('fetch.response')}]"
                                  ref="parse"></FnEditor>
                    </n-tab-pane>
                    <n-tab-pane lazy :tab="t('fetch.onError')" name="third">
                        <FnEditor style="height: 415px;" v-model="form.onError" name="onError"
                                  :args="['e']"
                                  ref="error"></FnEditor>
                    </n-tab-pane>
                </n-tabs>
            </n-layout>
            <template #footer>
                <div>
                    <n-button size="default" @click="visible=false">{{ t('props.cancel') }}</n-button>
                    <n-button type="primary" size="default" @click="save" color="#2f73ff">{{
                            t('props.ok')
                        }}
                    </n-button>
                </div>
            </template>
        </n-dialog>
    </div>
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
            props: {size: 'default'},
            validate: [{type: 'url', message: t('fetch.actionRequired'), trigger: 'blur'}]
        },
        {
            type: 'radio',
            field: 'method',
            title: t('fetch.method'),
            value: 'GET',
            props: {
                size: 'default'
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
                size: 'default'
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
                size: 'default'
            },
        }];
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

<style>
._fd-gfc, ._fd-gfc .el-badge {
    width: 100%;
}

._fd-gfc .el-button {
    font-weight: 400;
    width: 100%;
    border-color: #2E73FF;
    color: #2E73FF;
}

._fd-gfc-dialog .el-tabs__header {
    margin-bottom: 0;
}

._fd-gfc-dialog .form-create {
    margin-top: 15px;
}

._fd-gfc-con .CodeMirror {
    height: 100%;
    width: 100%;
}

._fd-gfc-con .CodeMirror-wrap pre.CodeMirror-line {
    padding-left: 20px;
}
</style>
