Ext.define('imct.view.xml.builder.parameter.items.channeltypes.ChannelTypesEditorModel', {
    extend: 'imct.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.channel-types-editor',
    data: {
        channelTypeSelectedRow: null
    },
    stores: {
        channelTypeStore: {
            model: 'imct.view.xml.builder.parameter.items.channeltypes.ChannelType',
            data: []
        }
    }
});

Ext.define('imct.view.xml.builder.parameter.items.channeltypes.ChannelType', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'value', type: 'string' }
    ]
});
