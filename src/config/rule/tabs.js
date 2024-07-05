import {localeOptions, localeProps} from '../../utils';

const label = '标签页';
const name = 'nTabs';

export default {
    menu: 'layout',
    icon: 'icon-tab',
    label,
    name,
    mask: false,
    event: ['tabClick', 'tabChange', 'tabRemove', 'tabAdd', 'edit'],
    children: 'nTabPane',
    rule() {
        return {
            type: name,
            style: {width: '100%'},
            children: []
        };
    },
    props(_, {t}) {
        return localeProps(t, name + '.props', [{
            type: 'select',
            field: 'type',
            options: [{
                label: 'card',
                value: 'card'
            }, {label: 'bar', value: 'bar'}]
        }, {type: 'switch', field: 'closable'}, {
            type: 'select',
            field: 'placement',
            options: localeOptions(t, [
                {label: 'top', value: 'top'},
                {label: 'right', value: 'right'}, {
                label: 'left',
                value: 'left'
            }])
        }, {type: 'switch', field: 'stretch'}]);
    }
};
