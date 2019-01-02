Ext.define("imct.view.xml.builder.parameter.items.operators.OperatorsPreview", {
    xtype: 'imct-operators-field-preview',
    getPreview: function(value) {
        if (!value || value.length === 0) {
            return null;
        }

        var operators = [];
        value.forEach(function(element) {
            operators = operators.concat(element._agencies);
        });
        
        return operators.join('; ');
    }
});
