Ext.define('yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'yasmine-channel-equipment-field',
    requires: ['yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentEditorModel',
        'yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentEditorController'],
    viewModel: 'channel-equipment-editor',
    controller: 'channel-equipment-editor',
    layout: 'vbox',
    items: [{
        bind: {
            html: '{validationErrors}',
            hidden: '{!canShowValidationError}'
        },
        hidden: true,
        width: '100%',
        padding: '0 0 10 0'
    },{
        layout: 'hbox',
        items: [{
            layout: 'vbox',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Type',
                bind: '{type}',
                itemId: 'focusItem'
            },{
                xtype: 'textarea',
                fieldLabel: 'Description',
                bind: '{description}'
            },{
                xtype: 'textfield',
                fieldLabel: 'Model',
                bind: '{model}'
            },{
                xtype: 'textfield',
                fieldLabel: 'Manufacturer',
                bind: '{manufacturer}'
            },{
                xtype: 'textfield',
                fieldLabel: 'Vendor',
                bind: '{vendor}'
            },{
                xtype: 'textfield',
                fieldLabel: 'Serial Number',
                bind: '{serialNumber}'
            },{
                xtype: 'datefield',
                fieldLabel: 'Installation Date',
                bind: '{installationDate}',
                format: yasmine.Globals.DatePrintLongFormat
            },{
                xtype: 'datefield',
                fieldLabel: 'Removal Date',
                bind: '{removalDate}',
                format: yasmine.Globals.DatePrintLongFormat
            },{
                xtype: 'textfield',
                fieldLabel: 'Resource Id',
                bind: '{resourceId}'
            }]
        },{
            layout: 'vbox',
            height: '100%',
            padding: '0 0 10 10',
            items: [{
                xtype: 'grid',
                style: 'border: solid #d0d0d0 1px',
                reference: 'calibrationdategrid',
                width: 200,
                height: '100%',
                plugins: [{
                    ptype: 'rowediting'
                }],
                selModel: 'rowmodel',
                bind: {
                    store: '{calibrationDateStore}',
                    selection: '{selectedCalibrationDateRow}'
                },
                columns: [{
                    xtype: 'datecolumn',
                    text: 'Calibration Dates',
                    flex: 1,
                    editor: {
                        xtype: 'datefield',
                        format: yasmine.Globals.DatePrintLongFormat
                    },
                    format: yasmine.Globals.DatePrintLongFormat,
                    dataIndex: 'value'
                }],
                listeners: {
                    itemdblclick: 'onEditClick'
                },
                tbar: [{
                    iconCls: 'x-fa fa-plus',
                    tooltip: 'Add Calibration Date',
                    handler: 'onAddClick'
                },{
                    iconCls: 'x-fa fa-minus',
                    tooltip: 'Delete Calibration Date',
                    handler: 'onDeleteClick',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedCalibrationDateRow}'
                    }
                },{
                    iconCls: 'x-fa fa-pencil',
                    tooltip: 'Edit Calibration Date',
                    handler: 'onEditClick',
                    disabled: true,
                    bind: {
                        disabled: '{!selectedCalibrationDateRow}'
                    }
                }]
            }]
        }]
    }]
});
