Ext.define('yasmine.view.xml.builder.parameter.ParameterEditorExt', {
    extend: 'Ext.window.Window',
    xtype: 'parameter-editor-ext',
    requires: ['yasmine.view.xml.builder.parameter.ParameterEditorModel','yasmine.view.xml.builder.parameter.ParameterEditorControllerExt'],
    controller: 'parameter-editor-ext',
    viewModel: 'parameter-editor',
    bind: {
        title: '{title}'
    },
    modal: true,
    frame: true,
    closable: false,
    scrollable: true,
    defaultFocus: 'focusItem',
    defaultButton: 'saveButton',
    items: [{
        xtype: 'form',
        bodyPadding: 20,
        items: [{
            boxLabel: 'Apply to channels',
            bind: '{station__spread_to_channels}',
            xtype: 'checkbox'
        }],
        buttons: [{
            text: 'Save',
            formBind: true,
            reference: 'saveButton',
            iconCls: 'x-fa fa-floppy-o',
            handler: 'onSaveClick'
        },{
            text: 'Cancel',
            iconCls: 'x-fa fa-ban',
            handler: 'onCancelClick'
        }]     
    }],
    tools: [{
        type: 'help',
        handler: 'onHelpClick'
    },{
        type: 'close',
        handler: 'onCancelClick'
    }]       
});
