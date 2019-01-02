Ext.define('imct.view.settings.SettingsListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settings',
    data: {
        settings: null
    },
    stores: {
        networkDefaultFields: {
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: `/api/attr/${imct.NodeTypeEnum.network}`,
                paramsAsJson: true
            }
        },
        stationDefaultFields: {
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: `/api/attr/${imct.NodeTypeEnum.station}`,
                paramsAsJson: true
            }
        },
        channelDefaultFields: {
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: `/api/attr/${imct.NodeTypeEnum.channel}`,
                paramsAsJson: true
            }
        }
    }
});

Ext.define('imct.view.settings.Settings', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: '/api/cfg/',
        writer: {
            type: 'json',
            writeAllFields: false
        }
    },
    fields: [
        { name: 'id', type: 'int' },
        { name: 'general__date_format_long', type: 'string' },
        { name: 'general__date_format_short', type: 'string' },
        { name: 'general__module', type: 'string' },
        { name: 'general__source', type: 'string' },
        { name: 'general__uri', type: 'string' },
        { name: 'network__code', type: 'string' },
        { name: 'network__num_stations', type: 'int' },
        { name: 'network__required_fields' },
        { name: 'station__code', type: 'string' },
        { name: 'station__num_channels', type: 'int' },
        { name: 'station__required_fields' },
        { name: 'station__spread_to_channels' },
        { name: 'channel__code', type: 'string' },
        { name: 'channel__required_fields' }
    ]
});
