

import {designerForm} from './utils/form';
import Fetch from './components/Fetch.vue';
import Struct from './components/Struct.vue';
import DragBox from './components/DragBox.vue';
import DragTool from './components/DragTool.vue';
import Required from './components/Required.vue';
import Validate from './components/Validate.vue';
import unique from '@form-create/utils/lib/unique';
import FcDesigner from './components/FcDesigner.vue';
import ColorPicker from './components/ColorPicker.vue'
import CustomAlert from './components/CustomAlert.vue';
import FcEditor from '@form-create/component-wangeditor';
import TableOptions from './components/TableOptions.vue';
import TableView from './components/table/TableView.vue';
import Table from './components/table/Table.vue';
import TableFormView from './components/tableForm/TableFormView.vue';
import TableForm from './components/tableForm/TableForm.vue';
import TableFormColumnView from './components/tableForm/TableFormColumnView.vue';
import draggable from 'vuedraggable';
import {compareVersion,makeOptionsRule} from './utils/index';
import formCreate from './utils/form';
import globalUseLocale, {t} from './utils/locale';
import './style/index.css';
import './style/icon.css';
import './utils/highlight/style.css';

const addComponent = (id, component, previewComponent) => {
    designerForm.component(id, previewComponent || component);
    formCreate.component(id, component);
}

designerForm.component('draggable', draggable);
designerForm.component('DragTool', DragTool);
designerForm.component('DragBox', DragBox);
designerForm.component('Required', Required);
designerForm.component('Validate', Validate);
designerForm.component('Struct', Struct);
designerForm.component('TableOptions', TableOptions);
designerForm.component('TableFormColumn', TableFormColumnView);
designerForm.component('ColorPicker', ColorPicker);
designerForm.component('CustomAlert', CustomAlert);
designerForm.component('FcEditor', FcEditor);
designerForm.component('Fetch', Fetch);
formCreate.component('FcEditor', FcEditor);
addComponent('FcEditor', FcEditor);
addComponent('TableForm', TableForm, TableFormView);
addComponent('FcTable', Table, TableView);


designerForm.register('_fc', {
  init(fc, rule) {
      rule._id = unique();
      if (fc.repeat)
          rule.field = unique();
      if (fc.value) {
          rule.effect._fc = false;
      }
  }
});

designerForm.register('_fc_tool', {
  init(_, rule) {
      rule.props.unique = unique();
  }
});

const install = function (Vue) {
  Vue.component('FcDesigner', FcDesigner);
};

FcDesigner.install = install;
FcDesigner.makeOptionsRule = makeOptionsRule;
FcDesigner.formCreate = formCreate;
FcDesigner.designerForm = designerForm
FcDesigner.component = addComponent;
FcDesigner.useLocale = globalUseLocale;
FcDesigner.t = t;

if (compareVersion('3.1.27', formCreate.version) === 1) {
    console.warn('Please use FormCreate version 3.1.27 or greater, see https://github.com/xaboy/form-create.');
}

export default FcDesigner;

export {formCreate, designerForm, install};