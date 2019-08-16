Ext.define('yasmine.view.xml.builder.parameter.items.comments.CommentsEditorForm', {
    extend: 'Ext.window.Window',
    xtype: 'comments-editor-form',
    requires: ['yasmine.view.xml.builder.parameter.items.comments.CommentsEditorFormModel',
        'yasmine.view.xml.builder.parameter.items.comments.CommentsEditorFormController'],
    controller: 'comments-editor-form',
    viewModel: 'comments-editor-form',
    title: 'Comment',
    modal: true,
    frame: true,
    width: 600,
    bodyPadding: 10,
    items: {
        xtype: 'form',
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        items: [{
            flex: 1,
            xtype: 'textareafield',
            itemId: 'focusItem',
            labelAlign: 'top',
            fieldLabel: 'Comment',
            bind: '{value}'
        },{
            xtype: 'numberfield',
            labelAlign: 'top',
            fieldLabel: 'ID',
            minValue: 0,
            bind: '{id}'
        },{
            layout: 'hbox',
            items: [{
                xtype: 'datefield',
                flex: 1,
                labelAlign: 'top',
                padding: '0 5 0 0',
                format: yasmine.Globals.DatePrintLongFormat,
                fieldLabel: 'Effective Start Date',
                bind: '{beginEffectiveTime}',
                allowBlank: false
            },{
                xtype: 'datefield',
                flex: 1,
                labelAlign: 'top',
                padding: '0 0 0 5',
                format: yasmine.Globals.DatePrintLongFormat,
                fieldLabel: 'Effective End Date',
                bind: '{endEffectiveTime}',
                allowBlank: false
            }]
        },{
            xtype: 'person-list',
            margin: '20 0 10 0',
            height: 300,
            flex: 1,
            reference: 'person-list'
        }],
        buttons: [{
            text: 'Save',
            handler: 'onSaveClick'
        },{
            text: 'Cancel',
            handler: 'onCancelClick'
        }]
    }
});
