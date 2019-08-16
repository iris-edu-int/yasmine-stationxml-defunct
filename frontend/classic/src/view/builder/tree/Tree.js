Ext.define('yasmine.view.xml.builder.tree.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.tree',
    title: 'Inventory',
    width: 350,
    requires: [
        'yasmine.view.xml.builder.tree.TreeModel',
        'yasmine.view.xml.builder.tree.TreeController'
    ],
    rootVisible: true,
    useArrows: true,
    viewModel: 'tree',
    controller: 'tree',
    viewConfig: {
        loadMask: false
    },
    bind: {
        store: '{treeStore}',
        selection: '{current.item}'
    },
    listeners: {
        select: 'onTreeNodeSelect',
        beforeselect: 'onBeforeSelect'
    },
    tbar: [
        {
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            tooltip: 'Create',
            handler: 'onAddClick',
            bind: {
                disabled: '{!canCreate}'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-minus',
            tooltip: 'Delete',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!canDelete}'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-clock-o',
            tooltip: 'Epoch',
            handler: 'onEpochClick',
            disabled: true,
            bind: {
                disabled: '{!canEpoch}'
            }
        },
        {
            xtype: 'combobox',
            width: 205,
            bind: {
                store: '{dateStore}',
                selection: '{current.epoch}'
            },
            displayField: 'dateString',
            fieldLabel: 'Epoch',
            editable: false,
            labelWidth: 40,
            queryMode: 'local'
        }
    ]
});
