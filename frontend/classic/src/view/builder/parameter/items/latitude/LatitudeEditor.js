Ext.define('yasmine.view.xml.builder.parameter.items.latitude.LatitudeEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'yasmine-latitude-field',
    requires: ['yasmine.view.xml.builder.parameter.items.latitude.LatitudeEditorController','yasmine.view.xml.builder.parameter.items.latitude.LatitudeEditorModel'],
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
