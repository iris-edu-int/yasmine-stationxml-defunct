Ext.define('yasmine.view.xml.builder.parameter.items.channeltypes.ChannelTypesEditorModel', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.channel-types-editor',
    data: {
        channelTypeSelectedRow: null
    },
    stores: {
        channelTypeStore: {
            model: 'yasmine.view.xml.builder.parameter.items.channeltypes.ChannelType',
            data: []
        }
    }
});

Ext.define('yasmine.view.xml.builder.parameter.items.channeltypes.ChannelType', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'value', type: 'string' }
    ]
});
