Ext.define('imct.model.Xml', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: '/api/xml/',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
        }
    },
    fields: [
        { name: 'name', type: 'string', persist: true },
        { name: 'source', type: 'string', persist: true },
        { name: 'module', type: 'string', persist: true },
        { name: 'uri', type: 'string', persist: true },
        { name: 'sender', type: 'string', persist: true },
        { name: 'updated_at', type: 'date', persist: false, dateFormat: 'd/m/Y H:i:s'},
        { name: 'created_at', type: 'date', persist: false, dateFormat: 'd/m/Y H:i:s'}
    ],
    validators: {
        name: { type: 'presence', allowEmpty: false },
        source: { type: 'presence', allowEmpty: false },
        module: { type: 'presence', allowEmpty: false },
        uri: { type: 'presence', allowEmpty: false },
        sender: { type: 'presence', allowEmpty: false }
    }
});
