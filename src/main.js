import { createApp } from 'vue';
import formCreate from '@form-create/naive-ui';
import App from './App.vue';
import FcDesigner from './index';
import {
    create,
    NLayout,
    NLayoutContent,
    NLayoutSider,
    NLayoutHeader,
    NButton,
    NPopconfirm,
    NDropdown,
    NSpace,
    NRow,
    NCol,
    NForm,
    NDivider,
    NModal,
    NFormItem,
    NRadio,
    NRadioGroup,
    NInput,
    NSwitch,
    NSelect,
    NInputNumber,
    NPopover,
    NIcon,
    NGrid,
    NGridItem,
    NRadioButton,
    NDataTable,
    NCheckboxGroup,
    NCheckbox,
    NSkeleton,
    NTimePicker,
    NDatePicker,
    NConfigProvider,
    NNotificationProvider,
    NSlider,
    NRate,
    NColorPicker,
    NCascader,
    NUpload,
    NText,
    NTag,
    NP,
    NUploadDragger,
    NTransfer,
    NTree,
    NAlert,
    NTooltip,
    NTabs,
    NTabPane,
    NTab,
    NDialog,
} from 'naive-ui';

const naive = create({
    components: [NLayout, NLayoutContent, NLayoutSider, NLayoutHeader,
        NButton, NPopconfirm, NSpace, NRow, NCol, NForm, NDivider, NModal,
        NFormItem, NRadio, NRadioGroup, NInput, NSwitch, NSelect, NInputNumber,
        NPopover, NIcon, NGrid, NGridItem, NRadioButton, NDataTable, NCheckboxGroup,
        NCheckbox, NSkeleton, NTimePicker, NDatePicker, NConfigProvider, NSlider, NRate,
        NColorPicker, NCascader, NUpload, NText, NP, NUploadDragger, NTransfer, NTree,NNotificationProvider,
        NAlert, NTooltip, NTabs, NTabPane, NTab,NTag,NDialog,NDropdown]
})

const app = createApp(App);
app.use(naive, { size: 'small' });
app.use(formCreate);
app.use(FcDesigner);
app.mount('#app')
