Ext.define("yasmine.view.xml.builder.parameter.items.site.SitePreview", {
    xtype: 'yasmine-site-field-preview',
    getPreview: function(value) {
        var items = [value.name, value.description, value.town, value.county,  value.region, value.country];
        return items.filter(function(x) {return x}).join("; ")
    }
});
