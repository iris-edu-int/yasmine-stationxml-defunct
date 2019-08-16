Ext.define('yasmine.view.xml.builder.parameter.items.int.IntEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'yasmine-int-field',
    requires: ['yasmine.view.xml.builder.parameter.items.int.IntEditorModel','yasmine.view.xml.builder.parameter.items.int.IntEditorController'],
    viewModel: 'int-editor',
    controller: 'int-editor',
    allowDecimals: false,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }    
});
