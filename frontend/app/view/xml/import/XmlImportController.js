Ext.define('yasmine.view.xml.import.XmlImportController', {
    extend: 'Ext.app.ViewController',
    id: 'xmlImport-controller',
    alias: 'controller.xml-import',

    onImportClick: function () {
        var form = this.lookupReference('importForm').getForm();

        var that = this;
        if (form.isValid()) {
            form.submit({
                url: 'api/xml/ie/',
                success: function(fp, o) {
                    that.fireEvent('xmlImported');
                    that.closeView();
                }
            });
        }
    },

    onCancelClick: function() {
        this.closeView();
    }

});
