Ext.define("yasmine.view.xml.builder.parameter.items.channelresponse.ChannelResponsePreview", {
    xtype: 'yasmine-channel-response-field-preview',
    getPreview: function (value){
        if (!value) {
            return null;
        }
        return value;
    }
});
