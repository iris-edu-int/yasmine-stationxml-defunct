Ext.define('imct.view.xml.builder.children.ChildrenController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.children',
    id: 'children-controller', // Required for event listening
    requires: [
        'Ext.window.Toast',
        'imct.view.xml.builder.templates.TemplateView',
        'imct.view.xml.builder.wizard.WizardCreateChannelView'        
    ],
    listen: {
        store: {
            '#childrenStore': {
                load: 'onChildrenLoad',
                beforeload: 'onChildrenBeforeLoad'
            }
        },
        controller: {
            '#template-view-controller': {
                nodeCreated: 'onNodeCreated'
            },
            '#parameter-list-controller': {
                parameterSaved: 'onParameterSaved'
            }
        }
    },
    onEpochLoad: function () {
        this.reloadStore();
    },
    onEpochClearClick: function () {
        this.getViewModel().set('selectedEpoch', null);
        this.reloadStore();
    },
    onParameterSaved: function () {
        this.reloadStore();
    },
    onTemplateClick: function () {
        var record = this.getViewModel().get('selectedItem');
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to create a template based on '${record.get('name')}'?`, function (btn) {
            if (btn === 'yes') {
                this.createTemplate();
            }
        }, this);
    },
    onNodeCreated: function (itemId) {
        this.getViewModel().set('selectedChildId', itemId);
        this.reloadStore();
    },
    onAddClick: function () {
        var breadcrumb = this.getViewModel().get('breadcrumb');
        var nodeType = imct.NodeTypeEnum.network;
        var parentId = null;
        var selectedItem = this.getViewModel().get('selectedItem');
        if (selectedItem && selectedItem.get('type') === 'node') {
            nodeType = selectedItem.get('nodeType');
            parentId = selectedItem.get('parentId');
        } else if (breadcrumb.length > 0) {
            var node = breadcrumb[breadcrumb.length - 1];
            nodeType = imct.utils.NodeTypeConverter.getChild(node.get('nodeType'));
            parentId = node.get('id');
        }

        var templateView = Ext.create({ xtype: 'template-view' });
        templateView.getViewModel().set('xmlId', this.getViewModel().get('xmlId'));
        templateView.getViewModel().set('nodeType', nodeType);
        templateView.getViewModel().set('parentId', parentId);

        templateView.show();
    },
    onWizardClick: function () {
        var me = this;
        imct.view.xml.builder.wizard.ChannelCreation.load(this.getViewModel().get('nodeId'), {
            success: function (record, operation) {
                var wizardView = Ext.create({
                    xtype: 'wizard-create-channel',
                    listeners: {
                        saved: function(){me.reloadStore();}
                    }
                });
                var wizardViewModel = wizardView.getViewModel()
                var fields = record.getFields();
                for (var int = 0; int < record.getFields().length; int++) {
                    var field = fields[int]
                    var fieldCmp = wizardView.down(`#${field.name}`);
                    if (fieldCmp){
                        fieldCmp.getViewModel().set('record', record.get(field.name))
                    }
                }
                wizardViewModel.set('channelInfo', record)
                wizardView.show();
            }
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
    onEpochClick: function () {
        var record = this.getViewModel().get('selectedItem');
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to epoch '${record.get('name')}'?`, function (btn) {
            if (btn === 'yes') {
                this.epochRecord(record.get('id'));
            }
        }, this);
    },
    showParams: null,
    showParamsFunction: function (record) {
        this.buildTitle(record);
        this.fireEvent('showParameters', record && record.get('type') === 'node' ? record : null);
        this.showParams = null;
    },
    onItemSelectionChange: function (cmp, selected) {
        if (selected.length > 0) {
            var me = this;
            if (this.showParams == null) {
                this.showParams = new Ext.util.DelayedTask(function () { 
                    var record = selected[0];
                    me.getViewModel().set('selectedChildId', record.get('type') === 'node' ? record.id : null);
                    me.showParamsFunction(record); 
                });
                this.showParams.delay(300);
            }
        } else {
            this.showParamsFunction();
        }
    },
    onItemKeyUp: function (view, record, item, index, event) {
        if (event.event.code === 'Enter') {
            this.navigate(view, this.getViewModel().get('selectedItem'));
        }
    },
    navigate: function(item, record){
        if (this.showParams) {
            this.showParams.cancel();
            this.showParams = null;
        }

        this.getViewModel().set('nodeType', record.get('nodeType') + 1);
        this.updateBreadcrumb(record);
        this.getViewModel().notify();
        this.reloadStore();

        this.fireEvent('showParameters', null);        
    },
    onItemDblClick: function (item, record) {
        if (!record.get('leaf') && record.get('type') != 'back') {
            this.navigate(item, record);
        }
    },
    onItemClick:function(item, record) {
        if(record.get('type') == 'back'){
            this.navigate(item, record)
        }
    },
    onBeforeSelect: function(item, record){
        if(record.get('type') == 'back'){
            return false;
        }
        return true;
    },
    createTemplate: function () {
        var selectedItem = this.getViewModel().get('selectedItem');
        var epoch = this.getViewModel().get('selectedEpoch');
        if (epoch){
        	epoch = Ext.Date.format(epoch.get('date'), IMCT.Globals.DateReadFormat)
        }
        Ext.Ajax.request({
            url: `/api/xml/template/`,
            method: 'POST',
            params: { 
            	node_inst_id: selectedItem.get('id'),
            	epoch: epoch
            },
            success: function (response) {
                Ext.toast({ html: 'Template Created', align: 't' });
            }
        });
    },
    epochRecord: function (nodeId) {
        var xmlId = this.getViewModel().get('xmlId');
        var me = this;
        Ext.Ajax.request({
            url: `/api/xml/epoch/${xmlId}/`,
            params: { node_inst_id: nodeId },
            method: 'POST',
            success: function (response) {
                me.reloadStore();
                me.fireEvent('showParameters', null);
                me.getStore('epochStore').load();
            }
        });
    },
    deleteRecord: function (nodeId) {
        var me = this;
        var xmlId = this.getViewModel().get('xmlId');
        Ext.Ajax.request({
            url: `/api/xml/tree/${xmlId}/${nodeId}`,
            method: 'DELETE',
            success: function (response) {
                me.reloadStore();
                me.fireEvent('showParameters', null);
            }
        });
    },
    updateBreadcrumb: function (record) {
        var nodeId = record.get('id');
        var breadcrumb = this.getViewModel().get('breadcrumb');
        if (record.get('type') === 'node') {
            breadcrumb.push(record);
        } else {
            nodeId = breadcrumb.pop().get('parentId');
        }
        
        this.getViewModel().set('nodeId', nodeId);
        this.buildTitle();   
    },
    buildTitle: function (selectedRecord) {
        var breadcrumb = this.getViewModel().get('breadcrumb');
        var title = 'Please create or select a network';
        var items = breadcrumb.map(function (item) {
            return `<a class="${item.get('iconCls')}" aria-hidden="true"></a> ${item.get('name')}`;
        });
        if (selectedRecord && selectedRecord.get('type') === 'node') {
            items.push(`<a class="${selectedRecord.get('iconCls')}" aria-hidden="true"></a> ${selectedRecord.get('name')}`);
        }
        if (items.length > 0) {
            title = items.join('<a style="margin-left: 7px; margin-right: 7px; " class="x-fa fa-chevron-right" aria-hidden="true"></a>');
        }

        this.getViewModel().set('title', title);
    },
    onEpochSelect: function () {
        this.reloadStore();
    },
    onChildrenLoad: function () {
        var selectedChildId = this.getViewModel().get('selectedChildId');
        var store = this.getViewModel().getStore('childrenStore');
        var selectedItem = null;
        if (!selectedChildId) {
            selectedItem = store.first();
        } else {
            store.getData().items.forEach(function (record) {
                if (record.get('id') === selectedChildId) {
                    selectedItem = record;
                }
            });
        }
        
        if (!selectedItem) {
            selectedItem = store.first();
        }

        this.getViewModel().set('selectedItem', selectedItem);
        this.getViewModel().set('selectedChildId', selectedItem !=null ? selectedItem.id : null);        	

        this.buildTitle();
    },
    onChildrenBeforeLoad: function (store) {
        IMCT.Globals.LocationColorScale = d3.scaleOrdinal(d3.schemeCategory10);
        store.removeAll();
        var breadcrumb = this.getViewModel().get('breadcrumb');
        if (breadcrumb.length !== 0) {
            store.add(new imct.view.xml.builder.children.Item({ type: 'back' }));
        };
    },
    reloadStore: function () {
        var store = this.getViewModel().getStore('childrenStore');
        store.clearFilter(true);
        var epoch = this.getViewModel().get('selectedEpoch');
        if (epoch) {
            store.addFilter([{ property: 'epoch', value: Ext.Date.format(epoch.get('date'), IMCT.Globals.DateReadFormat) }]);
        }

        store.load({ addRecords: true });
    }
});
