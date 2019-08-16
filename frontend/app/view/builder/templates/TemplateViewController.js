Ext.define('yasmine.view.xml.builder.templates.TemplateViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.template-view',
    id: 'template-view-controller', // Required for event listening
    onCancelClick: function () {
        this.getView().close();
    },
    onSaveClick: function() {
        var model = this.getViewModel().get('selectedItem');
        this.makeCreateRequest({
        	node_inst_id: model.get('id'),
            code: model.get('code'),
            parentId: this.getViewModel().get('parentId') != 0 ? this.getViewModel().get('parentId') : null,
            nodeType: this.getViewModel().get('nodeType')
        });
    },
    onDeleteClick: function () {
        var record = this.getViewModel().get('selectedItem');
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete '${record.get('name')}'?`, function (btn) {
            if (btn === 'yes') {
                this.deleteRecord(record.get('id'));
            }
        }, this);
    },
    deleteRecord: function (nodeId) {
        var me = this;
        Ext.Ajax.request({
            url: `/api/xml/template/${nodeId}/`,
            method: 'DELETE',
            success: function (response) {
                me.getViewModel().getStore('templateStore').reload();
            }
        });
    },
    makeCreateRequest: function (data) {
        var xmlId = this.getViewModel().get('xmlId');
        var me = this;
        Ext.Ajax.request({
            url: `/api/xml/tree/${xmlId}/${(data.parentId) ? data.parentId : ''}`,
            jsonData: data,
            method: 'POST',
            success: function (response) {
                me.fireEvent('nodeCreated', JSON.parse(response.responseText).data);
                me.getView().close();
            }
        });
    }
});
