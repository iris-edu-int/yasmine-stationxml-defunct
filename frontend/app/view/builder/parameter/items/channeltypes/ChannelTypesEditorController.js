Ext.define('yasmine.view.xml.builder.parameter.items.channeltypes.ChannelTypesEditorController', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorController',
    alias: 'controller.channel-types-editor',
    initData: function () {
        var record = this.getViewModel().get('record');
        if (record.get('value')) {
            var store = this.getViewModel().getStore('channelTypeStore');
            record.get('value').forEach(function (value) {
                var date = new yasmine.view.xml.builder.parameter.items.channeltypes.ChannelType();
                date.set('value', value);
                date.modified = {};
                store.add(date);
            })
        }
    },
    fillRecord: function () {
        var record = this.getViewModel().get('record');
        var store = this.getViewModel().getStore('channelTypeStore');
        var values = store.getData().items.map(function (item) {
            return item.getData().value;
        });

        record.set('value', values);
    },
    onAddClick: function () {
        var record = new yasmine.view.xml.builder.parameter.items.channeltypes.ChannelType();
        var store = this.getViewModel().getStore('channelTypeStore');
        store.insert(0, record);

        var grid = this.lookupReference('channeltypegrid');
        grid.findPlugin('rowediting').startEdit(record, 0);
    },
    onDeleteClick: function () {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().drop();
            }
        }, this);
    },
    onEditClick: function () {
        var grid = this.lookupReference('channeltypegrid');
        grid.findPlugin('rowediting').startEdit(this.getSelectedRecord(), 0);
    },
    getSelectedRecord: function () {
        return this.getViewModel().get('channelTypeSelectedRow');
    }
});
