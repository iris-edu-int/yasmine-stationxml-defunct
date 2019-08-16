Ext.define('yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReferencesEditorController', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorController',
    alias: 'controller.external-references-editor',
    initData: function () {
        var record = this.getViewModel().get('record');
        if (record.get('value')) {
            var store = this.getViewModel().getStore('dataStore');
            record.get('value').forEach(function (reference) {
                store.add(reference);
            })
        }
    },
    fillRecord: function () {
        var record = this.getViewModel().get('record');
        var references = [];
        var store = this.getViewModel().getStore('dataStore');
        store.getData().items.forEach(function (reference) {
            references.push({
                uri: reference.data.uri,
                description: reference.data.description,
                'py/object': 'obspy.core.inventory.util.ExternalReference'
            });
        })

        record.set('value', references);
    },
    onAddClick: function () {
        var record = new yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReference();
        var store = this.getViewModel().getStore('dataStore');
        store.insert(0, record);

        var grid = this.lookupReference('referencegrid');
        grid.findPlugin('rowediting').startEdit(record, 0);
    },
    onDeleteClick: function () {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().drop();
            }
        }, this);
    },
    getSelectedRecord: function () {
        return this.lookupReference('referencegrid').getSelection()[0];
    }
});
