Ext.define('yasmine.view.xml.builder.tree.TreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tree',
    requires: [
        'Ext.data.TreeStore',
        'yasmine.model.TreeItem'
    ],
    data: {
        current: {
            item: null,
            epoch: null
        }
    },
    stores: {
        treeStore: {
            type: 'tree',
            proxy: {
                type: 'rest',
                url: '/api/xml/tree/{xmlId}',
                paramsAsJson: true
            },
            remoteFilter: true,
            filters: [
                {
                    property: 'epoch',
                    value: '{current.epoch}',
                    serializer: function (filter) {
                        if (filter.value) {
                            filter.value = Ext.Date.format(filter.value.get('date'), yasmine.Globals.DateReadFormat);
                        }
                    }
                }
            ],
            rootVisible: false,
            autoSync: false,
            root: {
                id: 0,
                text: "Inventory",
                expanded: true
            },
            model: 'yasmine.model.TreeItem'
        },
        dateStore: {
            model: 'yasmine.view.xml.builder.tree.Date',
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: '/api/xml/epoch/{xmlId}/',
                paramsAsJson: true
            },
            listeners: {
                load: 'onEpochLoaded'
            }
        }
    },
    formulas: {
        canCreate: function (get) {
            return !get('current.item') || get('current.item').get('nodeType') !== yasmine.NodeTypeEnum.channel;
        },
        canDelete: function (get) {
            return get('current.item') && !get('current.item').get('root');
        },
        canEpoch: function (get) {
            return get('current.item') && !get('current.item').get('root');
        }
    }
});

Ext.define('yasmine.view.xml.builder.tree.Date', {
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
