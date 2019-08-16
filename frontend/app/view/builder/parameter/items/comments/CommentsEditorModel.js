Ext.define('yasmine.view.xml.builder.parameter.items.comments.CommentsEditorModel', {
    extend: 'yasmine.view.xml.builder.parameter.ParameterItemEditorModel',
    alias: 'viewmodel.comments-editor',
    data: {
        selectedCommentRow: null
    },
    stores: {
        commentStore: {
            model: 'yasmine.view.xml.builder.parameter.items.comments.Comment',
            data: []
        }
    }
});

Ext.define('yasmine.view.xml.builder.parameter.items.comments.Comment', {
    extend: 'Ext.data.Model',
    fields: [
        { name: '_value', defaultValue: null },
        { name: '_begin_effective_time', defaultValue: null },
        { name: '_end_effective_time', defaultValue: null },
        { name: '_authors', defaultValue: null },
        {
            name: 'beginEffectiveTime',
            persist: false,
            depends: ['_begin_effective_time'],
            convert: function (value, record) {
                var date = record.get('_begin_effective_time');
                return !date ? null : Ext.Date.parse(date, yasmine.Globals.DateReadFormat, true);
            }
        },
        {
            name: 'endEffectiveTime',
            persist: false,
            depends: ['_end_effective_time'],
            convert: function (value, record) {
                var date = record.get('_end_effective_time');
                return !date ? null : Ext.Date.parse(date, yasmine.Globals.DateReadFormat, true);
            }
        }
    ]
});
