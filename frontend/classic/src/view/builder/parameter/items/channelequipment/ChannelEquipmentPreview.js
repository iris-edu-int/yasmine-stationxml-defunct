Ext.define("imct.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentPreview", {
    xtype: 'imct-channel-equipment-field-preview',
    getPreview: function (value){
        if (!value) {
            return null;
        }
        return value.description;
    }
});
