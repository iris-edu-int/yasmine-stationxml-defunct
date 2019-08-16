Ext.define('yasmine.view.xml.builder.parameter.items.unrecognized.UnrecognizedPreview', {
    xtype: 'unrecognized-preview',
    getPreview: function(value) {
        return '<b style="color: red;">There is no preview component for this property!</b>';
    }
});
