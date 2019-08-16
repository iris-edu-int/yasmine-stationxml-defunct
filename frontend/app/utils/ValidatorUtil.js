Ext.define("yasmine.utils.ValidatorUtil", {
    singleton : true,
    validate : function(nodeType, attributeName, value, only_critical) {
        var result;
        Ext.Ajax.request({
            scope: this,
            async: false,
            jsonData: {node_id: nodeType, attr_name: attributeName, value: value, only_critical: only_critical},
            url: `/api/xml/attr/validate/`,
            method: 'POST',
            success: function (response) {
                result = JSON.parse(response.responseText);
            }
        });

        return result;
    }
});
