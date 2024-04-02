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

<script setup>
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
import { computed, defineComponent, ref,watch,nextTick,onMounted } from 'vue'
import { GetRequest } from './utils/tools'
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
const state = ref(false)
const value = ref(null)
const title = ref(TITLE)
const editor = ref(null)
const err = ref(false)
const type = ref(-1)
const lang = ref("cn")
const locale = ref(null)
const isLoading = ref(false)
const languageDict = ref({
  cn: zhCN,
  en: enUS
})
const dateLanguageDict=ref({
  cn: dateZhCN,
  en: dateEnUs
})
const naiveLanguage=ref(zhCN)
const dateLanguage=ref(dateZhCN)
const stateApi=ref(false)
const stateApiSave=ref(false)
const apiUrlApi=ref(null)
const apiUrlData=ref({
  url: '',
  urlDetail: '',
  dictionary: '',
})
const apiUrlRule= ref({})
const apiUrlOption= ref({})
const routerParam= ref({id:''})
const designer= ref(null)
apiUrlRule.value = formCreate.parseJson('[{"type":"span","title":"例","native":false,"children":["https://fenbaoya.com/api/designer/naiveui"],"_fc_drag_tag":"span","hidden":false,"display":true},{"type":"input","field":"url","title":"保存地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"urlDetail","title":"详情地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"dictionary","title":"数据字典地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]}]')
apiUrlOption.value = formCreate.parseJson('{"form":{"labelPlacement":"left","requireMarkPlacement":"right","size":"small","labelWidth":"120","show-feedback":true},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":false,"innerText":"重置"}}')

watch(()=>state.value,(newValue, oldValue) =>{
  if (!newValue) {
    value.value = null;
    err.value = false;
  }
})
watch(()=>value.value,(newValue, oldValue) =>{
  load()
})

function changeLocale() {
  if (lang.value === "cn") {
    locale.value = En;
    lang.value = "en";
    naiveLanguage.value = languageDict.value["en"];
    dateLanguage.value = dateLanguageDict.value["en"]
  } else {
    locale.value = ZhCn;
    lang.value = "cn";
    naiveLanguage.value = this.languageDict.value["cn"];
    dateLanguage.value = this.dateLanguageDict.value["cn"]
  }
}

