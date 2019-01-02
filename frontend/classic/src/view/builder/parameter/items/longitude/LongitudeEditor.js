Ext.define('imct.view.xml.builder.parameter.items.longitude.LongitudeEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'imct-longitude-field',
    requires: ['imct.view.xml.builder.parameter.items.longitude.LongitudeEditorController',
        'imct.view.xml.builder.parameter.items.longitude.LongitudeEditorModel'],
    viewModel: 'longitude-editor',
    controller: 'longitude-editor',
    decimalPrecision: 6,
    maxLength: 10,
    allowDecimals: true,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }    
});
