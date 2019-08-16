Ext.define('yasmine.view.xml.XmlEdit', {
    extend: 'Ext.window.Window',
    xtype: 'xml-edit',
    requires: [
        'Ext.form.Panel',
        'yasmine.view.xml.edit.XmlEditController',
        'yasmine.view.xml.edit.XmlEditModel',
        'Ext.form.field.VTypes',
        'Ext.data.validator.Presence'
    ],
    controller: 'xml-edit',
    viewModel: 'xml-edit',
    bind: {
        title: '{title}'
    },
    modal: true,
    frame: true,
    defaultFocus: 'name',
    items: {
        xtype: 'form',
        bodyPadding: 10,
        modelValidation: true,
        defaultType: 'textfield',
        items: [
            { fieldLabel: 'Name', bind: '{model.name}', name: 'name' },
            { fieldLabel: 'Source', bind: '{model.source}', name: 'source'  },
            { fieldLabel: 'Module', bind: '{model.module}', name: 'module' },
            { fieldLabel: 'Uri', bind: '{model.uri}', vtype: 'url', name: 'url' },
            { fieldLabel: 'Sender', bind: '{model.sender}', name: 'sender' }
        ],
        buttons: [{
            text: 'Save',
            disabled: true,
            formBind: true,
            handler: 'onSaveClick'
        }, {
            text: 'Cancel',
            handler: 'onCancelClick'
        }]
    },
    tools:[
        {
            type:'help',
            handler: function() { yasmine.utils.HelpUtil.helpMe('xml_edit', 'Edit XML') }
        }
    ]
});
