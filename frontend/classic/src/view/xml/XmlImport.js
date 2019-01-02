Ext.define('imct.view.xml.XmlImport', {
    extend: 'Ext.window.Window',
    xtype: 'xml-import',
    requires: [
        'Ext.form.Panel',
        'imct.view.xml.import.XmlImportController'
    ],
    controller: 'xml-import',
    title: 'Import XML',
    modal: true,
    frame: true,
    defaultFocus : 'name',
    items: {
        xtype: 'form',
        reference: 'importForm',
        bodyPadding: 10,
        defaults: {
            anchor: '100%',
            labelWidth: 50
        },
        items: [{
            xtype: 'textfield',
            itemId: 'name',
            name: 'name',
            fieldLabel: 'Name',
            allowBlank: true
        }, {
            xtype: 'filefield',
            emptyText: 'Import an XML',
            fieldLabel: 'XML',
            name: 'xml-path',
            allowBlank: false,
            buttonText: '',
            buttonConfig: {
                iconCls: 'fa fa-upload'
            }
        }],
        buttons: [{
            text: 'Upload',
            handler: 'onImportClick'
        }, {
            text: 'Cancel',
            handler: 'onCancelClick'
        }]
    }
});
