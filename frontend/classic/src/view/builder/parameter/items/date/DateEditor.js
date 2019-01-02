Ext.define('imct.view.xml.builder.parameter.items.date.DateEditor', {
    extend: 'Ext.form.field.Date',
    xtype: 'imct-date-field',
    requires: ['imct.view.xml.builder.parameter.items.date.DateEditorModel',
            'imct.view.xml.builder.parameter.items.date.DateEditorController',
            'imct.utils.DateUtil'],
    viewModel: 'date-editor',
    controller: 'date-editor',
    format: IMCT.Globals.DatePrintLongFormat,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }   
});
