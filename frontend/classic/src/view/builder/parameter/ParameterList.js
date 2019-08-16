Ext.define('yasmine.view.xml.builder.parameter.ParameterList', {
    extend: 'Ext.grid.Panel',
    xtype: 'parameter-list',
    requires: ['Ext.toolbar.Paging','yasmine.view.xml.builder.parameter.ParameterListModel','yasmine.view.xml.builder.parameter.ParameterListController',
        'yasmine.view.xml.builder.parameter.ParameterEditor','yasmine.view.xml.builder.parameter.ParameterEditorExt'],
    viewModel: 'parameter-list',
    controller: 'parameter-list',
    bind: {
        store: '{infoStore}',
        title: '{title}',
        selection: '{theRow}'
    },
    multiColumnSort: true,
    collapsible: true,
    viewConfig: {
        loadMask: false
    },
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1,
        getEditor: function (record, column){
            var old = column.getItemId;
            column.getItemId = function (){
                return record.id
            }
            var editor = Ext.grid.plugin.CellEditing.prototype.getEditor.call(this, record, column);
            column.getItemId = old;
            return editor;
        },
        listeners: {
            beforeedit: 'onBeginEdit',
            canceledit: 'onCancelCellEditFinish',
            edit: 'onCellEdit',
            validateedit: 'onCellEditValidate'
        }
    },
    columns: [{
        text: 'Name',
        dataIndex: 'name',
        renderer: 'nameRenderer',
        flex: 1
    },{
        text: 'Value',
        flex: 1,
        dataIndex: 'value',
        renderer: 'valueRenderer',
        cachedEditors: new Ext.util.HashMap(),
        getEditor: function (record){
            var field = this.cachedEditors.get(record.get('id'));
            if (!field) {
                field = Ext.create({
                    xtype: record.get('attr_class')
                });
                field.getViewModel().set('record', record);
            }
            return field
        },
        editor: {
            completeOnEnter: true,
            field: {
                xtype: 'textfield',
                allowBlank: false
            }
        }
    }],
    listeners: {
        cellkeydown: 'onCellKeyDown'
    },
    tbar: [{
        xtype: 'combobox',
        disabled: true,
        width: 200,
        bind: {
            selection: '{selectedAvailableParameter}',
            store: '{availableParamsStore}',
            disabled: '{!isAvailableParamsEnabled}'
        },
        displayField: 'name',
        reference: 'availableParamsCntr',
        emptyText: 'Add Field',
        queryMode: 'local',
        listeners: {
            select: 'onAddClick',
            focus: function (cmp){
                cmp.store.reload();
            }
        },
        triggers: {
            clear: {
                cls: 'x-form-clear-trigger',
                handler: function (cmp){
                    cmp.clearValue();
                }
            }
        }
    },{
        tooltip: 'Delete Parameter',
        iconCls: 'x-fa fa-minus',
        handler: 'onDeleteClick',
        disabled: true,
        bind: {
            disabled: '{!theRow}'
        }
    }],
    tools: [{
        type: 'help',
        handler: function (){
            yasmine.utils.HelpUtil.helpMe('parameter_list', 'Node Information')
        }
    }]
});
