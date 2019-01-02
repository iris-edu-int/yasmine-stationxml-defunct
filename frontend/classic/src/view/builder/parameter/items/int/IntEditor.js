Ext.define('imct.view.xml.builder.parameter.items.int.IntEditor', {
    extend: 'Ext.form.field.Number',
    xtype: 'imct-int-field',
    requires: ['imct.view.xml.builder.parameter.items.int.IntEditorModel','imct.view.xml.builder.parameter.items.int.IntEditorController'],
    viewModel: 'int-editor',
    controller: 'int-editor',
    allowDecimals: false,
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }    
});
