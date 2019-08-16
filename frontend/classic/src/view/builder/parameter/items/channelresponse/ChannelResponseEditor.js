Ext.define('yasmine.view.xml.builder.parameter.items.channelresponse.ChannelResponseEditor', {
    extend: 'Ext.panel.Panel',
    xtype: 'yasmine-channel-response-field',
    requires: ['yasmine.view.xml.builder.parameter.items.channelresponse.ChannelResponseEditorModel',
        'yasmine.view.xml.builder.parameter.items.channelresponse.ChannelResponseEditorController'],
    viewModel: 'channel-response-editor',
    controller: 'channel-response-editor',
    width: 1000,
    items: [{
        bind: {
            html: '{validationErrors}',
            hidden: '{!canShowValidationError}'
        },
        hidden: true,
        width: '100%',
        padding: '5 8 5 8'
    },{
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        hidden: true,
        bind: {
            hidden: '{previewMode}'
        },
        defaults: {
            xtype: 'breadcrumb',
            showMenuIcons: false,
            showIcons: false,
            scrollable: true,
            height: 200,
            layout: 'vbox',
            componentCls: 'equipment',
            displayField: 'title'
        },
        items: [{
            reference: 'sensorsCmp',
            flex: 1,
            bind: {
                store: '{sensorStore}',
                selection: '{sensorSelection}'
            },
            defaults: {
                listeners: {
                    click: 'onSensorClick'
                }
            },
            listeners: {
                change: 'onSensorSelectionChange'
            }
        },{
            reference: 'dataloggerCmp',
            flex: 1,
            bind: {
                store: '{dataloggerStore}',
                selection: '{dataloggerSelection}'
            },
            defaults: {
                listeners: {
                    click: 'onDataloggerClick'
                }
            },
            listeners: {
                change: 'onDataloggerSelectionChange'
            }
        }]
    },{
        layout: 'hbox',
        hidden: true,
        bind: {
            hidden: '{previewMode}'
        },
        defaults: {
            xtype: 'textareafield',
            readOnly: true,
            height: 200
        },
        items: [{
            margin: '10 5 10 0',
            fieldStyle: {
                'fontFamily': 'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;',
                'fontSize': '11px',
                'white-space': 'pre'
            },
            flex: 1,
            bind: {
                value: '{sensorPreview}'
            }
        },{
            margin: '10 0 10 5',
            fieldStyle: {
                'fontFamily': 'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;',
                'fontSize': '11px',
                'white-space': 'pre'
            },
            flex: 1,
            bind: {
                value: '{dataloggerPreview}'
            }
        }]
    },{
        layout: 'hbox',
        items: {
            xtype: 'textareafield',
            flex: 1,
            height: 200,
            readOnly: true,
            fieldStyle: {
                'fontFamily': 'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;',
                'fontSize': '11px',
                'white-space': 'pre'
            },
            bind: {
                scrollable: true,
                value: '{channelPreview}',
                height: '{channelPreviewHeight}'
            }
        }
    }]
});
