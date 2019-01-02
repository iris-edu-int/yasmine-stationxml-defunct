Ext.define('imct.view.xml.builder.parameter.components.person.PersonEditModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.person-edit',
    data: {
        selectedNameRow: null,
        selectedAgencyRow: null,
        selectedEmailRow: null,
        selectedPhoneRow: null,
        
        person: null
    },
    stores: {
        nameStore: {
            model: 'imct.view.xml.builder.parameter.components.person.Name',
            data: []
        },
        agencyStore: {
            model: 'imct.view.xml.builder.parameter.components.person.Agency',
            data: []
        },
        emailStore: {
            model: 'imct.view.xml.builder.parameter.components.person.Email',
            data: []
        },
        phoneStore: {
            model: 'imct.view.xml.builder.parameter.components.person.Phone',
            data: []
        }
    }
});

Ext.define('imct.view.xml.builder.parameter.components.person.Name', {
    extend: 'Ext.data.Model',
    fields: [
        { name: '_name', type: 'string' }
    ]
});

Ext.define('imct.view.xml.builder.parameter.components.person.Agency', {
    extend: 'Ext.data.Model',
    fields: [
        { name: '_name', type: 'string' }
    ]
});

Ext.define('imct.view.xml.builder.parameter.components.person.Email', {
    extend: 'Ext.data.Model',
    fields: [
        { name: '_email', type: 'string' }
    ]
});

Ext.define('imct.view.xml.builder.parameter.components.person.Phone', {
    extend: 'Ext.data.Model',
    fields: [
        { name: '_country_code', type: 'int' },
        { name: '_area_code', type: 'int' },
        { name: '_phone_number', type: 'string' },
        { name: '_description', type: 'string' }
    ]
});
