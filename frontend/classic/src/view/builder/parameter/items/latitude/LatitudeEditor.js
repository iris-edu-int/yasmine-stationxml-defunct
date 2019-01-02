Ext.define('imct.view.xml.builder.parameter.items.latitude.LatitudeEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'imct-latitude-field',
    requires: ['imct.view.xml.builder.parameter.items.latitude.LatitudeEditorController','imct.view.xml.builder.parameter.items.latitude.LatitudeEditorModel'],
    viewModel: 'latitude-editor',
    controller: 'latitude-editor',
    decimalPrecision: 6,     
    maxLength: 10,
    allowDecimals: true,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }    
});
