Ext.define('yasmine.view.xml.builder.parameter.components.person.PersonEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.person-edit',
    id: 'person-edit-controller', // Required for event listening
    initData: function () {
        var that = this;
        var record = null;
        var person = this.getViewModel().get('person');
        if (person.get('_names')) {
            person.get('_names').forEach(function(item) {
                record = new yasmine.view.xml.builder.parameter.components.person.Name();
                record.set('_name', item._name);
                record.modified = {};
                that.insertRecord('nameStore', record)
            });
        }
        if (person.get('_agencies')) {
            person.get('_agencies').forEach(function(item) {
                record = new yasmine.view.xml.builder.parameter.components.person.Agency();
                record.set('_name', item._name);
                record.modified = {};
                that.insertRecord('agencyStore', record)
            });
        }
        if (person.get('_emails')) {
            person.get('_emails').forEach(function(item) {
                record = new yasmine.view.xml.builder.parameter.components.person.Email();
                record.set('_email', item._email);
                record.modified = {};
                that.insertRecord('emailStore', record)
            });
        }
        if (person.get('_phones')) {
            person.get('_phones').forEach(function(item) {
                record = new yasmine.view.xml.builder.parameter.components.person.Phone();
                record.set('_country_code', item.country_code);
                record.set('_area_code', item.area_code);
                record.set('_phone_number', item.phone_number);
                record.set('_description', item.description);
                record.modified = {};
                that.insertRecord('phoneStore', record)
            });
        }
    },
    onSaveClick: function () {
        var record = this.getViewModel().get('person');
        record.set('_names', this.getItems('nameStore'));
        record.set('_agencies', this.getItems('agencyStore'));
        record.set('_emails', this.getItems('emailStore'));
        record.set('_phones', this.getItems('phoneStore'));
        record.set('py/object', 'obspy.core.inventory.util.Person');

        this.fireEvent('personUpdated', record);
        this.closeView();
    },
    onCancelClick: function () {
        this.closeView();
    },
    onAddNameClick: function () {
        var record = new yasmine.view.xml.builder.parameter.components.person.Name();
        this.insertRecord('nameStore', record)
        this.enableEditing('namegrid', record);
    },
    onAddAgencyClick: function () {
        var record = new yasmine.view.xml.builder.parameter.components.person.Agency();
        this.insertRecord('agencyStore', record)
        this.enableEditing('agencygrid', record);
    },
    onAddEmailClick: function () {
        var record = new yasmine.view.xml.builder.parameter.components.person.Email();
        this.insertRecord('emailStore', record)
        this.enableEditing('emailgrid', record);
    },
    onAddPhoneClick: function () {
        var record = new yasmine.view.xml.builder.parameter.components.person.Phone();
        this.insertRecord('phoneStore', record)
        this.enableEditing('phonegrid', record);
    },
    onDeleteNameClick: function () {
        this.deleteRecord(this.getSelectedNameRecord());
    },
    onDeleteAgencyClick: function () {
        this.deleteRecord(this.getSelectedAgencyRecord());
    },
    onDeleteEmailClick: function () {
        this.deleteRecord(this.getSelectedEmailRecord());
    },
    onDeletePhoneClick: function () {
        this.deleteRecord(this.getSelectedPhoneRecord());
    },
    onEditNameClick: function () {
        this.enableEditing('namegrid', this.getSelectedNameRecord());
    },
    onEditAgencyClick: function () {
        this.enableEditing('agencygrid', this.getSelectedAgencyRecord());
    },
    onEditEmailClick: function () {
        this.enableEditing('emailgrid', this.getSelectedEmailRecord());
    },
    onEditPhoneClick: function () {
        this.enableEditing('phonegrid', this.getSelectedPhoneRecord());
    },
    getSelectedNameRecord: function () {
        return this.getViewModel().get('selectedNameRow');
    },
    getSelectedAgencyRecord: function () {
        return this.getViewModel().get('selectedAgencyRow');
    },
    getSelectedEmailRecord: function () {
        return this.getViewModel().get('selectedEmailRow');
    },
    getSelectedPhoneRecord: function () {
        return this.getViewModel().get('selectedPhoneRow');
    },
    deleteRecord: function (record) {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') { record.drop(); }
        }, this);
    },
    insertRecord: function (storeName, record) {
        var store = this.getViewModel().getStore(storeName);
        store.insert(0, record);
    },
    enableEditing: function (gridReference, record) {
        var grid = this.lookupReference(gridReference);
        grid.findPlugin('rowediting').startEdit(record, 0);
    },
    getItems(storeName) {
        var result = [];
        this.getViewModel().getStore(storeName).getData().items.forEach(function (item) {
            result.push(item.data);
        });

        return result;
    }
});
