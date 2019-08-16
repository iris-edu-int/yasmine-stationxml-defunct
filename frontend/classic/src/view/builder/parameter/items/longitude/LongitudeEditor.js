Ext.define('yasmine.view.xml.builder.parameter.items.longitude.LongitudeEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'yasmine-longitude-field',
    requires: ['yasmine.view.xml.builder.parameter.items.longitude.LongitudeEditorController',
        'yasmine.view.xml.builder.parameter.items.longitude.LongitudeEditorModel'],
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
