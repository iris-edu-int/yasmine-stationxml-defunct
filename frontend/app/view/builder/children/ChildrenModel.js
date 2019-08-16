Ext.define('yasmine.view.xml.builder.children.ChildrenModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.children',
    requires: [
        'yasmine.NodeTypeEnum'
    ],
    data: {
        title: '',
        breadcrumb: [],
        nodeId: 0,
        selectedItem: null,
        selectedEpoch: null,
        selectedChildId: null,
        nodeType: yasmine.NodeTypeEnum.network
    },
    stores: {
        childrenStore: {
            storeId: 'childrenStore',
            model: 'yasmine.view.xml.builder.children.Item',
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: '/api/xml/tree/{xmlId}/{nodeId}',
                paramsAsJson: true
            },
            remoteFilter: true
        },
        epochStore: {
            storeId: 'epochStore',
            model: 'yasmine.view.xml.builder.children.Date',
            autoLoad: false,
            proxy: {
                type: 'rest',
                url: '/api/xml/epoch/{xmlId}/',
                paramsAsJson: true
            }
        }
    },
    formulas: {
        canDelete: function (get) {
            return get('selectedItem') && get('selectedItem').get('type') === 'node';
        },
        canEpoch: function (get) {
            var selectedItem = get('selectedItem');
            return selectedItem && selectedItem.get('type') === 'node' && (selectedItem.get('end') == null || selectedItem.get('end').getTime() > (new Date()).getTime());
        },
        canTemplate: function (get) {
            return get('selectedItem') && get('selectedItem').get('type') === 'node';
        },
        canCreateChannel: function (get) {
            return get('nodeType') == yasmine.NodeTypeEnum.channel;
        }
    }
});

Ext.define('yasmine.view.xml.builder.children.Item', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string', defaultValue: 'node' },
        { name: 'locationColor', type: 'string', convert: function (v, record) {
            var locationCode = record.get('location_code');
            return (locationCode) ? yasmine.Globals.LocationColorScale(locationCode) : '#e4e4e4';
        } },
        { name: 'parentId', type: 'int' },
        { name: 'description', type: 'string', convert: function (v, record) {
            var desc = record.get('description');
            return desc ? desc : yasmine.Globals.NotApplicable
        } },
        { name: 'start', type: 'date', dateFormat: yasmine.Globals.DateReadFormat },
        { name: 'end', type: 'date', dateFormat: yasmine.Globals.DateReadFormat },
        {
            name: 'iconCls', type: 'string', persist: false,
            depends: ['nodeType'],
            convert: function(value, record) { 
                if (record.get('root')) {
                    return 'fa-file-code-o';
                }
                return yasmine.utils.NodeTypeConverter.toIcon(record.get('nodeType')) 
            }
        },
        { name: 'nodeType', type: 'int', persist: false },
        { name: 'nodeTypeName', type: 'string', persist: false, depends: ['nodeType'],
            convert: function(value, record) { 
                return yasmine.utils.NodeTypeConverter.toString(record.get('nodeType'));
            } 
        },
        { name: 'longitude', persist: false },
        { name: 'latitude', persist: false },
        { name: 'site', persist: false },
        { name: 'sampleRate', persist: false, mapping: 'sample_rate'},
        { name: 'sensor', persist: false },
        {name: 'last', persist: false},
        {name: 'has_children', persist: false, type: 'boolean'}
    ]
});

Ext.define('yasmine.view.xml.builder.children.Date', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'date', type: 'date', persist: false, dateFormat: yasmine.Globals.DateReadFormat },
        {
            name: 'dateString',
            type: 'string',
            persist: false,
            depends: ['date'],
            convert: function (value, record) {
                var date = record.get('date');
                if (date) {
                    return Ext.Date.format(date, yasmine.Globals.DatePrintLongFormat);
                }

                return null;
            }
        }
    ]
});
