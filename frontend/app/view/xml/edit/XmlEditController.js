Ext.define('yasmine.view.xml.edit.XmlEditController', {
    extend: 'Ext.app.ViewController',
    id: 'xmlEdit-controller', // Required for event listening
    alias: 'controller.xml-edit',

    onSaveClick: function () {
        var model = this.getViewModel().get('model');
        if (!model.isValid()) {
            return;
        }

        var that = this;
        if (model.crudState === 'C') {
            model.set('id', -1);
        };
        model.save({
            success: function(record) {
                that.fireEvent('xmlSaved');
                that.closeView();
                that.redirectTo(`xml-builder/${record.id}`);                
            }
        });
    },

    onCancelClick: function() {
        this.closeView();
    }

});
