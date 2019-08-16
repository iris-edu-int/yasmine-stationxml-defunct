Ext.define('yasmine.view.xml.builder.parameter.items.text.TextEditor', {
    extend: 'Ext.form.field.Text',
    xtype: 'yasmine-text-field',
    requires: ['yasmine.view.xml.builder.parameter.items.text.TextEditorModel','yasmine.view.xml.builder.parameter.items.text.TextEditorController'],
    viewModel: 'text-editor',
    controller: 'text-editor',
    validateOnBlur: true,
    validateOnChange: true,
    validator: function(value){
        return this.getController().validator(this.getValue())
    }
});
