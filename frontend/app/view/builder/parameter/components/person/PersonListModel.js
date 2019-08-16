Ext.define('yasmine.view.xml.builder.parameter.components.person.PersonListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.person-list',
    data: {

    },
    stores: {
        personStore: {
            model: 'yasmine.view.xml.builder.parameter.components.person.Person',
            data: []
        }
    }
});

Ext.define('yasmine.view.xml.builder.parameter.components.person.Person', {
    extend: 'Ext.data.Model',
    fields: [
        { name: '_names' },
        { name: '_agencies' },
        { name: '_emails' },
        { name: '_phones' }
    ]
});
