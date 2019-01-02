Ext.define('imct.model.TreeItem', {
    extend: 'Ext.data.TreeModel',
    requires: ['imct.NodeTypeEnum'],
    proxy: {
        reader: {
            rootProperty: "children"
        }
    },
    fields: [
        { name: 'name', type: 'string', persist: false },
        { name: 'index', type: 'int', persist: false },
        { name: 'parentId', type: 'int', persist: false },
        { name: 'text', type: 'string', persist: false, mapping: 'name' },
        { name: 'leaf', type: 'boolean', persist: false },
        { name: 'nodeType', type: 'int', persist: false },
        {
            name: 'iconCls', type: 'string', persist: false,
            depends: ['nodeType'],
            convert: function(value, record) { 
                if (record.get('root')) {
                    return 'fa-file-code-o';
                }
                return imct.utils.NodeTypeConverter.toIcon(record.get('nodeType')) 
            }
        }
    ]
});
