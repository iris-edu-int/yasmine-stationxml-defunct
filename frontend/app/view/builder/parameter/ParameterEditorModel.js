Ext.define('yasmine.view.xml.builder.parameter.ParameterEditorModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.parameter-editor',
    data: {
        record: null,
        nodeType: null,
        previewMode: false
    },
    formulas: {
        title: function (get) {
            return `Edit '${get('record').get('name')}'`;
        }
    }
});
