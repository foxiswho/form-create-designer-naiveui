import CustomAlert from './components/CustomAlert.vue';
import FcDesigner from './components/FcDesigner.vue';
import DragTool from './components/DragTool.vue';
import Struct from './components/Struct.vue';
import Row from './components/Row.vue';
import HtmlEditor from './components/HtmlEditor.vue';
import FnEditor from './components/FnEditor.vue';
import FetchConfig from './components/FetchConfig.vue';
import ColorPicker from './components/ColorPicker.vue';
import SizeInput from './components/SizeInput.vue';
import FieldInput from './components/FieldInput.vue';
import EventConfig from './components/EventConfig.vue';
import FnConfig from './components/FnConfig.vue';
import TableView from './components/table/TableView.vue';
import Table from './components/table/Table.vue';
import Validate from './components/Validate.vue';
import DragBox from './components/DragBox.vue';
import Required from './components/Required.vue';
import TableOptions from './components/TableOptions.vue';
import TreeOptions from './components/TreeOptions.vue';
import TableFormView from './components/tableForm/TableFormView.vue';
import TableForm from './components/tableForm/TableForm.vue';
import TableFormColumnView from './components/tableForm/TableFormColumnView.vue';
import {designerForm} from './utils/form';
import FcEditor from '@form-create/component-wangeditor';
import draggable from 'vuedraggable/src/vuedraggable';
import {compareVersion, makeOptionsRule} from './utils/index';
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
designerForm.component('Validate', Validate);
designerForm.component('Struct', Struct);
designerForm.component('HtmlEditor', HtmlEditor);
designerForm.component('FetchConfig', FetchConfig);
designerForm.component('FnEditor', FnEditor);
designerForm.component('Required', Required);
designerForm.component('TableOptions', TableOptions);
designerForm.component('TreeOptions', TreeOptions);
designerForm.component('TableFormColumn', TableFormColumnView);
designerForm.component('EventConfig', EventConfig);
designerForm.component('ColorInput', ColorPicker);
designerForm.component('ColorPicker', ColorPicker);
designerForm.component('SizeInput', SizeInput);
designerForm.component('FieldInput', FieldInput);
designerForm.component('FnConfig', FnConfig);
designerForm.component('FcRow', Row);
designerForm.component('CustomAlert', CustomAlert);
addComponent('FcEditor', FcEditor);
addComponent('TableForm', TableForm, TableFormView);
addComponent('FcTable', Table, TableView);

const install = function (Vue) {
    Vue.component('FcDesigner', FcDesigner);
};

FcDesigner.install = install;
FcDesigner.makeOptionsRule = makeOptionsRule;
FcDesigner.formCreate = formCreate;
FcDesigner.designerForm = designerForm;
FcDesigner.component = addComponent;
FcDesigner.useLocale = globalUseLocale;
FcDesigner.t = t;

if (compareVersion('3.1.27', formCreate.version) === 1) {
    console.warn('Please use FormCreate version 3.1.27 or greater, see https://github.com/xaboy/form-create.');
}

export default FcDesigner;

export {formCreate, designerForm, install};
