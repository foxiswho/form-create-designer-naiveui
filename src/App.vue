<template>
  <n-config-provider style="height: 100vh" :locale="naiveLanguage" :date-locale="dateLanguage">
    <div id="app">
      <div class="_fc-t-header">
        <img class="_fc-t-logo" src="http://form-create.com/logo.png" />
        <div class="_fc-t-name">form-create-designer-naiveui</div>
        <div class="_fc-t-menu">
          <n-space>
            <n-button size="small" ghost @click="setJson"> 导入JSON</n-button>
            <n-button size="small" ghost @click="setOption"> 导入Options</n-button>
            <n-button size="small" secondary type="info" @click="showJson">生成JSON</n-button>
            <n-button size="small" secondary type="success" @click="showOption">生成Options</n-button>
            <n-button size="small" secondary type="error" @click="showTemplate">生成组件</n-button>
            <n-button size="small" type="info" @click="showSaveData">保存</n-button>
            <n-button size="small" ghost @click="showApiSetting">设置</n-button>
            <n-button size="small" ghost @click="changeLocale">中英切换</n-button>
          </n-space>
        </div>
      </div>
      <fc-designer ref="designer" :locale="locale" />

      <n-modal
          v-model:show="state"
          preset="dialog"
          :show-icon="false"
          :title="title[type]"
          class="_fc-t-dialog"
          style="width: 600px"
      >
        <template v-if="isLoading">
          <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
        </template>
        <div ref="editor" v-if="state" v-show="isLoading === false"></div>
        <span style="color: red;" v-if="err">输入内容格式有误!</span>
        <template #action v-if="type > 2">
          <n-space>
            <n-button @click="state = false" size="small">取 消</n-button>
            <n-button type="primary" @click="onOk" size="small">确 定</n-button>
          </n-space>
        </template>
      </n-modal>
      <n-modal
          v-model:show="stateApi"
          preset="dialog"
          :show-icon="false"
          title="设置"
          class="_fc-t-dialog"
          style="width: 600px"
      >
        <template v-if="isLoading">
          <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
        </template>
        <div ref="editor" v-if="stateApi" v-show="isLoading === false">
          <form-create
              v-model:api="apiUrlApi"
              v-model="apiUrlData"
              :rule="apiUrlRule"
              :option="apiUrlOption"
              @submit="onApiSubmit"
          ></form-create>
        </div>
        <template #action >
          <n-space>
            <n-button @click="stateApi = false" size="small">取 消</n-button>
            <n-button type="primary" @click="onApiSubmit2" size="small">确 定</n-button>
          </n-space>
        </template>
      </n-modal>
      <n-modal
          v-model:show="stateApiSave"
          preset="dialog"
          :show-icon="false"
          title="提示"
          class="_fc-t-dialog"
          style="width: 600px"
      >
        <template v-if="isLoading">
          <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
        </template>
        <span style="color: red;" v-if="err">{{err}}</span>
      </n-modal>
    </div>
  </n-config-provider>
</template>

<script>
import { enUS, NConfigProvider, dateZhCN, zhCN, } from 'naive-ui'
import is from '@form-create/utils/lib/type';
import jsonlint from "jsonlint-mod";
import { javascript } from "@codemirror/lang-javascript";
import { json } from '@codemirror/lang-json';
import { basicSetup, EditorView } from "codemirror";

import formCreate from "@form-create/naive-ui";
import ZhCn from "./locale/zh-cn";
import En from "./locale/en";
import dateEnUs from 'naive-ui/es/locales/date/enUS';
import { computed, defineComponent, ref } from 'vue'
import {
  createDiscreteApi,
  lightTheme
} from 'naive-ui'

const themeRef = ref<'light' | 'dark'>('dark')
const configProviderPropsRef = computed(() => ({
  theme: lightTheme
}))

const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
    {
      configProviderProps: configProviderPropsRef
    }
)

const TITLE = [
  "生成规则",
  "表单规则",
  "生成组件",
  "设置生成规则",
  "设置表单规则",
];

