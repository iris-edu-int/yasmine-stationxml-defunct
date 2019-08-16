Ext.define('yasmine.view.xml.list.XmlListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.xml-list',
    requires: [
        'yasmine.view.xml.XmlEdit',
        'yasmine.view.xml.XmlImport',
        'yasmine.model.Xml'
    ],
    listen: {
        controller: {
            '#xmlEdit-controller': {
                xmlSaved: 'onXmlSaved'
            },
            '#xmlImport-controller': {
                xmlImported: 'onXmlImported'
            }
        }
    },
    onCreateXmlClick: function () {
        var form = Ext.create({ xtype: 'xml-edit' });
        var record = new yasmine.model.Xml();
        record.set('source', yasmine.Globals.Settings.general__source);
        record.set('module', yasmine.Globals.Settings.general__module);
        record.set('uri', yasmine.Globals.Settings.general__uri);
        
        form.getViewModel().set('model', record);
        form.show();
    },
    onEditXmlClick: function() {
        var form = Ext.create({ xtype: 'xml-edit' });
        form.getViewModel().set('model', yasmine.model.Xml.load(this.getSelectedRecord().id));
        form.show();
    },
    onDeleteXmlClick: function() {
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete record?', function(btn) {
            if (btn === 'yes') {
                this.deleteSelectedXml();
            }
        }, this);
    },
    onBuildXmlClick: function() {
        this.redirectTo(`xml-builder/${this.getSelectedRecord().id}`);
    },
    deleteSelectedXml: function() {
        this.getView().getStore().remove(this.getSelectedRecord());
    },
    onImportXmlClick: function() {
        var form = Ext.create({ xtype: 'xml-import' });
        form.show();
    },
    onExportXmlClick: function() {
        yasmine.store.FileLoader.load(`api/xml/ie/${this.getSelectedRecord().id}`);
    },
    onXmlSaved: function() {
        this.reloadData();
    },
    onXmlImported: function() {
        this.reloadData();
    },
    getSelectedRecord: function() {
        return this.getView().getSelection()[0];
    },
    reloadData: function() {
        this.getView().getStore().reload();
    } 
});


