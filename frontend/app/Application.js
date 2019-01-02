/**
 * The main application class. An instance of this class is created by app.js
 * when it calls Ext.application(). This is the ideal place to handle
 * application launch and initialization details.
 */
Ext.ns('IMCT.Globals');
IMCT.Globals.NotApplicable = 'N/A';
IMCT.Globals.DatePrintLongFormat = 'Y-m-d H:i:s';
IMCT.Globals.DatePrintShortFormat = 'Y-m-d';
IMCT.Globals.DateReadFormat = 'd/m/Y H:i:s';
IMCT.Globals.Settings = null;
IMCT.Globals.LocationColorScale = null; // Very ugly solution. TODO: find a better way to implement it

Ext.util.JSON.encodeDate = function (o){
    return '"' + Ext.Date.format(o, IMCT.Globals.DateReadFormat) + '"'
}

Ext.define('imct.Application', {
    extend: 'Ext.app.Application',
    name: 'imct',
    requires: ['Ext.grid.plugin.RowEditing','imct.view.settings.Settings','imct.utils.SettingsUtil'],
    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    defaultToken: 'xmls',
    stores: [
    // TODO: add global / shared stores here
    ],
    init: function (){
        Ext.Ajax.setTimeout(120000);
        Ext.Ajax.on('requestexception', function (conn, response, options){
            var message;
            try {
                message = JSON.parse(response.responseText).data;
            } catch (error) {
                message = 'Please try again or contact your administrator.'
            }
            Ext.MessageBox.show({
                title: 'An error occurred',
                msg: message,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox['ERROR']
            });
        });
        Ext.Error.handle = function (err){
            Ext.MessageBox.show({
                title: 'An error occurred',
                msg: 'Please try again or contact your administrator.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox['ERROR']
            });
        }
        var requestCounter = 0;
        Ext.Ajax.on('beforerequest', function (){
            if (requestCounter === 0) {
                var splashscreen = Ext.getBody().mask('Loading...');
                splashscreen.dom.style.zIndex = '99999';
                splashscreen.show({
                    delay: 700
                });
            }
            requestCounter++;
        }, this);
        Ext.Ajax.on('requestcomplete', function (){
            requestCounter--;
            if (requestCounter === 0) {
                Ext.getBody().unmask();
            }
        }, this);
        Ext.Ajax.on('requestexception', function (){
            requestCounter--;
            if (requestCounter === 0) {
                Ext.getBody().unmask();
            }
        }, this);
        imct.view.settings.Settings.load(0, {
            scope: this,
            success: function (record, operation){
                imct.utils.SettingsUtil.applySettings(record);
            }
        });
    },
    launch: function (){
        Ext.define('Override.form.field.VTypes', {
            override: 'Ext.form.field.VTypes',
            phoneNumber: function (value){
                return this.phoneNumberRe.test(value);
            },
            phoneNumberRe: /[0-9]+-[0-9]+/i,
            phoneNumberText: 'Not a valid phone number. Must be in the form "[0-9]+-[0-9]+", e.g. 1234-5678',
            phoneNumberMask: /[\d\s-\d\s]/i
        });
    },
    onAppUpdate: function (){
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?', function (choice){
            if (choice === 'yes') {
                window.location.reload();
            }
        });
    }
});
