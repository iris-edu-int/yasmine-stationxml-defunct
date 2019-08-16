Ext.define('yasmine.view.settings.SettingsListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings',
    requires: [
        'Ext.window.Toast'
    ],
    init: function () {
        yasmine.view.settings.Settings.load(0, {
            scope: this,
            success: function (record, operation) {
                this.getViewModel().set('settings', record);
                this.applySettings();
                this.getView().loadRecord(record);
            }
        });
    },
    onSaveClick: function () {
        this.getView().updateRecord();
        var record = this.getView().getRecord();
        if (record.dirty) {
            record.save({
                scope: this,
                success: function() {
                    this.getViewModel().set('settings', record);
                    this.applySettings();
                    Ext.toast({ html: 'Settings saved', align: 't' });
                }
            });
        } else {
            Ext.toast({ html: 'There is nothing to save', align: 't' });
        }
    },
    applySettings: function () {
        var setting = this.getViewModel().get('settings');
        yasmine.utils.SettingsUtil.applySettings(setting);
    }
});
