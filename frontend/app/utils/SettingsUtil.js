Ext.define("imct.utils.SettingsUtil", {
    singleton : true,
    applySettings : function(record) {
        IMCT.Globals.DatePrintLongFormat = record.get('general__date_format_long');
        IMCT.Globals.DatePrintShortFormat = record.get('general__date_format_short');
        IMCT.Globals.Settings = record.getData();
    }
});
