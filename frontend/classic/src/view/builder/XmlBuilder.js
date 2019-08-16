Ext.define('yasmine.view.xml.builder.XmlBuilder', {
    extend: 'Ext.panel.Panel',
    xtype: 'xmlBuilder',
    requires: [
        'yasmine.view.xml.builder.tree.Tree',
        'yasmine.view.xml.builder.BuilderModel',
        'yasmine.view.xml.builder.BuilderController',
        'yasmine.view.xml.builder.parameter.ParameterList',
        'yasmine.view.xml.builder.children.Children',
        'yasmine.view.xml.builder.menu.Menu'
    ],
    controller: 'builder',
    viewModel: 'builder',
    layout: {
        type: 'border'
    },
    defaults: {
        collapsible: true,
        split: true,
        border: true
    },
    items: [
        {
            xtype: 'children',
            collapsible: false,
            region: 'center'
        },
        {
            xtype: 'parameter-list',
            region: 'east',
            width: '40%'
        }
    ],
    tbar: {
        xtype: 'builder-menu',
        padding: '0 0 0 0',
        margin: '0 0 10 0'
    }
});
