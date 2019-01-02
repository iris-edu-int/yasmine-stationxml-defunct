Ext.define('imct.view.xml.builder.parameter.items.operators.OperatorsEditorController', {
    extend: 'imct.view.xml.builder.parameter.ParameterItemEditorController',
    alias: 'controller.operators-editor',
    listen: {
        controller: {
            '#operators-editor-form-controller': {
                operatorUpdated: 'onOperatorUpdated'
            }
        }
    },
    initData: function () {
        var value = this.getViewModel().get('record').get('value');
        if (!value) {
            return;
        }

        var store = this.getViewModel().getStore('operatorStore');
        value.forEach(function(item){
            var operator = new imct.view.xml.builder.parameter.items.operators.Operator();
            operator.set('website', item.website)
            operator.set('agencies', item._agencies)
            operator.set('contacts', item._contacts)
            operator.modified = {};
            store.insert(0, operator);
        });
    },
    fillRecord: function () {
        var record = this.getViewModel().get('record');
        var operators = this.getViewModel().getStore('operatorStore').getData().items.map(function(item){
            var data = item.getData();
            return {
                'py/object': 'obspy.core.inventory.util.Operator',
                agencies: data.agencies,
                contacts: data.contacts,
                website: data.website
            };
        });

        record.set('value', operators);
    },
    onOperatorUpdated: function (record) {
        var store = this.getViewModel().getStore('operatorStore');
        store.insert(0, record);
    },
    onAddClick: function () {
        this.showEditForm(new imct.view.xml.builder.parameter.items.operators.Operator());
    },
    onEditClick: function () {
        this.showEditForm(this.getSelectedRecord());
    },
    onDeleteClick: function () {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().drop();
            }
        }, this);
    },
    getSelectedRecord: function () {
        return this.getViewModel().get('selectedOperatorRow');
    },
    showEditForm: function(record) {
        var form = Ext.create({ xtype: 'operators-editor-form' });
        form.getController().initData(record);
        form.show();
    }
});
