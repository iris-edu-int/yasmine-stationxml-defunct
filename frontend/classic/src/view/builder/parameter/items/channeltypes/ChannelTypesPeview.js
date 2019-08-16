Ext.define("yasmine.view.xml.builder.parameter.items.channeltypes.ChannelTypesPreview", {
    xtype: 'yasmine-channel-types-field-preview',
    getPreview: function (value){
        if (!value) {
            return null;
        }
        return value.join('; ');
    }
});
