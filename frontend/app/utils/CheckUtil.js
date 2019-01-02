Ext.define("imct.utils.CheckUtil", {
    singleton: true,
    isEmpty: function (value) {
        if (value === '' || value == null || value == undefined) {
            return true;
        }

        if ((typeof value === 'string' || value instanceof String) && value.trim() == '') {
            return true;
        }

        return false;
    }
});
