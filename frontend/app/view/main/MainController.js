Ext.define('imct.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    routes: {
        'xmls': { action: 'onXml' },
        'xml-builder/:id': { action: 'onXmlBuilder', conditions: { ':id': '([0-9]+)' } },
        'settings': { action: 'onSettings' }
    },
    init: function () {

    },
    onXml: function () {
        Ext.suspendLayouts();

        var settingsContainer = this.lookupReference('settingsContainer');
        settingsContainer.removeAll(true, true);
        var xmlContainer = this.lookupReference('xmlContainer');
        xmlContainer.removeAll(true, true);

        xmlContainer.add([Ext.create({ xtype: 'xml-list' })]);
        this.getView().suspendEvents();
        this.getView().setActiveTab(xmlContainer);
        this.getView().resumeEvents();

        Ext.resumeLayouts(true);
    },
    onSettings: function () {
        Ext.suspendLayouts();

        var xmlContainer = this.lookupReference('xmlContainer');
        xmlContainer.removeAll(true, true);
        var settingsContainer = this.lookupReference('settingsContainer');
        settingsContainer.removeAll(true, true);

        settingsContainer.add([Ext.create({ xtype: 'settings-list' })]);

        this.getView().suspendEvents();
        this.getView().setActiveTab(settingsContainer);
        this.getView().resumeEvents();

        Ext.resumeLayouts(true);
    },
    onXmlBuilder: function (id) {
        Ext.suspendLayouts();

        var xmlContainer = this.lookupReference('xmlContainer');
        xmlContainer.removeAll(true, true);
        var settingsContainer = this.lookupReference('settingsContainer');
        settingsContainer.removeAll(true, true);

        var xmlBuilder = Ext.create({ xtype: 'xmlBuilder' });
        xmlBuilder.getViewModel().set('xmlId', id);
        xmlContainer.add(xmlBuilder);
        this.getView().suspendEvents();
        this.getView().setActiveTab(xmlContainer);
        this.getView().resumeEvents();

        Ext.resumeLayouts(true);
    },
    onTabActivated: function (panel, tab) {
        if (tab.reference === 'settingsContainer') {
            this.redirectTo('settings');
        } else if (tab.reference === 'xmlContainer') {
            this.redirectTo('xmls');
        }
    },
    onXmlTabClick: function () {
        this.redirectTo('xmls');
    },
    onSettingsTabClick: function () {
        this.redirectTo('settings');
    }
});
