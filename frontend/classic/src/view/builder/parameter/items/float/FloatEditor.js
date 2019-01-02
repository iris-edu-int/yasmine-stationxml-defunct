Ext.define('imct.view.xml.builder.parameter.items.float.FloatEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'imct-float-field',
    requires: ['imct.view.xml.builder.parameter.items.float.FloatEditorController','imct.view.xml.builder.parameter.items.float.FloatEditorModel'],
    viewModel: 'float-editor',
    controller: 'float-editor',
    allowDecimals: true,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }    
});
