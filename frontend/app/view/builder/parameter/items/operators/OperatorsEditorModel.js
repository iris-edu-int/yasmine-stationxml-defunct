Ext.define('imct.view.xml.builder.parameter.items.operators.OperatorsEditorModel', {
    extend: 'imct.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.operators-editor',
    data: {
        selectedOperatorRow: null
    },
    stores: {
        operatorStore: {
            model: 'imct.view.xml.builder.parameter.items.operators.Operator',
            data: []
        }
    }
});

Ext.define('imct.view.xml.builder.parameter.items.operators.Operator', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'website' },
        { name: 'agencies' },
        { name: 'contacts' }
    ]
});
