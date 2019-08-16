Ext.define('yasmine.view.xml.builder.templates.TemplateView', {
    extend: 'Ext.window.Window',
    xtype: 'template-view',
    requires: [
        'yasmine.view.xml.builder.templates.TemplateViewController',
        'yasmine.view.xml.builder.templates.TemplateViewModel'
    ],
    controller: 'template-view',
    viewModel: 'template-view',
    bind: {
        title: '{title}'
    },
    modal: true,
    frame: true,
    closable: false,
    bodyPadding: 5,
    bodyBorder: true,
    items: [
        {
            xtype: 'dataview',
            loadMask: false,
            height: 400,
            width: 620,
            bind: {
                store: '{templateStore}',
                selection: '{selectedItem}'
            },
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="phone  x-unselectable" >',
                    '<div><b>Code: </b> <span style="color: black;">{name}</span></div>',
                    '<div><b>Description: </b><span style="color: black;">{description}</span></div>',              
                '</div>',
                '</tpl>'
            ),
            id: 'phones-template',
            scrollable: true,
            itemSelector: 'div.phone'
        }
    ],
    buttons: [{
        text: 'Save',
        iconCls: 'x-fa fa-floppy-o',
        handler: 'onSaveClick',
        disabled: true,
        bind: {
            disabled: '{!canSave}'
        }
    }, {
        text: 'Cancel',
        iconCls: 'x-fa fa-ban',
        handler: 'onCancelClick'
    }],
    tools:[
        {
            type:'help',
            handler: function() { yasmine.utils.HelpUtil.helpMe('templates', 'Templates') }
        },
        {
            type:'close',
            handler: 'onCancelClick'
        }
    ],
    tbar: [
        {
            xtype: 'button',
            iconCls: 'x-fa fa-minus',
            tooltip: 'Delete',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!canDelete}'
            }
        }
    ]
});
