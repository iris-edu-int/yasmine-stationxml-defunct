Ext.define('yasmine.view.xml.builder.parameter.items.comments.CommentsEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'yasmine-comments-field',
    requires: ['yasmine.view.xml.builder.parameter.items.comments.CommentsEditorModel','yasmine.view.xml.builder.parameter.items.comments.CommentsEditorController'],
    viewModel: 'comments-editor',
    controller: 'comments-editor',
    items: [{
        bind: {
            html: '{validationErrors}',
            hidden: '{!canShowValidationError}'
        },
        hidden: true,
        width: '100%',
        padding: '5 8 5 8'
    },{
        xtype: 'grid',
        width: 800,
        height: 400,
        style: 'border: solid #d0d0d0 1px',
        bind: {
            store: '{commentStore}',
            selection: '{selectedCommentRow}'
        },
        columns: [{
            header: 'Comment',
            dataIndex: '_value',
            emptyCellText: yasmine.Globals.NotApplicable,
            flex: 1
        },{
            header: 'Effective Start Date',
            dataIndex: 'beginEffectiveTime',
            xtype: 'datecolumn',
            format: yasmine.Globals.DatePrintLongFormat,
            emptyCellText: yasmine.Globals.NotApplicable,
            flex: 1
        },{
            header: 'Effective End Date',
            dataIndex: 'endEffectiveTime',
            xtype: 'datecolumn',
            format: yasmine.Globals.DatePrintLongFormat,
            emptyCellText: yasmine.Globals.NotApplicable,
            flex: 1
        },{
            header: 'Authors',
            dataIndex: '_authors',
            flex: 1,
            emptyCellText: yasmine.Globals.NotApplicable,
            renderer: function (value){
                if (!value ||
                    value.length === 0) {
                    return yasmine.Globals.NotApplicable;
                }
                var result = [];
                value.forEach(function (person){
                    if (person._names &&
                        person._names.length > 0) {
                        result = result.concat(person._names);
                    }
                    if (person._agencies &&
                        person._agencies.length > 0) {
                        result = result.concat(person._agencies);
                    }
                    if (person._emails &&
                        person._emails.length > 0) {
                        result = result.concat(person._emails);
                    }
                });
                return result.join('; ');
            }
        }],
        listeners: {
            itemdblclick: 'onEditClick'
        },
        tbar: [{
            iconCls: 'x-fa fa-plus',
            tooltip: 'Add Comment',
            handler: 'onAddClick'
        },{
            iconCls: 'x-fa fa-minus',
            tooltip: 'Delete Comment',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!selectedCommentRow}'
            }
        },{
            iconCls: 'x-fa fa-pencil',
            tooltip: 'Edit Comment',
            handler: 'onEditClick',
            disabled: true,
            bind: {
                disabled: '{!selectedCommentRow}'
            }
        }]
    }]
});
