Ext.define('imct.view.xml.builder.parameter.items.externalreferences.ExternalReferencesEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'imct-external-references-field',
    requires: ['imct.view.xml.builder.parameter.items.externalreferences.ExternalReferencesEditorModel',
        'imct.view.xml.builder.parameter.items.externalreferences.ExternalReferencesEditorController'],
    viewModel: 'external-references-editor',
    controller: 'external-references-editor',
    border: true,
    items: [{
        bind: {
            html: '{validationErrors}',
            hidden: '{!canShowValidationError}'
        },
        hidden: true,
        width: '100%',
        padding: '5 8 5 8'
    },{
        xtype: 'grid',
        reference: 'referencegrid',
        width: 700,
        height: 400,
        plugins: [{
            ptype: 'rowediting',
            clicksToMoveEditor: 1
        }],
        selModel: 'rowmodel',
        bind: {
            store: '{dataStore}',
            selection: '{theRow}'
        },
        columns: [{
            header: 'Uri',
            dataIndex: 'uri',
            width: 250,
            editor: 'textfield'
        },{
            header: 'Description',
            dataIndex: 'description',
            flex: 1,
            editor: 'textfield'
        }],
        tbar: [{
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            tooltip: 'Create',
            handler: 'onAddClick'
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-minus',
            tooltip: 'Delete',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!theRow}'
            }
        }]
    }]
});
