Ext.define("yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReferencesPreview", {
    xtype: 'yasmine-external-references-field-preview',
    getPreview: function(value) {
        if (!value || value.length === 0) {
            return null;
        }

        var result = [];
        value.forEach(function(element) {
            result.push(element.uri);
        });
        
        return result.join('; ');
    }
});
