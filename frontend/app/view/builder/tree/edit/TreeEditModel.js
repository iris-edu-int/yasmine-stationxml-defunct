Ext.define('imct.view.xml.builder.tree.edit.TreeEditModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tree-edit',
    data: {
        model: null,
        xmlId: null
    },
    formulas: {
        title: function (get) {
            var nodeName = imct.utils.NodeTypeConverter.toString(get('model').get('nodeType'));

            return get('model').phantom ? `Create ${nodeName}` : `Edit ${nodeName}`;
        }
    }
});
