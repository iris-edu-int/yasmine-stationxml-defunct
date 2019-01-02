Ext.define('imct.view.xml.builder.children.Children', {
    extend: 'Ext.panel.Panel',
    xtype: 'children',
    requires: [
        'Ext.view.View',
        'imct.view.xml.builder.children.ChildrenModel',
        'imct.view.xml.builder.children.ChildrenController'
    ],
    viewModel: 'children',
    controller: 'children',
    bind: {
        title: '{xml.name}<a style="margin-left: 7px; margin-right: 7px; " class="x-fa fa-chevron-right" aria-hidden="true"></a>{title}'
    },
    layout: 'fit',
    bodyPadding: 5,
    bodyBorder: true,
    tbar: [
        {
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            tooltip: 'Create from Template',
            handler: 'onAddClick'
        },
        {
            xtype: 'button',
            iconCls: 'x-fa fa-magic',
            tooltip: 'Create using wizard',
            bind:{
                disabled: '{!canCreateChannel}'
            },
            handler: 'onWizardClick'
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-delicious',
            tooltip: 'Make a Template',
            handler: 'onTemplateClick',
            disabled: true,
            bind: {
                disabled: '{!canTemplate}'
            }
        },{
            xtype: 'button',
            iconCls: 'x-fa fa-minus',
            tooltip: 'Delete',
            handler: 'onDeleteClick',
            disabled: true,
            bind: {
                disabled: '{!canDelete}'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-clock-o',
            tooltip: 'Epoch',
            handler: 'onEpochClick',
            disabled: true,
            bind: {
                disabled: '{!canEpoch}'
            }
        },
        '->',
        {
            xtype: 'combobox',
            width: 235,
            bind: {
                store: '{epochStore}',
                selection: '{selectedEpoch}'
            },
            triggers: {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: 'onEpochClearClick'
                }
            },
            displayField: 'dateString',
            fieldLabel: 'Epoch',
            editable: false,
            labelWidth: 40,
            listeners: {
                select: 'onEpochSelect'
            },
            emptyText: 'Current'
        }
    ],
    items: [
        {
            xtype: 'dataview',
            reference: 'cardsview',
            loadMask: false,
            bind: {
                store: '{childrenStore}',
                selection: '{selectedItem}'
            },
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="phone  x-unselectable" style="border-color: {locationColor}',
                '<tpl if="last">',
                '; clear: both;',
                '</tpl>',
                '<tpl if="type == \'back\'">',
                '; height: 68px;',
                '</tpl>',                
                '">',
                    '<tpl if="type == \'node\'">',
                        '<div style="text-align: end;"><span style="color: black;font-weight: 500;">{nodeTypeName}</span> <i class="fa {iconCls}" aria-hidden="true"></i></div>',
                        '<div><b>Code: </b> <span style="color: black;">{name}</span></div>',
                        '<div><b>Start: </b> <span style="color: black;">{start:date(IMCT.Globals.DatePrintShortFormat)}</span></div>',
                        '<div><b>End: </b> <span style="color: black;">{end:date(IMCT.Globals.DatePrintShortFormat)}</span></div>',
                    '</tpl>',
                    '<tpl if="nodeType == 1">',
                        '<div><b>Description: </b><span style="color: black;">{description}</span></div>',
                    '</tpl>',                    
                    '<tpl if="nodeType == 2">',
                        '<div><b>Longitude: </b> <span style="color: black;">{longitude}</span></div>',
                        '<div><b>Latitude: </b> <span style="color: black;">{latitude}</span></div>',
                        '<div><b>Site: </b> <span style="color: black;">{site}</span></div>',
                    '</tpl>',
                    '<tpl if="nodeType == 3">',
                        '<div><b>Sample Rate: </b> <span style="color: black;">{sampleRate}</span></div>',
                        '<div><b>Sensor: </b> <span style="color: black;">{sensor}</span></div>',
                    '</tpl>',                    
                    '<tpl if="type == \'back\'">',
                        '<i class="fa fa-chevron-circle-left fa-5x" style="color: #5fa2dd; padding-left: 37px;" aria-hidden="true"></i>',
                    '</tpl>',                    
                '</div>',
                '</tpl>'
            ),
            id: 'phones',
            scrollable: true,
            itemSelector: 'div.phone',
            listeners: {
                beforeselect: 'onBeforeSelect',
                itemclick: 'onItemClick',
                itemdblclick: 'onItemDblClick',
                selectionchange: 'onItemSelectionChange',
                itemkeyup: 'onItemKeyUp'
            }
        }
    ],
    tools:[
        {
            type:'help',
            handler: function() { imct.utils.HelpUtil.helpMe('children', 'Node Navigation') }
        }
    ]
});
