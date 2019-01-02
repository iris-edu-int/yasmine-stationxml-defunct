Ext.define('imct.view.xml.builder.parameter.components.person.PersonListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.person-list',
    listen: {
        controller: {
            '#person-edit-controller': {
                personUpdated: 'onPersonUpdated'
            }
        }
    },
    initData: function (persons) {
        if (!persons) {
            return;
        }

        var that = this;
        persons.forEach(function (item) {
            var record = new imct.view.xml.builder.parameter.components.person.Person();
            if (item._names) {
                record.set('_names', item._names.map(function (item) { return { _name: item }; }));
            }
            if (item._agencies) {
                record.set('_agencies', item._agencies.map(function (item) { return { _name: item }; }));
            }
            if (item._emails) {
                record.set('_emails', item._emails.map(function (item) { return { _email: item }; }));
            }
            if (item._phones) {
                var records = item._phones.map(function (item) {
                    return {
                    	'py/object': 'obspy.core.inventory.util.PhoneNumber',
                        country_code: item.country_code,
                        area_code: item.area_code,
                        phone_number: item._phone_number,
                        description: item.description
                    };
                })

                record.set('_phones', records);
            }

            record.modified = {};
            var store = that.getViewModel().getStore('personStore');
            store.insert(0, record);
        });
    },
    onPersonUpdated: function (person) {
        var store = this.getViewModel().getStore('personStore');
        store.insert(0, person);
    },
    onAddClick: function () {
        this.showForm(new imct.view.xml.builder.parameter.components.person.Person());
    },
    onDeleteClick: function () {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().drop();
            }
        }, this);
    },
    onEditClick: function () {
        this.showForm(this.getSelectedRecord());
    },
    getSelectedRecord: function () {
        return this.getView().getSelection()[0];
    },
    getData: function () {
        return this.getViewModel()
            .getStore('personStore')
            .getData()
            .items
            .map(function (item) {
                return {
                    'py/object': 'obspy.core.inventory.util.Person',
                    names: item.getData()._names.map(function (item) { return item._name }),
                    emails: item.getData()._emails.map(function (item) { return item._email }),
                    agencies: item.getData()._agencies.map(function (item) { return item._name }),
                    phones: item.getData()._phones.map(function (item) {
                        return {
                        	'py/object': 'obspy.core.inventory.util.PhoneNumber',
                            country_code: item._country_code,
                            area_code: item._area_code,
                            phone_number: item._phone_number,
                            description: item._description
                        }
                    })
                }
            });
    },
    showForm(record) {
        var editor = Ext.create({ xtype: 'person-edit' });
        editor.getViewModel().set('person', record);
        editor.getController().initData();
        editor.show();
    }
});
