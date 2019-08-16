Ext.define("yasmine.utils.NodeTypeConverter", {
    singleton: true,
    toIcon: function (nodeType) {
        var icons = new Map();
        icons.set(yasmine.NodeTypeEnum.network, "x-fa fa-connectdevelop");
        icons.set(yasmine.NodeTypeEnum.station, "x-fa fa-building-o");
        icons.set(yasmine.NodeTypeEnum.channel, "x-fa fa-rss");
        
        return icons.has(nodeType) ? icons.get(nodeType) : "x-fa fa-history";
    },
    toString: function (nodeType) {
        var strings = new Map();
        strings.set(yasmine.NodeTypeEnum.network, "Network");
        strings.set(yasmine.NodeTypeEnum.station, "Station");
        strings.set(yasmine.NodeTypeEnum.channel, "Channel");

        return strings.has(nodeType) ? strings.get(nodeType) : yasmine.Globals.NotApplicable;
    },
    getChild: function (parentNodeType) {
        if (parentNodeType === yasmine.NodeTypeEnum.network) {
            return yasmine.NodeTypeEnum.station
        } else if (parentNodeType === yasmine.NodeTypeEnum.station) {
            return yasmine.NodeTypeEnum.channel
        }

        return null;
    }
});
