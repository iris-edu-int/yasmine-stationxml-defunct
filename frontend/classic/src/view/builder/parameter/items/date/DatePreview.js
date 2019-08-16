Ext.define("yasmine.view.xml.builder.parameter.items.date.DatePreview", {
    xtype: 'yasmine-date-field-preview',
    getPreview: function(value) {
        return Ext.Date.format(value, yasmine.Globals.DatePrintLongFormat);
    }
});
