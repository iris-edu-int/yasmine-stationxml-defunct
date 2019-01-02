Ext.define('imct.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentEditorModel', {
    extend: 'imct.view.xml.builder.parameter.ParameterItemEditorModel',
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
            model: 'imct.view.xml.builder.parameter.items.channelequipment.CalibrationDate',
            data: []
        }
    }
});

Ext.define('imct.view.xml.builder.parameter.items.channelequipment.CalibrationDate', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'value', type: 'date' }
    ]
});
