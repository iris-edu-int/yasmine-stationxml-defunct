Ext.define('imct.view.xml.builder.parameter.items.externalreferences.ExternalReferencesEditorModel', {
    extend: 'imct.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.external-references-editor',
    data: {
        record: null
    },
    stores: {
        dataStore: {
            model: 'imct.view.xml.builder.parameter.items.externalreferences.ExternalReference',
            data: []
        }
    }
});
Ext.define('imct.view.xml.builder.parameter.items.externalreferences.ExternalReference', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'uri',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    }]
});
