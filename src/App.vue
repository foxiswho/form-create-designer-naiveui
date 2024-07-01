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
      <div class="_fc-top">
        <div class="_fc-top-nav">
          <div class="_fc-top-copyright">
            <img class="_fc-t-logo" src="http://form-create.com/logo.png" alt="logo"/>
            <div class="_fc-t-name"><span>FcDesigner</span></div>
          </div>
          <div class="_fc-top-link">
            <a href="https://form-create.com/" target="_blank" class="item">官网</a>
            <a href="https://pro.form-create.com/view" class="item pro-version">高级版🔥</a>
            <a href="https://view.form-create.com/" target="_blank" class="item">文档</a>
            <a href="https://form-create.com/designer" target="_blank" class="item">Vue2版本</a>
            <a href="https://github.com/xaboy/form-create-designer" target="_blank" class="item">查看源码</a>
          </div>
        </div>
      </div>
      <fc-designer ref="designer" :config="config" :handle="handle" :locale="locale">
        <template #handle>
          <n-button size="small" ghost @click="setJson"> 导入JSON</n-button>
          <n-button size="small" ghost @click="setOption"> 导入Options</n-button>
        </template>
      </fc-designer>

      <n-modal
          v-if="state"
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
          v-if="stateApi"
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
          v-if="stateApiSave"
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
const CACHE_KEY = "fc-config-$101"
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
      config: {
        showFormConfig: false,
        fieldReadonly: false,
        showSaveBtn: true,
      },
      handle: [
        {
          label: '中英切换',
          handle: () => {
            this.changeLocale();
          },
        },
      ],
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
      autoSaveId: null,
      stateApi: false,
      stateApiSave: false,
      apiUrlApi: null,
      apiUrlData:{
        url: '',
        urlDetail: '',
        dictionary: '',
      },
      apiUrlRule:formCreate.parseJson('[{"type":"span","title":"例","native":false,"children":["https://fenbaoya.com/api/designer/naiveui"],"_fc_drag_tag":"span","hidden":false,"display":true},{"type":"input","field":"url","title":"保存地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"urlDetail","title":"详情地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"dictionary","title":"数据字典地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]}]'),
      apiUrlOption:formCreate.parseJson('{"form":{"labelPlacement":"left","requireMarkPlacement":"right","size":"small","labelWidth":"120","show-feedback":true},"submitBtn":{"show":true,"innerText":"提交"},"resetBtn":{"show":false,"innerText":"重置"}}'),
      routerParam:{id:''},
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
    getCache() {
      function def() {
        return {opt: null, rule: null};
      }
      try {
        let cache = localStorage.getItem(CACHE_KEY);
        if (!cache) {
          return def();
        }
        cache = JSON.parse(cache);
        cache.rule = formCreate.parseJson(cache.rule);
        cache.opt.submitBtn = false;
        return cache;
      } catch (e) {
        return def();
      }
    },
    setCache({opt: u, rule: s}) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        opt: u,
        rule: formCreate.toJson(s)
      }))
    },
    loadAutoSave() {
      const s = this.autosave;
      if (s === false) return;
      this.autoSaveId = setInterval(() => {
        this.setCache({opt: this.$refs.designer.getOption(), rule: this.$refs.designer.getRule()});
      }, is.Number(s) ? s : 2000);
    },
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
      this.initApiData()
      if (!this.apiUrlData.url){
        this.err ="接口地址不能为空"
        this.stateApiSave = true
        return
      }
      if(!this.routerParam.id){
        notification.error({
          content: "id 不能为空",
          duration: 2500,
          keepAliveOnHover: true
        })
        return;
      }
      const data={id:this.routerParam.id,data:{content:ruleJson,form:optJson,formSingle:false}}

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

      fetch(this.apiUrlData.url,{
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
            console.log('data',data)
            if ('200' == data.code) {
              notification.success({
                content: '操作成功',
                duration: 2500,
                keepAliveOnHover: true
              })
            }else{
              notification.error({
                content: data.message,
                duration: 2500,
                keepAliveOnHover: true
              })
            }

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
        this.apiUrlData.url = env.VITE_WEBSITE_URL+env.VITE_DESIGNER_URL
        this.apiUrlData.urlDetail = env.VITE_WEBSITE_URL+env.VITE_DESIGNER_URL_DETAIL
        this.apiUrlData.dictionary = env.VITE_WEBSITE_URL+env.VITE_DESIGNER_URL_DICTIONARY
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
  })
