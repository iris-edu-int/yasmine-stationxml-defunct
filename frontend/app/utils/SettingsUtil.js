Ext.define("yasmine.utils.SettingsUtil", {
    singleton : true,
    applySettings : function(record) {
        yasmine.Globals.DatePrintLongFormat = record.get('general__date_format_long');
        yasmine.Globals.DatePrintShortFormat = record.get('general__date_format_short');
        yasmine.Globals.Settings = record.getData();
    }
});
