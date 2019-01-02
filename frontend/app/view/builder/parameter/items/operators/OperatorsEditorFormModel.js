Ext.define('imct.view.xml.builder.parameter.items.operators.OperatorsEditorFormModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.operators-editor-form',
    data: {
        record: null,
        website: null,
        selectedAgencyRow: null
    },
    stores: {
        agencyStore: {
            model: 'imct.view.xml.builder.parameter.items.operators.Agency',
            data: []
        }
    }
});

Ext.define('imct.view.xml.builder.parameter.items.operators.Agency', {
    extend: 'Ext.data.Model',
    fields: [
        { name: '_name', type: 'string' }
    ]
});
