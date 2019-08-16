Ext.define('yasmine.view.xml.XmlList', {
    extend: 'Ext.grid.Panel',
    xtype: 'xml-list',
    requires: [
        'Ext.toolbar.Paging',
        'Ext.grid.filters.Filters',
        'yasmine.view.xml.list.XmlListController',
        'yasmine.view.xml.list.XmlListModel'
    ],
    title: 'XML',
    frame: true,
    plugins: 'gridfilters',
    controller: 'xml-list',
    viewModel: 'xml-list',
    bind: {
        selection: '{theRow}',
        store: '{listStore}'
    },
    actions: {
        sell: {
            iconCls: 'fa fa-database'
        }
    },
    viewConfig: {
        loadMask: false
    },
    columns: {
        defaults: {
            flex: 1
        },
        items: [
            { text: 'Name', dataIndex: 'name', filter: { type: 'string' } },
            { text: 'Source', dataIndex: 'source', filter: { type: 'string' } },
            { text: 'Module', dataIndex: 'module', filter: { type: 'list' }, flex: 3 },
            { text: 'Uri', dataIndex: 'uri', filter: { type: 'string' }, flex: 3 },
            { text: 'Sender', dataIndex: 'sender', filter: { type: 'string' } },
            { text: 'Created at', dataIndex: 'created_at', xtype: 'datecolumn', filter: { type: 'date', dateFormat: yasmine.Globals.DatePrintLongFormat  }, format: yasmine.Globals.DatePrintLongFormat },
            { text: 'Updated at', dataIndex: 'updated_at', xtype: 'datecolumn', filter: { type: 'date', dateFormat: yasmine.Globals.DatePrintLongFormat  }, format: yasmine.Globals.DatePrintLongFormat }
        ]
    },
    tbar: [{
        itemId: 'createXmlId',
    	tooltip: 'Create XML',
        iconCls: 'x-fa fa-plus',
        handler: 'onCreateXmlClick'
    }, {
        tooltip: 'Delete XML',
        itemId: 'deleteXmlId',
        iconCls: 'x-fa fa-minus',
        handler: 'onDeleteXmlClick',
        disabled: true,
        bind: {
            disabled: '{!theRow}'
        }
    }, {
        tooltip: 'Edit XML',
        iconCls: 'x-fa fa-pencil',
        handler: 'onEditXmlClick',
        
        disabled: true,
        bind: {
            disabled: '{!theRow}'
        }
    }, '-', {
        tooltip: 'XML Builder',
        iconCls: 'x-fa fa-wrench',
        handler: 'onBuildXmlClick',
        disabled: true,
        bind: {
            disabled: '{!theRow}'
        }
    }, '-', {
        tooltip: 'Import XML',
        iconCls: 'x-fa fa-download',
        handler: 'onImportXmlClick'
    }, {
        tooltip: 'Export as XML',
        iconCls: 'x-fa fa-upload',
        handler: 'onExportXmlClick',
        disabled: true,
        bind: {
            disabled: '{!theRow}'
        }
    }],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },
    listeners: {
        itemdblclick: 'onBuildXmlClick'
    },
    tools:[
        {
            type:'help',
            handler: function() { yasmine.utils.HelpUtil.helpMe('xml_list', 'List of XMLs') }
        }
    ]
});
