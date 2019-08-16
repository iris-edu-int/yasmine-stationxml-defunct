Ext.define('yasmine.view.xml.builder.parameter.items.operators.OperatorsEditorFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.operators-editor-form',
    id: 'operators-editor-form-controller', // Required for event listening
    initData: function (record) {
        this.getViewModel().set('record', record);
        this.getViewModel().set('website', record.get('website'));

        var agencies = record.get('agencies');
        if (agencies) {
            var store = this.getViewModel().getStore('agencyStore')
            agencies.forEach(function (item) {
                var agency = new yasmine.view.xml.builder.parameter.items.operators.Agency();
                agency.set('_name', item);
                agency.modified = {};
                store.insert(0, agency);
            });
        }

        var contacts = record.get('contacts');
        if (contacts) {
            var contactGrid = this.lookupReference('operatorcontactgrid');
            contactGrid.getController().initData(contacts);
        }
    },
    onAddAgencyClick: function () {
        var record = new yasmine.view.xml.builder.parameter.items.operators.Agency();
        var store = this.getViewModel().getStore('agencyStore');
        store.insert(0, record);

        this.startEditing(record);
    },
    onEditAgencyClick: function () {
        this.startEditing(this.getSelectedRecord());
    },
    onDeleteAgencyClick: function () {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().drop();
            }
        }, this);
    },
    onSaveClick: function () {
        var record = this.getViewModel().get('record');
        record.set('contacts', this.lookupReference('operatorcontactgrid').getController().getData());
        record.set('website', this.getViewModel().get('website'));
        record.set('agencies', this.getViewModel().getStore('agencyStore').getData().items.map(function (item) {
            return item.get('_name');
        }));

        this.fireEvent('operatorUpdated', record);
        this.closeView();
    },
    onCancelClick: function () {
        this.closeView();
    },
    getSelectedRecord: function () {
        return this.getViewModel().get('selectedAgencyRow');
    },
    startEditing(record) {
        var grid = this.lookupReference('operatoragencygrid');
        grid.findPlugin('rowediting').startEdit(record, 0);
    }
});
