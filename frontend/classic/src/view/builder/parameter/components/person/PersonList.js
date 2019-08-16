Ext.define('yasmine.view.xml.builder.parameter.components.person.PersonList', {
    extend: 'Ext.grid.Panel',
    xtype: 'person-list',
    requires: [
        'yasmine.view.xml.builder.parameter.components.person.PersonListModel',
        'yasmine.view.xml.builder.parameter.components.person.PersonListController'
    ],
    viewModel: 'person-list',
    controller: 'person-list',
    bind: {
        store: '{personStore}',
        selection: '{selectedRow}'
    },
    style: 'border: solid #d0d0d0 1px',
    columns: [
        {
            text: 'Names',
            dataIndex: '_names',
            renderer: function (value) {
                if (value.length > 0) {
                    return value.map(function (item) { return item._name }).join('; ');
                }

                return yasmine.Globals.NotApplicable;
            },
            flex: 1
        },
        {
            text: 'Emails',
            dataIndex: '_emails',
            renderer: function (value) {
                if (value.length > 0) {
                    return value.map(function (item) { return item._email }).join('; ');
                }

                return yasmine.Globals.NotApplicable;
            },
            flex: 1
        },
        {
            text: 'Agencies',
            dataIndex: '_agencies',
            renderer: function (value) {
                if (value.length > 0) {
                    return value.map(function (item) { return item._name }).join('; ');
                }

                return yasmine.Globals.NotApplicable;
            },
            flex: 1
        }
    ],
    listeners: {
        itemdblclick: 'onEditClick'
    },
    tbar: [
        {
            bind: {
                tooltip: 'Add Person'
            },
            iconCls: 'x-fa fa-plus',
            handler: 'onAddClick'
        },
        {
            bind: {
                tooltip: 'Delete Person'
            },
            iconCls: 'x-fa fa-minus',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!selectedRow}'
            }
        }, {
            bind: {
                tooltip: 'Edit Person'
            },
            iconCls: 'x-fa fa-pencil',
            handler: 'onEditClick',
            disabled: true,
            bind: {
                disabled: '{!selectedRow}'
            }
        },
        { xtype: 'container', flex: 1 },
        { xtype: 'label', html: 'PERSONS' },
        { xtype: 'container', flex: 1 }
    ]
});
