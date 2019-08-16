Ext.define('yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReferencesEditorModel', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.external-references-editor',
    data: {
        record: null
    },
    stores: {
        dataStore: {
            model: 'yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReference',
            data: []
        }
    }
});
Ext.define('yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReference', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'uri',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    }]
});
