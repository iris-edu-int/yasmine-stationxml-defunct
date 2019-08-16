Ext.define('yasmine.view.xml.builder.templates.TemplateViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.template-view',
    data: {
        xmlId: null,
        nodeType: null,
        parentId: null,
        selectedItem: null
    },
    stores: {
        templateStore: {
            model: 'yasmine.view.xml.builder.templates.Template',
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: '/api/xml/template/{nodeType}/',
                paramsAsJson: true
            }
        }
    },
    formulas: {
        title: function (get) {
            var type = get('nodeType');
            if (type === yasmine.NodeTypeEnum.network) {
                return 'Network\'s Templates';
            }
            if (type === yasmine.NodeTypeEnum.station) {
                return 'Station\'s Templates';
            }
            if (type === yasmine.NodeTypeEnum.channel) {
                return 'Channel\'s Templates';
            }
        },
        canSave: function (get) {
            return get('selectedItem') != null;
        },
        canDelete: function (get) {
            return get('selectedItem') != null && get('selectedItem').id !== 0;
        }
    }
});

Ext.define('yasmine.view.xml.builder.templates.Template', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', convert: function (v, record) {
            var desc = record.get('description');
            return desc ? desc : yasmine.Globals.NotApplicable
        } },
        { name: 'start', type: 'date', dateFormat: yasmine.Globals.DateReadFormat },
        { name: 'end', type: 'date', dateFormat: yasmine.Globals.DateReadFormat }
    ]
});
