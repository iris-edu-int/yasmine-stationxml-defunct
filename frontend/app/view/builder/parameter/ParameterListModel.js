Ext.define('imct.view.xml.builder.parameter.ParameterListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.parameter-list',
    requires: ['imct.model.Parameter','imct.NodeTypeEnum'],
    data: {
        nodeId: null,
        nodeType: null,
        selectedAvailableParameter: null,
        theRow: null
    },
    stores: {
        infoStore: {
            model: 'imct.model.Parameter',
            pageSize: 0,
            autoLoad: false,
            autoSync: false,
            remoteFilter: true,
            filters: [{
                property: 'node_inst_id',
                value: '{nodeId}'
            }],
            sorters: [{
                property: 'required',
                direction: 'DESC'
            },{
                property: 'sortIndex',
                direction: 'ASC'
            },{
                property: 'name',
                direction: 'ASC'
            }]
        },
        availableParamsStore: {
            type: 'json',
            proxy: {
                type: 'rest',
                url: '/api/xml/attr/available/{nodeId}'
            },
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            remoteFilter: false,
            autoLoad: false
        }
    },
    formulas: {
        title: function (get){
            var type = get('nodeType');
            if (type === imct.NodeTypeEnum.network) {
                return 'Network Information';
            }
            if (type === imct.NodeTypeEnum.station) {
                return 'Station Information';
            }
            if (type === imct.NodeTypeEnum.channel) {
                return 'Channel Information';
            }
            return 'Please select a node';
        },
        isAvailableParamsEnabled: function (get){
            return get('nodeType') != null;
        }
    }
});