<\/script>`;
    },
    onApiSubmit(formData){
      console.log('xxxx',formData)
      localStorage.setItem('URL',formData.url);
    },
    onApiSubmit2(){
      this.apiUrlApi.submit()
    },
    // 获取数据
    async loadData(){
      const that = this
      if(this.routerParam.id){
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

        await fetch(this.apiUrlData.urlDetail+'?id='+this.routerParam.id,{
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
              console.log('data',data.data)
              if ('200' === data.code) {
                if(data.data &&data.data.data.content){
                  const obj= data.data.data
                  console.log('data.content',obj)
                  let info={opt:{},rule:[]}

                  let val = JSON.parse(obj.content);
                  if (!Array.isArray(val)) {
                    return;
                  }
                  info.rule = formCreate.parseJson(obj.content)
                  if(obj.form){
                    info.opt = JSON.parse(obj.form);
                    if (!is.Object(info.opt) || !info.opt) {
                      return;
                    }
                  }
                  that.setCache(info)
                }
                notification.success({
                  content: '获取成功',
                  duration: 2500,
                  keepAliveOnHover: true
                })
              }else{
                notification.error({
                  content: data.message,
                  duration: 2500,
                  keepAliveOnHover: true
                })
              }


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
  },
  beforeCreate() {
    window.jsonlint = jsonlint;
    this.routerParam = GetRequest('')
    console.log('GetRequest',this.routerParam)
  },
  beforeMount() {

  },
  async mounted() {
    this.routerParam = GetRequest('')
    console.log('beforeMount', this.routerParam)
    // await this.loadData()
    let tmp=formCreate.parseJson('[{"type":"span","title":"例","native":false,"children":["https://fenbaoya.com/api/designer/naiveui"],"_fc_drag_tag":"span","hidden":false,"display":true},{"type":"input","field":"url","title":"保存地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"urlDetail","title":"详情地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]},{"type":"input","field":"dictionary","title":"数据字典地址","info":"","$required":true,"_fc_drag_tag":"input","hidden":false,"display":true,"validate":[{"trigger":"blur","mode":"required","message":"格式错误","required":true,"type":"url"}]}]')
    //this.$refs.designer.setRule(tmp)
    const u = this.getCache();
    if (u) {
      //u.rule && this.$refs.designer.setRule(u.rule)
      u.opt && this.$refs.designer.setOption(u.opt)
      // await this.$nextTick(() => {
      //       this.loadAutoSave()
      //     }
      // )
      setTimeout(()=>{
        this.loadAutoSave()
      }, 2000)
    }


  },
  beforeDestroy(){
    const u = this.autoSaveId;
    u && clearInterval(u)
  }
};
</script>

<style>
#app {
  height: 100%;
}
._fc-top {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #282828;
  position: relative;
  cursor: default;
}

:focus-visible {
  outline: 0 none;
}

.top_img {
  cursor: pointer;
}

._fc-top .close {
  position: absolute;
  right: 15px;
  top: 6px;
  color: #FFFFFF;
  background-color: #c6c6c652;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  cursor: pointer;
}

._fc-top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 20px;
}

._fc-top-copyright {
  display: flex;
}

._fc-top-link {
}

._fc-top a {
  height: 35px;
  font-size: 14px;
  line-height: 35px;
  color: #aaa;
  text-decoration: none;
}

._fc-top a + a {
  margin-left: 20px;
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
  color: #fff;
  font-size: 18px;
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

.handle {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

._fc-t-menu .el-dropdown, .handle .el-dropdown {
  cursor: pointer;
}

.handle .el-icon {
  margin-left: 0;
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
  border-top: 1px solid #ECECEC;
  background-color: #fff;
  cursor: pointer;
}

._fc-t-dialog .CodeMirror {
  height: 450px;
}

._fc-t-dialog .CodeMirror-line {
  line-height: 16px !important;
  font-size: 13px !important;
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

._fc-zz {
  background-image: -webkit-linear-gradient(left, #cd7f32, #d81159 10%, #ffbc42 20%, #75d701 30%, #30a9de 40%, #d81159 60%, #ffbc42 70%, #75d701 80%, #30a9de 90%, #cd7f32);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  -webkit-animation: flowlight 5s linear infinite;
  animation: flowlight 5s linear infinite;
  font-weight: 700;
}

@keyframes flowlight {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@-webkit-keyframes flowlight {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.pro-version{
  color: #cd7f32!important;
  font-weight: 600;
}
</style>
