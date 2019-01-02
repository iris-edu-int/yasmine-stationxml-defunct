Ext.define('imct.view.xml.builder.parameter.items.channeltypes.ChannelTypesEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'imct-channel-types-field',
    requires: ['imct.view.xml.builder.parameter.items.channeltypes.ChannelTypesEditorModel',
        'imct.view.xml.builder.parameter.items.channeltypes.ChannelTypesEditorController'],
    viewModel: 'channel-types-editor',
    controller: 'channel-types-editor',
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
        width: 400,
        height: 300,
        reference: 'channeltypegrid',
        plugins: [{
            ptype: 'rowediting',
            clicksToMoveEditor: 1
        }],
        selModel: 'rowmodel',
        bind: {
            store: '{channelTypeStore}',
            selection: '{channelTypeSelectedRow}'
        },
        columns: [{
            header: 'Channel Type',
            dataIndex: 'value',
            flex: 1,
            editor: 'textfield'
        }],
        tbar: [{
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            tooltip: 'Create Channel Type',
            handler: 'onAddClick'
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-minus',
            tooltip: 'Delete Channel Type',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!channelTypeSelectedRow}'
            }
        },{
            iconCls: 'x-fa fa-pencil',
            tooltip: 'Edit Channel Type',
            handler: 'onEditClick',
            disabled: true,
            bind: {
                disabled: '{!channelTypeSelectedRow}'
            }
        }]
    }]
});