export default {
  name: "app",
  components: [ NConfigProvider ],
  data() {
    return {
      state: false,
      value: null,
      title: TITLE,
      editor: null,
      err: false,
      type: -1,
      lang: "cn",
      locale: null,
      isLoading: false,
      languageDict: {
        cn: zhCN,
        en: enUS
      },
      dateLanguageDict: {
        cn: dateZhCN,
        en: dateEnUs
      },
      naiveLanguage: zhCN,
      dateLanguage: dateZhCN,
      stateApi: false,
      stateApiSave: false,
      apiUrlApi: null,
      apiUrlData:{
        url: '1'
      },
      apiUrlRule:formCreate.parseJson('[{"type":"input","field":"url","title":"接口地址","info":"","$required":false,"_fc_drag_tag":"input","hidden":false,"display":true},{"type":"span","title":"例","native":false,"children":["https://fenbaoya.com/api/designer/naiveui"],"_fc_drag_tag":"span","hidden":false,"display":true}]'),
      apiUrlOption:formCreate.parseJson('{"form":{"labelPlacement":"left","requireMarkPlacement":"right","size":"small","labelWidth":"100","show-feedback":true},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":false,"innerText":"重置"}}'),
    };
  },
  watch: {
    state(n) {
      if (!n) {
        this.value = null;
        this.err = false;
      }
    },
    value() {
      this.load();
    },
  },
  methods: {
    changeLocale() {
      if (this.lang === "cn") {
        this.locale = En;
        this.lang = "en";
        this.naiveLanguage = this.languageDict["en"];
        this.dateLanguage = this.dateLanguageDict["en"]
      } else {
        this.locale = ZhCn;
        this.lang = "cn";
        this.naiveLanguage = this.languageDict["cn"];
        this.dateLanguage = this.dateLanguageDict["cn"]
      }
    },
    load() {
      let val;
      if (this.type === 2) {
        val = this.value;
      } else if (this.type === 0) {
        val = formCreate.toJson(this.value, 2);
      } else {
        val = JSON.stringify(this.value, null, 2);
      }
      this.$nextTick(() => {
        this.initCodeContent(val);
      });
    },
    initCodeContent(val) {
      this.isLoading = true;
      setTimeout(() => {
        if (this.editor) {
          this.editor.destroy();
        }
        this.editor = new EditorView({
          doc: val || 'Press Ctrl-Space in here...\n',
          extensions: [
            basicSetup,
            javascript(),
            json(),
          ],
          parent: this.$refs.editor,
          options: {
            lineNumbers: true,
            line: true,
            //括号匹配
            matchBrackets: true,
          },
        });
        this.isLoading = false;
      }, 500);
    },
    insertCommandContent(val) {
      this.editor.dispatch({
        changes: {
          from: 0,
          to: this.editor.state.doc.length,
          insert: val || "Press Ctrl-Space in here...\n"
        },
      })
    },
    onValidationError(e) {
      this.err = e.length !== 0;
    },
    showJson() {
      this.state = true;
      this.type = 0;
      this.value = this.$refs.designer.getRule();
    },
    showOption() {
      this.state = true;
      this.type = 1;
      this.value = this.$refs.designer.getOption();
    },
    showTemplate() {
      this.state = true;
      this.type = 2;
      this.value = this.makeTemplate();
    },
    setJson() {
      this.state = true;
      this.type = 3;
      this.value = [];
    },
    setOption() {
      this.state = true;
      this.type = 4;
      this.value = { form: {} };
    },
    showSaveData() {
      //this.value = this.saveData();
      //const notification = useNotification()
      this.stateApiSave = false
      const rule = this.$refs.designer.getRule();
      const opt = this.$refs.designer.getOption();
      const ruleJson= formCreate.toJson(rule).replaceAll("\\", "\\\\")
      const optJson = JSON.stringify(opt)
      console.log('rule',rule)
      console.log('opt',opt)
      // console.log('rule',ruleJson)
      // console.log('opt',optJson)
      const data={content:ruleJson,form:optJson,formSingle:false}
      this.initApiData()
      if (!this.apiUrlData.url){
        this.err ="接口地址不能为空"
        this.stateApiSave = true
        return
      }

      fetch(this.apiUrlData.url,{
        method:"POST",
        body:JSON.stringify(data),
      })
          .then(response=>{
        console.log('response',response)
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject({
            status: response.status,
            statusText: response.statusText
          })
        }
      })
          .then(data=>{
            notification.success({
              content: '操作成功',
              duration: 2500,
              keepAliveOnHover: true
            })
          })
          .catch(error =>{
            if (error.status === 404) {
              notification.error({
                content: '无法访问该地址 404',
                duration: 2500,
                keepAliveOnHover: true
              })
            }else{
              notification.error({
                content: error.statusText,
                duration: 2500,
                keepAliveOnHover: true
              })
            }
          });
    },
    showApiSetting() {
      this.stateApi = true;
      this.type = 5;
      this.initApiData()
    },
    initApiData(){
      let url=localStorage.getItem('URL');
      console.log('localStorage:URL',url)
      if (url !== undefined&&url){
         this.apiUrlData.url = url;
      }else{
        let env= __APP_ENV__;
        this.apiUrlData.url = env.VITE_WEBSITE_URL+env.VITE_BASE_URL+env.VITE_DESIGNER_URL
      }
      console.log('__APP_ENV__',__APP_ENV__)
    },
    onOk() {
      if (this.err) return;
      const json = this.editor.state.doc;
      let val = JSON.parse(json);
      if (this.type === 3) {
        if (!Array.isArray(val)) {
          this.err = true;
          return;
        }
        this.$refs.designer.setRule(formCreate.parseJson(json));
      } else {
        if (!is.Object(val) || !val.form) {
          this.err = true;
          return;
        }
        this.$refs.designer.setOption(val);
      }
      this.state = false;
    },
    makeTemplate() {
      const rule = this.$refs.designer.getRule();
      const opt = this.$refs.designer.getOption();
      return `<template>
  <form-create
    v-model="fapi"
    :rule="rule"
    :option="option"
    @submit="onSubmit"
  ></form-create>
</template>

<script>
import formCreate from "@form-create/naive-ui";
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const fapi = ref(null);
    const rule = ref(formCreate.parseJson('${formCreate.toJson(rule).replaceAll("\\", "\\\\")}'));
    const option = ref(formCreate.parseJson('${JSON.stringify(opt)}'));

    function onSubmit (formData) {
      // TODO 提交表单
    }

    return {
      fapi,
      rule,
      option,
      onSubmit,
    }
  },
<\/script>`;
    },
    onApiSubmit(formData){
      console.log('xxxx',formData)
      localStorage.setItem('URL',formData.url);
    },
    onApiSubmit2(){
      this.apiUrlApi.submit()
    }
  },
  beforeCreate() {
    window.jsonlint = jsonlint;
  },

};
</script>

