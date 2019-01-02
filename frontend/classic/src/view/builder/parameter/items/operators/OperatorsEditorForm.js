Ext.define('imct.view.xml.builder.parameter.items.operators.OperatorsEditorForm', {
    extend: 'Ext.window.Window',
    xtype: 'operators-editor-form',
    requires: [
        'imct.view.xml.builder.parameter.items.operators.OperatorsEditorFormModel',
        'imct.view.xml.builder.parameter.items.operators.OperatorsEditorFormController'
    ],
    controller: 'operators-editor-form',
    viewModel: 'operators-editor-form',
    title: 'Operators',
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
        items: [
            { 
                flex: 1,
                xtype: 'textfield', 
                itemId: 'focusItem',
                labelAlign: 'top',
                fieldLabel: 'Website',
                bind: '{website}'
            },
            {
                layout: {
                    type: 'accordion'
                },
                margin: '-10 -5 10 -5',
                height: 400,
                items: [
                    {
                        xtype: 'grid',
                        title: 'Agencies',
                        reference: 'operatoragencygrid',
                        margin: '15 0 0 0',
                        flex: 1,
                        plugins: [{
                            ptype: 'rowediting',
                            clicksToMoveEditor: 1
                        }],
                        selModel: 'rowmodel',
                        style: 'border: solid #d0d0d0 1px',
                        bind: {
                            store: '{agencyStore}',
                            selection: '{selectedAgencyRow}'
                        },
                        columns: [{
                            header: 'Name',
                            dataIndex: '_name',
                            flex: 1,
                            editor: 'textfield'
                        }],
                        tbar: [{
                            xtype: 'button',
                            iconCls: 'x-fa fa-plus',
                            tooltip: 'Create Agency',
                            handler: 'onAddAgencyClick'
                        }, {
                            xtype: 'button',
                            iconCls: 'x-fa fa-minus',
                            tooltip: 'Delete Agency',
                            handler: 'onDeleteAgencyClick',
                            disabled: true,
                            bind: {
                                disabled: '{!selectedAgencyRow}'
                            }
                        }, {
                            xtype: 'button',
                            iconCls: 'x-fa fa-pencil',
                            tooltip: 'Edit Agency',
                            handler: 'onEditAgencyClick',
                            disabled: true,
                            bind: {
                                disabled: '{!selectedAgencyRow}'
                            }
                        }]
                    },
                    {
                        xtype: 'person-list',
                        title: 'Contacts',
                        reference: 'operatorcontactgrid',
                        margin: '20 0 0 0',
                        flex: 1
                    }
                ] 
            }
        ],
        buttons: [{
            text: 'Save',
            handler: 'onSaveClick'
        }, {
            text: 'Cancel',
            handler: 'onCancelClick'
        }]
    }
});
