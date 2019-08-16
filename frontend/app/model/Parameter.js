Ext.define('yasmine.model.Parameter', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: '/api/xml/attr/',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
        },
        writer: {
            nameProperty: 'mapping'
        }
    },
    fields: [{
        name: 'id',
        type: 'int',
        persist: false
    },{
        name: 'required',
        type: 'boolean',
        persist: false
    },{
        name: 'sortIndex',
        type: 'int',
        mapping: 'attr_index',
        persist: false
    },{
        name: 'name',
        type: 'string',
        mapping: 'attr_name',
        persist: false
    },{
        name: 'class',
        type: 'string',
        mapping: 'attr_class',
        persist: false
    },{
        name: 'parameterId',
        type: 'int',
        mapping: 'attr_id'
    },{
        name: 'nodeId',
        type: 'int',
        mapping: 'node_inst_id'
    },{
        name: 'node_id',
        type: 'int',
        persist: false
    },{
        name: 'value',
        mapping: 'value_obj',
        convertOnSet: false,
        convert: function (value, record){
            if (record.get('attr_class') == 'yasmine-date-field') {
                if (value) {
                    if (typeof value === 'string') {
                        return Ext.Date.parse(value, yasmine.Globals.DateReadFormat, true);
                    } else if (value instanceof Date) {
                        return value;
                    }
                }
                return null;
            }
            return value
        },
        persist: true
    },{
        name: 'isComplexType',
        convertOnSet: false,
        convert: function (v, record){
            var attr_class = record.get('class')
            return !(attr_class == 'yasmine-text-field' ||
                     attr_class == 'yasmine-longitude-field' ||
                     attr_class == 'yasmine-latitude-field' ||
                     attr_class == 'yasmine-int-field' ||
                     attr_class == 'yasmine-float-field' || attr_class == 'yasmine-date-field')
        }
    }]
});
