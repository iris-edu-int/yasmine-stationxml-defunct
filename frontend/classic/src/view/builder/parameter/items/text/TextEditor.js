Ext.define('imct.view.xml.builder.parameter.items.text.TextEditor', {
    extend: 'Ext.form.field.Text',
    xtype: 'imct-text-field',
    requires: ['imct.view.xml.builder.parameter.items.text.TextEditorModel','imct.view.xml.builder.parameter.items.text.TextEditorController'],
    viewModel: 'text-editor',
    controller: 'text-editor',
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }
});
