Ext.define("imct.view.xml.builder.parameter.items.date.DatePreview", {
    xtype: 'imct-date-field-preview',
    getPreview: function(value) {
        return Ext.Date.format(value, IMCT.Globals.DatePrintLongFormat);
    }
});