<style>
#app {
  height: 100%;
}
._fc-t-header {
  height: 60px;
  margin: 0 20px;
  position: relative;
  display: flex;
  align-items: center;
  cursor: default;
}

._fc-t-logo {
  height: 26px;
}

._fc-t-name {
  display: inline-block;
  color: rgba(0, 0, 0, 0.8);
  font-size: 20px;
  font-weight: 600;
  margin-left: 5px;
}

._fc-t-menu {
  position: absolute;
  right: 0;
}

._fc-t-menu i {
  font-size: 12px;
}

body {
  min-height: 100vh;
  padding: 0;
  margin: 0;
  display: flex !important;
  flex-direction: column !important;
}

#app {
  display: flex;
  flex-direction: column;
  flex: 1;
}

._fc-copyright {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  font-size: 16px;
  border-top: 1px solid #ececec;
  background-color: #fff;
  cursor: pointer;
}

._fc-t-dialog .CodeMirror {
  height: 450px;
}
.CodeMirror-line {
  /* line-height: 16px !important; */
  /* font-size: 13px !important; */
}

.CodeMirror-sizer {
  /* line-height: 16px !important; */
  /* font-size: 13px !important; */
}

.CodeMirror-lint-tooltip {
  z-index: 2021 !important;
}

._fc-t-dialog .el-dialog__body {
  padding: 0px 20px;
}

._fc-b-item {
  display: flex;
}
</style>
