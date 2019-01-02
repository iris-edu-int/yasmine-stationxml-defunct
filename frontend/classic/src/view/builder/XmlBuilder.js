Ext.define('imct.view.xml.builder.XmlBuilder', {
    extend: 'Ext.panel.Panel',
    xtype: 'xmlBuilder',
    requires: [
        'imct.view.xml.builder.tree.Tree',
        'imct.view.xml.builder.BuilderModel',
        'imct.view.xml.builder.BuilderController',
        'imct.view.xml.builder.parameter.ParameterList',
        'imct.view.xml.builder.children.Children',
        'imct.view.xml.builder.menu.Menu'
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
