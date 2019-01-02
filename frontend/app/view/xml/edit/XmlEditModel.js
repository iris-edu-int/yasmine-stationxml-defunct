Ext.define('imct.view.xml.edit.XmlEditModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.xml-edit',
    data: {
        model: null
    },

    formulas: {
        title: function (get) {
        	var record = get('model');
            return record ==null || record.phantom ? 'Create XML' : 'Edit XML';
        }
    }
});
