Ext.define('yasmine.view.xml.builder.parameter.items.comments.CommentsEditorController', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorController',
    alias: 'controller.comments-editor',
    listen: {
        controller: {
            '#comments-editor-form-controller': {
                commentUpdated: 'onCommentUpdated'
            }
        }
    },
    initData: function () {
        var value = this.getViewModel().get('record').get('value');
        if (!value) {
            return;
        }

        var store = this.getViewModel().getStore('commentStore');
        value.forEach(function (item) {
            var comment = new yasmine.view.xml.builder.parameter.items.comments.Comment();
            comment.set('_id', item._id)
            comment.set('_value', item._value)
            comment.set('_begin_effective_time', item._begin_effective_time)
            comment.set('_end_effective_time', item._end_effective_time)
            comment.set('_authors', item._authors)
            comment.modified = {};
            store.insert(0, comment);
        });
    },
    fillRecord: function () {
        var record = this.getViewModel().get('record');
        var comments = this.getViewModel().getStore('commentStore').getData().items.map(function (item) {
            var data = item.getData();
            return {
                'py/object': 'obspy.core.inventory.util.Comment',
                id: data._id,
                value: data._value,
                begin_effective_time: data._begin_effective_time,
                end_effective_time: data._end_effective_time,
                authors: data._authors
            };
        });

        record.set('value', comments);
    },
    onCommentUpdated: function (record) {
        var store = this.getViewModel().getStore('commentStore');
        store.insert(0, record);
    },
    onAddClick: function () {
        this.showEditForm(new yasmine.view.xml.builder.parameter.items.comments.Comment());
    },
    onEditClick: function () {
        this.showEditForm(this.getSelectedRecord());
    },
    onDeleteClick: function () {
        Ext.MessageBox.confirm('Confirm', `Are you sure you want to delete?`, function (btn) {
            if (btn === 'yes') {
                this.getSelectedRecord().drop();
            }
        }, this);
    },
    getSelectedRecord: function () {
        return this.getViewModel().get('selectedCommentRow');
    },
    showEditForm: function (record) {
        var form = Ext.create({ xtype: 'comments-editor-form' });
        form.getController().initData(record);
        form.show();
    }
});
