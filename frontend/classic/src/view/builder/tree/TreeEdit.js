Ext.define('imct.view.xml.builder.tree.TreeEdit', {
    extend: 'Ext.window.Window',
    xtype: 'tree-edit',
    requires: [
        'Ext.form.Panel',
        'imct.view.xml.builder.tree.edit.TreeEditController',
        'imct.view.xml.builder.tree.edit.TreeEditModel'
    ],
    controller: 'tree-edit',
    viewModel: 'tree-edit',
    bind: {
        title: '{title}'
    },
    modal: true,
    frame: true,
    defaultFocus: 'code',
    items: {
        xtype: 'form',
        bodyPadding: 10,
        defaultType: 'textfield',
        items: [
            { fieldLabel: 'Code', bind: '{model.code}', itemId: 'code' }
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
    }
});
