Ext.define("imct.utils.NodeTypeConverter", {
    singleton: true,
    toIcon: function (nodeType) {
        var icons = new Map();
        icons.set(imct.NodeTypeEnum.network, "x-fa fa-connectdevelop");
        icons.set(imct.NodeTypeEnum.station, "x-fa fa-building-o");
        icons.set(imct.NodeTypeEnum.channel, "x-fa fa-rss");
        
        return icons.has(nodeType) ? icons.get(nodeType) : "x-fa fa-history";
    },
    toString: function (nodeType) {
        var strings = new Map();
        strings.set(imct.NodeTypeEnum.network, "Network");
        strings.set(imct.NodeTypeEnum.station, "Station");
        strings.set(imct.NodeTypeEnum.channel, "Channel");

        return strings.has(nodeType) ? strings.get(nodeType) : IMCT.Globals.NotApplicable;
    },
    getChild: function (parentNodeType) {
        if (parentNodeType === imct.NodeTypeEnum.network) {
            return imct.NodeTypeEnum.station
        } else if (parentNodeType === imct.NodeTypeEnum.station) {
            return imct.NodeTypeEnum.channel
        }

        return null;
    }
});
