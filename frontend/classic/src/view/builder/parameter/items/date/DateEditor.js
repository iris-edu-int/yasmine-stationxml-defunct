Ext.define('yasmine.view.xml.builder.parameter.items.date.DateEditor', {
    extend: 'Ext.form.field.Date',
    xtype: 'yasmine-date-field',
    requires: ['yasmine.view.xml.builder.parameter.items.date.DateEditorModel',
            'yasmine.view.xml.builder.parameter.items.date.DateEditorController',
            'yasmine.utils.DateUtil'],
    viewModel: 'date-editor',
    controller: 'date-editor',
    format: yasmine.Globals.DatePrintLongFormat,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }   
});