function load() {
  let val;
  if (type.value === 2) {
    val = value.value;
  } else if (type.value === 0) {
    val = formCreate.toJson(value.value, 2);
  } else {
    val = JSON.stringify(value.value, null, 2);
  }
  nextTick(() => {
    initCodeContent(val);
  });
}
function initCodeContent(val) {
  isLoading.value = true;
  setTimeout(() => {
    if (editor.value) {
      editor.value.destroy();
    }
    editor.value = new EditorView({
      doc: val || 'Press Ctrl-Space in here...\n',
      extensions: [
        basicSetup,
        javascript(),
        json(),
      ],
      parent: editor.value,
      options: {
        lineNumbers: true,
        line: true,
        //括号匹配
        matchBrackets: true,
      },
    });
    isLoading.value = false;
  }, 500);
}
function insertCommandContent(val) {
  editor.value.dispatch({
    changes: {
      from: 0,
      to: editor.value.state.doc.length,
      insert: val || "Press Ctrl-Space in here...\n"
    },
  })
}
function onValidationError(e) {
  err.value = e.length !== 0;
}
function showJson() {
  state.value = true;
  type.value = 0;
  value.value = designer.value.getRule();
}
function showOption() {
  state.value = true;
  type.value = 1;
  value.value = designer.value.getOption();
}
function showTemplate() {
  state.value = true;
  type.value = 2;
  value.value = this.makeTemplate();
}
function setJson() {
  state.value = true;
  type.value = 3;
  value.value = [];
}
function setOption() {
  state.value = true;
  type.value = 4;
  value.value = { form: {} };
}
function showSaveData() {
  //this.value = this.saveData();
  //const notification = useNotification()
  stateApiSave.value = false
  const rule = designer.value.getRule();
  const opt = designer.value.getOption();
  const ruleJson= formCreate.toJson(rule).replaceAll("\\", "\\\\")
  const optJson = JSON.stringify(opt)
  console.log('rule',rule)
  console.log('opt',opt)
  // console.log('rule',ruleJson)
  // console.log('opt',optJson)

  initApiData()
  if (!apiUrlData.value.url){
    err.value ="接口地址不能为空"
    stateApiSave.value = true
    return
  }
  if(!routerParam.value.id){
    notification.error({
      content: 'id 不能为空',
      duration: 2500,
      keepAliveOnHover: true
    })
    return
  }
  const data={content:ruleJson,form:optJson,formSingle:false,id:this.routerParam.id}
  let env= __APP_ENV__;
  let headers = new Headers({
    'Content-Type': 'application/json',
  });
  //根据 环境变量取 本地缓存数据
  if(env.VITE_HEADER_KEY&&env.VITE_TOKEN_KEY){
    let tokenKey=localStorage.getItem(env.VITE_TOKEN_KEY);
    if(tokenKey){
      //是否存在内部 键值，如果存在，则按内部键值取值
      if(env.VITE_TOKEN_KEY_ACCESS){
        let obj = JSON.parse(tokenKey)
        if(obj){
          headers.set(env.VITE_HEADER_KEY,obj[env.VITE_TOKEN_KEY_ACCESS])
        }
      }else{
        //直接填充值内容
        headers.set(env.VITE_HEADER_KEY,tokenKey)
      }
    }
  }

  fetch(apiUrlData.value.url,{
    method:"POST",
    headers: headers,
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
}
function showApiSetting() {
  stateApi.value = true;
  type.value = 5;
  initApiData()
}
function initApiData(){
  let url=localStorage.getItem('URL'),urlDetail=localStorage.getItem('URL-detail'),dictionary=localStorage.getItem('URL-dictionary');
  console.log('localStorage:URL',url)
  if (url !== undefined&&url){
    apiUrlData.value.url = url;
    apiUrlData.value.urlDetail = urlDetail;
    apiUrlData.value.dictionary = dictionary;
  }else{
    let env= __APP_ENV__;
    apiUrlData.value.url = env.VITE_WEBSITE_URL+env.VITE_DESIGNER_URL
    apiUrlData.value.urlDetail = env.VITE_WEBSITE_URL+env.VITE_DESIGNER_URL_DETAIL
    apiUrlData.value.dictionary = env.VITE_WEBSITE_URL+env.VITE_DESIGNER_URL_DICTIONARY
  }
  console.log('__APP_ENV__',__APP_ENV__)
  console.log('apiUrlData',apiUrlData.value)
}
function onOk() {
  if (err.value) return;
  const json = editor.value.state.doc;
  let val = JSON.parse(json);
  if (type.value === 3) {
    if (!Array.isArray(val)) {
      this.err = true;
      return;
    }
    designer.value.value.setRule(formCreate.parseJson(json));
  } else {
    if (!is.Object(val) || !val.form) {
      this.err = true;
      return;
    }
    designer.value.setOption(val);
  }
  state.value = false;
}
function makeTemplate() {
  const rule = designer.value.getRule();
  const opt = designer.value.getOption();
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
}
function onApiSubmit(formData){
  console.log('xxxx',formData)
  localStorage.setItem('URL',formData.url);
}
function onApiSubmit2(){
  apiUrlApi.value.submit()
}
// 获取数据
function loadData(){
  if(routerParam.value.id){
    this.initApiData()
    let env= __APP_ENV__;
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    //根据 环境变量取 本地缓存数据
    if(env.VITE_HEADER_KEY&&env.VITE_TOKEN_KEY){
      let tokenKey=localStorage.getItem(env.VITE_TOKEN_KEY);
      if(tokenKey){
        //是否存在内部 键值，如果存在，则按内部键值取值
        if(env.VITE_TOKEN_KEY_ACCESS){
          let obj = JSON.parse(tokenKey)
          if(obj){
            headers.set(env.VITE_HEADER_KEY,obj[env.VITE_TOKEN_KEY_ACCESS])
          }
        }else{
          //直接填充值内容
          headers.set(env.VITE_HEADER_KEY,tokenKey)
        }
      }
    }
    console.log('apiUrlData222',apiUrlData.value)
    fetch(apiUrlData.value.urlDetail+'?id='+routerParam.value.id,{
      method:"POST",
      headers: headers,
      body:JSON.stringify(this.routerParam),
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
          if(data.content){
            let val = JSON.parse(data.content);
            if (!Array.isArray(val)) {
              return;
            }
            designer.value.setRule(formCreate.parseJson(data.content));
            if(data.form){
              let val2 = JSON.parse(data.form);
              if (!is.Object(val2) || !val2.form) {
                return;
              }
              designer.value.setOption(val2);
            }
          }
          notification.success({
            content: '获取成功',
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
  }
}

window.jsonlint = jsonlint;
routerParam.value = GetRequest('')
console.log('GetRequest',routerParam.value)
loadData()

const tmp=formCreate.parseJson('[{"type":"span","title":"例","native":false,"children":["https://fenbaoya.com/api/designer/naiveui"],"_fc_drag_tag":"span","hidden":false,"display":true},{"type":"input","field":"url","title":"保存地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"urlDetail","title":"详情地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"dictionary","title":"数据字典地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]}]')
// setTimeout(()=>{
//   designer.value.setRule([]);
//   designer.value.setOption([]);
// },500)

onMounted(() => {
  // designer.value.setRule([]);
  // designer.value.setOption([]);
})
// this.$nextTick(() => {
//   this.$refs.designer.setRule(this.apiUrlRule);
// });
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
