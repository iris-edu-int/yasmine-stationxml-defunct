Ext.define("imct.view.xml.builder.parameter.items.channeltypes.ChannelTypesPreview", {
    xtype: 'imct-channel-types-field-preview',
    getPreview: function (value){
        if (!value) {
            return null;
        }
        return value.join('; ');
    }
});
