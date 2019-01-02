Ext.define('imct.view.xml.builder.tree.edit.TreeEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tree-edit',
    id: 'tree-edit-controller', // Required for event listening
    onSaveClick: function() {
        var model = this.getViewModel().get('model');
        this.makeCreateRequest({
            code: model.get('code'),
            parentId: (model.get('parentId') == 0) ? null : model.get('parentId'),
            nodeType: model.get('nodeType')
        });
    },
    onCancelClick: function() {
        this.getView().close();
    },
    makeCreateRequest: function (data) {
        var xmlId = this.getViewModel().get('xmlId');
        var me = this;
        Ext.Ajax.request({
            url: `/api/xml/tree/${xmlId}/${(data.parentId) ? data.parentId : ''}`,
            jsonData: data,
            method: 'POST',
            success: function (response) { 
                me.fireEvent('nodeCreated');
                me.getView().close();
            }
        });
    }
});
