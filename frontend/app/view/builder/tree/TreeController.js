Ext.define('yasmine.view.xml.builder.tree.TreeController', {
    extend: 'Ext.app.ViewController',
    id: 'tree-controller', // Required for event listening
    alias: 'controller.tree',
    requires: [
        'yasmine.view.xml.builder.tree.TreeEdit'
    ],
    listen: {
        controller: {
            '#tree-edit-controller': {
                nodeCreated: 'onNodeCreated'
            },
            '#children-controller': {
                goToNode: 'onGoToNode'
            }
        }
    },
    onEpochLoaded: function(cmp, data) {
        if (data.length > 0) {
            this.getViewModel().set('current.epoch', data[0]);
        }
    },
    onEpochClick: function() {
        var xmlId = this.getViewModel().get('xmlId');
        var nodeId = this.getViewModel().get('current.item').get('id');
        var me = this;
        Ext.Ajax.request({
            url: `/api/xml/epoch/${xmlId}/`,
            params: { node_inst_id: nodeId},
            method: 'POST',
            success: function (response) {
                me.reloadStore();
                me.fireEvent('treeItemDeselected');
            }
        });
    },
    onGoToNode: function(params) {
        var record = this.getStore('treeStore').findNode('id', params.id);
        if (record.expand) {
            record.expand();
        }
        this.getViewModel().set('current.item', record);
    },
    onTreeNodeSelect: function () {
        this.fireEvent('treeItemSelected', this.getSelectedRecord());
    },
    onBeforeSelect: function (panel, record) {
        if (record.get('id') < 0) {
            return false;
        }
        return true;
    },
    onAddClick: function () {
        var nodeType = yasmine.NodeTypeEnum.network;
        var parentId = null;
        var parent = this.getSelectedRecord();
        if (parent && !parent.get('root')) {
            nodeType = yasmine.utils.NodeTypeConverter.getChild(parent.get('nodeType'));
            parentId = parent.get('id');
        }

        var newRecord = new yasmine.model.TreeItem();
        newRecord.set('nodeType', nodeType);
        newRecord.set('parentId', parentId);

        var form = Ext.create({ xtype: 'tree-edit' });
        form.getViewModel().set('xmlId', this.getViewModel().get('xmlId'));
        form.getViewModel().set('model', newRecord);
        form.show();
    },
    onDeleteClick: function () {
        var record = this.getSelectedRecord();
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete '${record.get('name')}'?`, function (btn) {
            if (btn === 'yes') {
                this.deleteRecord(record.get('id'));
            }
        }, this);
    },
    getSelectedRecord: function () {
        return this.getView().getSelection()[0];
    },
    deleteRecord: function (nodeId) {
        var me = this;
        var xmlId = this.getViewModel().get('xmlId');
        Ext.Ajax.request({
            url: `/api/xml/tree/${xmlId}/${nodeId}`,
            method: 'DELETE',
            success: function (response) {
                me.reloadStore();
                me.fireEvent('treeItemDeselected');
            }
        });
    },
    reloadStore: function () {
        this.getViewModel().getStore('treeStore').reload();
    },
    onNodeCreated: function() {
        this.reloadStore();
        if (this.getSelectedRecord()) {
            this.onTreeNodeSelect();
        }
    }
});
