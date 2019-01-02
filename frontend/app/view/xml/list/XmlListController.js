Ext.define('imct.view.xml.list.XmlListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.xml-list',
    requires: [
        'imct.view.xml.XmlEdit',
        'imct.view.xml.XmlImport',
        'imct.model.Xml'
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
        var record = new imct.model.Xml();
        record.set('source', IMCT.Globals.Settings.general__source);
        record.set('module', IMCT.Globals.Settings.general__module);
        record.set('uri', IMCT.Globals.Settings.general__uri);
        
        form.getViewModel().set('model', record);
        form.show();
    },
    onEditXmlClick: function() {
        var form = Ext.create({ xtype: 'xml-edit' });
        form.getViewModel().set('model', imct.model.Xml.load(this.getSelectedRecord().id));
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
        imct.store.FileLoader.load(`api/xml/ie/${this.getSelectedRecord().id}`);
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


