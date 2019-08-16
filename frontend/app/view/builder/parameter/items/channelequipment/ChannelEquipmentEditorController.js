Ext.define('yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentEditorController', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorController',
    alias: 'controller.channel-equipment-editor',
    initData: function () {
        var value = this.getViewModel().get('record').get('value');
        if (!value) {
            return;
        }

        this.getViewModel().set('type', value.type);
        this.getViewModel().set('description', value.description);
        this.getViewModel().set('manufacturer', value.manufacturer);
        this.getViewModel().set('vendor', value.vendor);
        this.getViewModel().set('serialNumber', value.serial_number);
        this.getViewModel().set('installationDate', Ext.Date.parse(value.installation_date, yasmine.Globals.DateReadFormat, true));
        this.getViewModel().set('removalDate', Ext.Date.parse(value.removal_date, yasmine.Globals.DateReadFormat, true));
        this.getViewModel().set('resourceId', value.resource_id);
        this.getViewModel().set('model', value.model);

        if (value.calibration_dates) {
            var store = this.getViewModel().getStore('calibrationDateStore');
            value.calibration_dates.forEach(function (calibrationDate) {
                var date = new yasmine.view.xml.builder.parameter.items.channelequipment.CalibrationDate();
                date.set('value', Ext.Date.parse(calibrationDate, yasmine.Globals.DateReadFormat, true));
                date.modified = {};
                store.add(date);
            })
        }
    },
    fillRecord: function () {
        var store = this.getViewModel().getStore('calibrationDateStore');
        var calibrationDates = [];
        store.getData().items.forEach(function (calibrationDate) {
            calibrationDates.push(Ext.Date.format(calibrationDate.getData().value, yasmine.Globals.DateReadFormat));
        })

        var viewModel = this.getViewModel();
        var value = {
            'py/object': 'obspy.core.inventory.util.Equipment',
            type: viewModel.get('type'),
            description: viewModel.get('description'),
            manufacturer: viewModel.get('manufacturer'),
            vendor: viewModel.get('vendor'),
            serial_number: viewModel.get('serialNumber'),
            installation_date: Ext.Date.format(viewModel.get('installationDate'), yasmine.Globals.DateReadFormat),
            removal_date: Ext.Date.format(viewModel.get('removalDate'), yasmine.Globals.DateReadFormat),
            resource_id: viewModel.get('resourceId'),
            model: viewModel.get('model'),
            calibration_dates: calibrationDates
        };

        viewModel.get('record').set('value', value);
    },
    onAddClick: function () {
        var record = new yasmine.view.xml.builder.parameter.items.channelequipment.CalibrationDate();
        var store = this.getViewModel().getStore('calibrationDateStore');
        store.insert(0, record);

        var grid = this.lookupReference('calibrationdategrid');
        grid.findPlugin('rowediting').startEdit(record, 0);
    },
    onEditClick: function () {
        var record = this.getSelectedRecord();
        var grid = this.lookupReference('calibrationdategrid');
        grid.findPlugin('rowediting').startEdit(record, 0);
    },
    onDeleteClick: function () {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().drop();
            }
        }, this);
    },
    getSelectedRecord: function () {
        return this.getViewModel().get('selectedCalibrationDateRow');
    }
});
