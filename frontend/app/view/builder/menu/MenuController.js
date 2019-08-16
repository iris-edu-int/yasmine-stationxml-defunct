Ext.define('yasmine.view.xml.builder.menu.MenuController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.menu',
    onExportXmlClick: function() {
        yasmine.store.FileLoader.load(`api/xml/ie/${this.getViewModel().get('xmlId')}`);
    },
    onValidateXmlClick: function() {
        Ext.Ajax.request({
            url: `/api/xml/validate/${this.getViewModel().get('xmlId')}`,
            method: 'GET',
            success: function (response) { 
                var errors = JSON.parse(response.responseText);
                if (errors && errors.length > 0) {
                    Ext.Msg.alert('Validation Errors', errors.join('<br>'), Ext.emptyFn);
                } else {
                    Ext.Msg.alert('Validation Errors', 'No Errors', Ext.emptyFn);
                }
            }
        });
    }
});
