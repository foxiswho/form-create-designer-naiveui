import {localeOptions} from '../../utils';

export default function form({t}) {
    return [
        {
            type: 'input',
            field: '>formName',
            value: '',
            title: t('form.formName'),
        }, {
            type: 'radio',
            field: 'labelPosition',
            value: 'left',
            title: t('form.labelPosition'),
            options: localeOptions(t, [
                {value: 'left', label: 'left'},
                {value: 'right', label: 'right'},
                {value: 'top', label: 'top'},
            ])
        },
        {
            type: 'radio',
            field: 'requireMarkPlacement',
            value: 'right',
            title: t('form.placementRequireMark'),
            options: [
                { value: 'left', label: 'left' },
                { value: 'right', label: 'right' },
                { value: 'right-hanging', label: 'right-hanging' },
            ]
        },
        {
            type: 'radio',
            field: 'showRequireMark',
            value: undefined,
            title: t('form.showRequireMark'),
            info: t('form.showRequireMarkInfo'),
            options: [
                { value: false, label: t('form.hideRequireMarkLabel') },
                { value: true, label: t('form.showRequireMarkLabel') },
            ]
        },
        {
            type: 'radio',
            field: 'size',
            value: 'small',
            title: t('form.size'),
            options: localeOptions(t, [
                {value: 'large', label: 'large'},
                { value: 'medium', label: 'medium' },
                {value: 'small', label: 'small'},
                { value: 'tiny', label: 'tiny' },
            ])
        },
        {
            type: 'input',
            field: 'labelSuffix',
            value: '',
            title: t('form.labelSuffix'),
            style: {
                width: '150px'
            }
        }, {
            type: 'SizeInput',
            field: 'labelWidth',
            value: '125px',
            title: t('form.labelWidth'),
        },
        {
            type: 'switch',
            field: 'formCreateSubmitBtn',
            value: true,
            title: t('form.submitBtn'),
            props: {
                size: 'small',
            }
        },
        {
            type: 'switch',
            field: 'formCreateResetBtn',
            value: false,
            title: t('form.resetBtn'),
            props: {
                size: 'small',
            }
        },
        {
            type: 'switch',
            field: 'hideRequiredAsterisk',
            value: false,
            title: t('form.hideRequiredAsterisk'),
        }, {
            type: 'switch',
            field: 'showMessage',
            value: true,
            title: t('form.showMessage'),
        }, {
            type: 'switch',
            field: 'inlineMessage',
            value: false,
            title: t('form.inlineMessage'),
        }, {
            type: 'switch',
            field: '_submitBtn>show',
            value: true,
            title: t('form.submitBtn'),
        }, {
            type: 'switch',
            field: '_resetBtn>show',
            value: false,
            title: t('form.resetBtn'),
        }, {
            type: 'FnConfig',
            field: '>_event',
            info: {
                type: 'tooltip',
                native: true,
                effect: 'light',
                align: 'left',
                content: t('form.document') + '：<a target="_blank" href="https://form-create.com/v3/guide/global-event">https://form-create.com/v3/guide/global-event</a>',
                rawContent: true,
            },
            value: {},
            col: {show: true},
            props: {
                eventConfig: [
                    {
                        name: 'onSubmit',
                        args: ['formData', 'api'],
                    },
                    {
                        name: 'onCreated',
                        args: ['api'],
                    },
                    {
                        name: 'onMounted',
                        args: ['api'],
                    },
                    {
                        name: 'onChange',
                        args: ['field', 'value', 'options'],
                    },
                    {
                        name: 'beforeFetch',
                        args: ['config', 'data'],
                    },
                ]
            },
            title: t('form.event'),
        },
    ];
}
