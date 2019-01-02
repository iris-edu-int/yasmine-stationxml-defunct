Ext.define('imct.view.settings.SettingsList', {
    extend: 'Ext.form.Panel',
    xtype: 'settings-list',
    requires: ['imct.view.settings.SettingsListController','imct.view.settings.SettingsListModel'],
    title: 'Settings',
    frame: true,
    scrollable: true,
    controller: 'settings',
    viewModel: 'settings',
    layout: {
        type: 'hbox'
    },
    defaults: {
        margin: 10
    },
    fieldDefaults: {
        labelAlign: 'top',
        msgTarget: 'side',
        allowBlank: false,
        anchor: '100%'
    },
    items: [{
        xtype: 'fieldset',
        title: 'General',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'GUI Date Format (short)',
            name: 'general__date_format_short'
        },{
            xtype: 'textfield',
            fieldLabel: 'GUI Date Format (long)',
            name: 'general__date_format_long'
        },{
            xtype: 'textfield',
            fieldLabel: 'XML Module',
            name: 'general__module'
        },{
            xtype: 'textfield',
            fieldLabel: 'XML Source',
            name: 'general__source'
        },{
            xtype: 'textfield',
            fieldLabel: 'XML URI',
            name: 'general__uri'
        }]
    },{
        xtype: 'fieldset',
        title: 'Network',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Code',
            name: 'network__code'
        },{
            xtype: 'numberfield',
            fieldLabel: 'Number of Stations',
            name: 'network__num_stations'
        },{
            xtype: 'tagfield',
            fieldLabel: 'Required Fields',
            displayField: 'id',
            valueField: 'id',
            bind: {
                store: '{networkDefaultFields}'
            },
            queryMode: 'local',
            stacked: true,
            name: 'network__required_fields'
        }]
    },{
        xtype: 'fieldset',
        title: 'Station',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Code',
            name: 'station__code'
        },{
            xtype: 'numberfield',
            fieldLabel: 'Number of Channels',
            name: 'station__num_channels'
        },{
            xtype: 'checkboxfield',
            boxLabel: 'Spread to Channels',
            inputValue: true,
            uncheckedValue: false,            
            name: 'station__spread_to_channels'
        },{
            xtype: 'tagfield',
            fieldLabel: 'Required Fields',
            displayField: 'id',
            valueField: 'id',
            bind: {
                store: '{stationDefaultFields}'
            },
            queryMode: 'local',
            stacked: true,
            name: 'station__required_fields'
        }]
    },{
        xtype: 'fieldset',
        title: 'Channel',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Code',
            name: 'channel__code'
        },{
            xtype: 'tagfield',
            fieldLabel: 'Required Fields',
            displayField: 'id',
            valueField: 'id',
            bind: {
                store: '{channelDefaultFields}'
            },
            queryMode: 'local',
            stacked: true,
            name: 'channel__required_fields'
        }]
    }],
    buttons: [{
        text: 'Save',
        iconCls: 'x-fa fa-floppy-o',
        handler: 'onSaveClick',
        disabled: true,
        formBind: true
    }],
    tools: [{
        type: 'help',
        handler: function (){
            imct.utils.HelpUtil.helpMe('settings', 'Settings')
        }
    }]
});
