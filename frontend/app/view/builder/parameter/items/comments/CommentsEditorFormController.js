Ext.define('imct.view.xml.builder.parameter.items.comments.CommentsEditorFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.comments-editor-form',
    id: 'comments-editor-form-controller', // Required for event listening
    initData: function (record) {
        this.getViewModel().set('record', record);
        this.getViewModel().set('id', (record.get('_id') ? record.get('_id') : 0));
        this.getViewModel().set('value', record.get('_value'));
        this.getViewModel().set('beginEffectiveTime', Ext.Date.parse(record.get('_begin_effective_time'), IMCT.Globals.DateReadFormat, true));
        this.getViewModel().set('endEffectiveTime', Ext.Date.parse(record.get('_end_effective_time'), IMCT.Globals.DateReadFormat, true));

        var authors = record.get('_authors');
        if (authors) {
            var authorGrid = this.lookupReference('person-list');
            authorGrid.getController().initData(authors);
        }
    },
    onSaveClick: function () {
        var record = this.getViewModel().get('record');
        record.set('_id', this.getViewModel().get('id'));
        record.set('_value', this.getViewModel().get('value'));
        record.set('_begin_effective_time', Ext.Date.format(this.getViewModel().get('beginEffectiveTime'), IMCT.Globals.DateReadFormat));
        record.set('_end_effective_time', Ext.Date.format(this.getViewModel().get('endEffectiveTime'), IMCT.Globals.DateReadFormat));
        record.set('_authors', this.lookupReference('person-list').getController().getData());

        this.fireEvent('commentUpdated', record);
        this.closeView();
    },
    onCancelClick: function () {
        this.closeView();
    }
});
