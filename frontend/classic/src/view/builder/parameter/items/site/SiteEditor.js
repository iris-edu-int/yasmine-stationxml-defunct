Ext.define('imct.view.xml.builder.parameter.items.site.SiteEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'imct-site-field',
    requires: [
        'imct.view.xml.builder.parameter.items.site.SiteEditorModel',
        'imct.view.xml.builder.parameter.items.site.SiteEditorController'
    ],
    viewModel: 'site-editor',
    controller: 'site-editor',
    items: [
        {
            bind: {
                html: '{validationErrors}',
                hidden: '{!canShowValidationError}'
            },
            hidden: true,
            width: '100%',
            padding: '0 0 5 0'
        },
        { xtype: 'textfield', fieldLabel: 'Name', bind: '{name}', itemId: 'focusItem' },
        { xtype: 'textarea', fieldLabel: 'Description', bind: '{description}' },
        { xtype: 'textfield', fieldLabel: 'Town', bind: '{town}', anchor: '100%' },
        { xtype: 'textfield', fieldLabel: 'County', bind: '{county}' },
        { xtype: 'textfield', fieldLabel: 'Region', bind: '{region}' },
        { xtype: 'textfield', fieldLabel: 'Country', bind: '{country}' }
    ]
});
