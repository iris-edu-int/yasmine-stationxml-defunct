Ext.define('imct.view.xml.builder.parameter.ParameterEditor', {
    extend: 'Ext.window.Window',
    xtype: 'parameter-editor',
    requires: ['imct.view.xml.builder.parameter.ParameterEditorModel','imct.view.xml.builder.parameter.ParameterEditorController'],
    controller: 'parameter-editor',
    viewModel: 'parameter-editor',
    bind: {
        title: '{title}'
    },
    bodyPadding: 20,
    modal: true,
    frame: true,
    closable: false,
    scrollable: true,
    defaultFocus: 'focusItem',
    defaultButton: 'saveButton',
    listeners: {
        afterlayout: function (){
            var viewSize = Ext.getBody().getViewSize();
            var height = viewSize.height;
            if (this.getHeight() > height) {
                this.setHeight(height);
            };
            var width = viewSize.width;
            if (this.getWidth() > width) {
                this.setWidth(width);
            }
            this.center();
        }
    },
    buttons: [{
        text: 'Edit',
        iconCls: 'x-fa fa-pencil',
        bind: {
            hidden: '{!previewMode}'
        },
        handler: 'editButton'
    },{
        text: 'Save',
        reference: 'saveButton',
        iconCls: 'x-fa fa-floppy-o',
        bind: {
            hidden: '{previewMode}'
        },
        handler: 'onSaveClick'
    },{
        text: 'Cancel',
        iconCls: 'x-fa fa-ban',
        handler: 'onCancelClick'
    }],
    tools: [{
        type: 'help',
        handler: 'onHelpClick'
    },{
        type: 'close',
        handler: 'onCancelClick'
    }]
});
