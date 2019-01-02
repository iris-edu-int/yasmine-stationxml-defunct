Ext.define('imct.view.xml.list.XmlListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.xml-list',
    stores: {
        listStore: {
            model: 'imct.model.Xml',
            autoLoad: false,
            remoteFilter: true,
            remoteSort: true,
            autoSync: true
        }
    }
});
