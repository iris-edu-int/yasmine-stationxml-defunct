Ext.define("imct.view.xml.builder.parameter.items.channelresponse.ChannelResponsePreview", {
    xtype: 'imct-channel-response-field-preview',
    getPreview: function (value){
        if (!value) {
            return null;
        }
        return value;
    }
});
