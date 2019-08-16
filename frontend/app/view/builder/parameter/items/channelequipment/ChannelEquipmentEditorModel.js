Ext.define('yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentEditorModel', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.channel-equipment-editor',
    data: {
        selectedCalibrationDateRow: null,
        type: null,
        description: null,
        manufacturer: null,
        vendor: null,
        serialNumber: null,
        installationDate: null,
        removalDate: null,
        resourceId: null,
        model: null
    },
    stores: {
        calibrationDateStore: {
            model: 'yasmine.view.xml.builder.parameter.items.channelequipment.CalibrationDate',
            data: []
        }
    }
});

Ext.define('yasmine.view.xml.builder.parameter.items.channelequipment.CalibrationDate', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'value', type: 'date' }
    ]
});
