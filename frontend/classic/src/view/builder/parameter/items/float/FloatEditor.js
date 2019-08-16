Ext.define('yasmine.view.xml.builder.parameter.items.float.FloatEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'yasmine-float-field',
    requires: ['yasmine.view.xml.builder.parameter.items.float.FloatEditorController','yasmine.view.xml.builder.parameter.items.float.FloatEditorModel'],
    viewModel: 'float-editor',
    controller: 'float-editor',
    allowDecimals: true,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }    
});
