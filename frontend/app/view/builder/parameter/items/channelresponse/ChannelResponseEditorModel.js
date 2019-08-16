Ext.define('yasmine.view.xml.builder.parameter.items.channelresponse.ChannelResponseEditorModel', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.channel-response-editor',
    data: {
        sensorSelection: null,
        dataloggerSelection: null,
        sensorKeys: [],
        dataloggerKeys: [],
        channelResponse: null,
        sensorPreview: null,
        dataloggerPreview: null,
        channelPreview: null
    },
    stores: {
        sensorStore: {
            type: 'tree',
            model: 'yasmine.view.xml.builder.parameter.items.channelresponse.Response',
            proxy: {
                type: 'rest',
                url: '/api/nrl/sensors/',
                paramsAsJson: true
            },
            autoLoad: false,
            root: {
                id: 0,
                text: '<b>sensor</b>'
            }
        },
        dataloggerStore: {
            type: 'tree',
            model: 'yasmine.view.xml.builder.parameter.items.channelresponse.Response',
            proxy: {
                type: 'rest',
                url: '/api/nrl/dataloggers/',
                paramsAsJson: true
            },
            autoLoad: false,
            root: {
                id: 0,
                text: '<b>datalogger</b>'
            }
        }
    },
    formulas: {
        channelPreviewHeight: function(get) {
            return (get('previewMode')) ? 400 : 200;
        }
    }   
});


Ext.define('yasmine.view.xml.builder.parameter.items.channelresponse.Response', {
    extend: 'Ext.data.TreeModel',
    fields: [
        { name: 'text', type: 'string', persist: false },
        { name: 'key', type: 'string', persist: false },
        { name: 'leaf', type: 'boolean', persist: false },
        {
            name: 'title',
            type: 'string',
            persist: false,
            convert: function (value, record) {
                var delimiter = record.get('key') ? ':' : '';
                var text = record.get('text').replace('Select the', '').trim();
                if (!text) {
                    text = '';
                    delimiter = '';
                }
                return `<b>${text}${delimiter}</b> ${record.get('key')}`
            }
        }
    ]
});
