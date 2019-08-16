Ext.define('yasmine.view.xml.builder.parameter.items.operators.OperatorsEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'yasmine-operators-field',
    requires: [
        'yasmine.view.xml.builder.parameter.items.operators.OperatorsEditorModel',
        'yasmine.view.xml.builder.parameter.items.operators.OperatorsEditorController'
    ],
    viewModel: 'operators-editor',
    controller: 'operators-editor',
    items: [
        {
            bind: { 
                html: '{validationErrors}',
                hidden: '{!canShowValidationError}'
            },
            hidden: true,
            width: '100%',
            padding: '5 8 5 8'
        },
        {
            xtype: 'grid',
            width: 800,
            height: 400,
            style: 'border: solid #d0d0d0 1px',
            bind: {
                store: '{operatorStore}',
                selection: '{selectedOperatorRow}'
            },
            columns: [
                {
                    header: 'Agencies',
                    dataIndex: 'agencies',
                    flex: 1,
                    renderer: function (value) {
                        if (!value || value.length === 0) {
                            return yasmine.Globals.NotApplicable;
                        }

                        return value.map(function (item) { return item }).join('; ');
                    }
                },
                {
                    header: 'Contacts',
                    dataIndex: 'contacts',
                    flex: 1,
                    renderer: function (value) {
                        if (!value || value.length === 0) {
                            return yasmine.Globals.NotApplicable;
                        }

                        var result = [];
                        value.forEach(function(person){
                            if (person._names && person._names.length > 0) {
                                result = result.concat(person._names);
                            }
                            if (person._agencies && person._agencies.length > 0) {
                                result = result.concat(person._agencies);
                            }
                            if (person._emails && person._emails.length > 0) {
                                result = result.concat(person._emails);
                            }
                        });

                        return result.join('; ');
                    }
                },
                {
                    header: 'Website',
                    dataIndex: 'website',
                    flex: 1
                }
            ],
            listeners: {
                itemdblclick: 'onEditClick'
            },
            tbar: [{
                iconCls: 'x-fa fa-plus',
                tooltip: 'Add Operator',
                handler: 'onAddClick'
            }, {
                iconCls: 'x-fa fa-minus',
                tooltip: 'Delete Operator',
                handler: 'onDeleteClick',
                disabled: true,
                bind: {
                    disabled: '{!selectedOperatorRow}'
                }
            }, {
                iconCls: 'x-fa fa-pencil',
                tooltip: 'Edit Operator',
                handler: 'onEditClick',
                disabled: true,
                bind: {
                    disabled: '{!selectedOperatorRow}'
                }
            }]
        }
    ]
});
