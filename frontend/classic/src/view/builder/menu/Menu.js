Ext.define('imct.view.xml.builder.menu.Menu', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'imct.view.xml.builder.menu.MenuController',
        'imct.view.xml.builder.menu.MenuModel'
    ],
    xtype: 'builder-menu',
    style: 'background-color: rgb(236, 236, 236)',
    controller: 'menu',
    viewModel: 'menu',
    items: [
        {
            xtype: 'segmentedbutton',
            allowToggle: false,
            items: [{
                text: 'File',
                menu: [
                    { text: 'Export as XML', iconCls: 'x-fa fa-upload', handler: 'onExportXmlClick' },
                    { text: 'Validate XML', iconCls: 'x-fa fa-cogs', handler: 'onValidateXmlClick' }
                ]
            }]
        }
    ]
});
