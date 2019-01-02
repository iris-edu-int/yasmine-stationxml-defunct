Ext.define('imct.view.xml.builder.parameter.ParameterItemEditorController', {
    extend: 'Ext.app.ViewController',
    validate: function (){
        var record = this.getViewModel().get('record');
        var result = this.serverSideValidation(record.get('value'));
        this.getViewModel().set('validation.activeErrors', result.message);
        return result.success;
    },
    lastValidatedValue: undefined,
    lastValidatedResult: undefined,
    validator: function (value){
        var result = this.serverSideValidation(value);
        if (result.success) {
            return true
        } else {
            return result.message[0]
        }
    },
    serverSideValidation: function (value){
        if (value !== this.lastValidatedValue) {         
            var record = this.getViewModel().get('record');
            var only_critical = record.get('only_critical');
            this.lastValidatedValue = value;
            this.lastValidatedResult = imct.utils.ValidatorUtil.validate(record.get('node_id'), record.get('name'), value, record.get('only_critical'));
        }
        return this.lastValidatedResult;
    }
});
