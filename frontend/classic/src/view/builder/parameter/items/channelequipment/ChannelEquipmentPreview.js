Ext.define("yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentPreview", {
    xtype: 'yasmine-channel-equipment-field-preview',
    getPreview: function (value){
        if (!value) {
            return null;
        }
        return value.description;
    }
});
