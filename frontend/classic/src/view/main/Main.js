Ext.define('yasmine.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'yasmine.view.main.MainController',
        'yasmine.view.main.MainModel'
    ],
    controller: 'main',
    viewModel: 'main',
    ui: 'navigation',
    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,
    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                html: '<div>{name}</div><div style="font-size: 10px;margin-top: -11px;padding-left: 1px;">v. {version}</div>'
            },
            flex: 0
        },
        iconCls: 'fa fa-cubes'
    },
    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },
    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },
    defaults: {
        bodyPadding: 10,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },
    activeTab: null,
    listeners: {
        tabchange: 'onTabActivated'
    },
    items: [{
        title: 'XMLs',
        iconCls: 'fa fa-database',
        layout: 'fit',
        reference: 'xmlContainer',
        tabConfig: {
            listeners: {
                click: 'onXmlTabClick'
            }
        }
    }, {
        title: 'Settings',
        iconCls: 'fa-cog',
        layout: 'fit',
        reference: 'settingsContainer',
        tabConfig: {
            listeners: {
                click: 'onSettingsTabClick'
            }
        }
    }]
});
