Ext.define('yasmine.view.xml.builder.parameter.ParameterListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parameter-list',
    id: 'parameter-list-controller', // Required for event listening
    requires: [
        'yasmine.view.xml.builder.parameter.items.text.TextPreview',
        'yasmine.view.xml.builder.parameter.items.comments.CommentsPreview',
        'yasmine.view.xml.builder.parameter.items.date.DatePreview',
        'yasmine.view.xml.builder.parameter.items.int.IntPreview',
        'yasmine.view.xml.builder.parameter.items.latitude.LatitudePreview',
        'yasmine.view.xml.builder.parameter.items.longitude.LongitudePreview',
        'yasmine.view.xml.builder.parameter.items.operators.OperatorsPreview',
        'yasmine.view.xml.builder.parameter.items.site.SitePreview',
        'yasmine.view.xml.builder.parameter.items.float.FloatPreview',
        'yasmine.view.xml.builder.parameter.items.unrecognized.UnrecognizedPreview',
        'yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReferencesPreview',
        'yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentPreview',
        'yasmine.view.xml.builder.parameter.items.channeltypes.ChannelTypesPreview',
        'yasmine.view.xml.builder.parameter.items.channelresponse.ChannelResponsePreview',
        'yasmine.NodeTypeEnum'
    ],
    listen: {
        controller: {
            '#tree-controller': {
                treeItemSelected: 'onTreeItemSelected',
                treeItemDeSelected: 'onTreeItemDeSelected'
            },
            '#children-controller': {
                showParameters: 'onShowParameters'
            }
        }
    },
    onShowParameters: function (node) {
        if (node) {
            this.onTreeItemSelected(node);
        } else {
            this.onTreeItemDeSelected();
        }
    },
    onTreeItemSelected: function (node) {
        if (node.data.root) {
            this.onTreeItemDeSelected();
            return;
        }
        this.getViewModel().set('nodeInstance', node);        
        this.getViewModel().set('nodeType', node.get('nodeType'));
        this.getViewModel().set('nodeId', node.id);
        this.getViewModel().set('selectedAvailableParameter', null);
        this.getViewModel().set('theRow', null);
        this.getViewModel().notify();
        this.reloadStores();
    },
    onTreeItemDeSelected: function () {
        this.getViewModel().set('nodeInstance', null);          
        this.getViewModel().set('nodeType', null);
        this.getViewModel().set('selectedAvailableParameter', null);
        this.getViewModel().set('theRow', null);
        this.getViewModel().notify();
        this.clearStores();
    },
    onRecordSaved: function () {
        this.closeForm();
        this.getViewModel().set('selectedAvailableParameter', null);
        this.reloadStores();
        this.fireEvent('parameterSaved');
    },
    onEditinFormgCanceled: function (record) {
        this.closeForm();
        this.onCelcelEditing(record);
        this.getViewModel().set('selectedAvailableParameter', null);
    },
    onCellKeyDown: function (cell, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if (e.getKey() == e.ENTER) {
            this.onEditClick();
        }
    },
    onEditClick: function () {
        if (!this.getSelectedRecord()) {
            return;
        }

        var parameter = new yasmine.model.Parameter();
        parameter.set('id', this.getSelectedRecord().get('id'));
        parameter.load({
            scope: this,
            success: function (record) {
                this.showForm(record);
            }
        });
    },
    onCellEdit: function(editor, context){
        if (context.record.dirty){
            context.record.save()   
        }
    },
    onCancelCellEditFinish: function(editor, context){
        this.onCelcelEditing(context.record);
    },
    onCelcelEditing: function(record){
        if (record.phantom){
            var view = this.getView();
            var infoStore = view.getStore('infoStore');
            infoStore.remove(record)
            this.lookupReference('availableParamsCntr').clearValue();
        } 
    },
    onCellEditValidate: function(editor, context){
        var record = context.record;
        if (record.phantom && !context.value){
           context.cancel = true
           return false
        }
    },    
    onAddClick: function (grid, record) {
        if (!record) {
            return
        }
        var view = this.getView();
        var parameter = new yasmine.model.Parameter({
            id: null,
            'class': record.get('class'),
            attr_class: record.get('class'),
            name: record.get('name'),
            parameterId: record.get('id'),
            nodeId: this.getViewModel().get('nodeId'),
            node_id: this.getViewModel().get('nodeType')
        });

        var infoStore = view.getStore('infoStore')
        infoStore.insert(0, parameter)
        view.setSelection(parameter)
        var curPossition = view.getSelectionModel().getCurrentPosition()
        var context = new Ext.grid.CellContext(view.getView()).setPosition(curPossition.rowIdx, view.getColumnManager().getColumns()[1]);
        this.getView().setActionableMode(true, context)
    },
    onDeleteClick: function () {
        var record = this.getSelectedRecord();
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete '${record.get('name')}' parameter?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().erase({
                    scope: this,
                    success: function () {
                        this.reloadStores();
                    }
                });
            }
        }, this);
    },
    getSelectedRecord: function () {
        return this.getView().getSelection()[0];
    },
    onCreateEditor: function(record){
        var editor = Ext.create({xtype: record.get('attr_class')})
        editor.getViewModel().set('record', record)
        this.editorWindow.getViewModel().set('record', record);
        this.editorWindow.getViewModel().set('nodeType', this.getViewModel().get('nodeType'))                
        return editor 
    },
    onBeginEdit: function(editor, context){
        var record = context.record;
        var isComplexType = record.get('isComplexType');
        if(isComplexType){
            this.showForm(context.record)
            return false;
        }else{
            var nodeInstance = this.getViewModel().get('nodeInstance');
            var has_children = nodeInstance.get('has_children')
            var commonAttrs = [yasmine.NodeAttrEnum.latitude, yasmine.NodeAttrEnum.longitude, yasmine.NodeAttrEnum.elevation, yasmine.NodeAttrEnum.start_date, yasmine.NodeAttrEnum.end_date]
            var name = record.get('name');
            var nodeType = nodeInstance.get('nodeType')
            if (has_children && commonAttrs.indexOf(name) >=0 && nodeType == yasmine.NodeTypeEnum.station){
                this.showFormExt(context.record)
                return false
            }
        }
    },
    showForm(record) {
        this.editorWindow = Ext.create({ 
            xtype: 'parameter-editor',
            listeners:{
                recordSaved: {
                    fn: this.onRecordSaved,
                    scope: this
                },
                editingCanceled: {
                    fn: this.onEditinFormgCanceled,
                    scope: this
                }
            }
        });
        this.editorWindow.getViewModel().set('record', record);
        this.editorWindow.getViewModel().set('nodeType', this.getViewModel().get('nodeType'))
        try {
            this.editorWindow.getController().createFrom();
            this.editorWindow.show();
        } catch (error) {
            if (error.message.startsWith('[Ext.create] Unrecognized class name')) {
                Ext.MessageBox.alert('Error', `There is no editor for the following property: '${record.get('class')}'`);
            } else {
                throw error;
            }
        }
    },
    showFormExt(record) {
        this.editorWindow = Ext.create({ 
            xtype: 'parameter-editor-ext',
            listeners:{
                recordSaved: {
                    fn: this.onRecordSaved,
                    scope: this
                },
                editingCanceled: {
                    fn: this.onEditinFormgCanceled,
                    scope: this
                }
            }
        });
        this.editorWindow.getViewModel().set('record', record);
        this.editorWindow.getViewModel().set('nodeType', this.getViewModel().get('nodeType'))
        try {
            this.editorWindow.getController().createFrom();
            this.editorWindow.show();
        } catch (error) {
            if (error.message.startsWith('[Ext.create] Unrecognized class name')) {
                Ext.MessageBox.alert('Error', `There is no editor for the following property: '${record.get('class')}'`);
            } else {
                throw error;
            }
        }
    },    
    closeForm() {
        this.editorWindow.close();
    },
    reloadStores() {
        this.getViewModel().getStore('infoStore').reload();
    },
    clearStores() {
        this.lookupReference('availableParamsCntr').clearValue();
        this.getViewModel().getStore('availableParamsStore').loadData([]); 
        this.getViewModel().getStore('infoStore').loadData([]);
    },
    nameRenderer: function (value, column, record) {
        var requiredSymbol = '';
        var name = value;
        if (record.get('required')) {
            requiredSymbol = '<span style="color: red">*</span>';
            name = `<b>${value}</b>`;
        }
        return `${requiredSymbol} ${name}`;
    },
    valueRenderer: function (value, column, record) {
        var preview = null;
        try {
            preview = Ext.create({ xtype: `${record.get('class')}-preview` });
        } catch (error) {
            preview = Ext.create({ xtype: 'unrecognized-preview' });
        }

        var result = preview.getPreview(record.get('value'));
        if (yasmine.utils.CheckUtil.isEmpty(result)) {
            return yasmine.Globals.NotApplicable;
        }

        if (result.tooltip) {
            return `<span data-qtip="${result.tooltip}">${result.value}</span>`;
        }

        if (preview.isComplexType && preview.isComplexType()) {
            result = `<i class="fa fa-info-circle" aria-hidden="true" title="Double click to see more details"></i>  ${result}`;
        }

        return result;
    }
});


