Ext.define('imct.view.xml.builder.wizard.WizardCreateChannelModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.wizard-create-channel',
    requires: ['imct.view.xml.builder.parameter.items.text.TextEditor'],
    data: {
        activeIndex: 0,
        lastStepIndex: 4,
        guessCode: null,
        codePrefix: '',
        orient: null,        
        channelInfo: null,
        sensorSelection: null,
        dataloggerSelection: null
    },
    stores: {
        sensorStore: {
            type: 'tree',
            model: 'imct.view.xml.builder.parameter.items.channelresponse.Response',
            proxy: {
                type: 'rest',
                url: '/api/nrl/sensors/',
                paramsAsJson: true
            },
            autoLoad: false,
            root: {
                id: 0,
                text: '<b>sensor</b>'
            }
        },
        dataloggerStore: {
            type: 'tree',
            model: 'imct.view.xml.builder.parameter.items.channelresponse.Response',
            proxy: {
                type: 'rest',
                url: '/api/nrl/dataloggers/',
                paramsAsJson: true
            },
            autoLoad: false,
            root: {
                id: 0,
                text: '<b>datalogger</b>'
            }
        }        
    },
    formulas: {
        oneChannel:{
            bind: {
                orient: '{orient}',
                guessCode: '{guessCode}'
            },
            get: function (data){
                return data.orient == 3 || data.orient == null
            }
        },
        title: {
            bind: '{activeIndex}',
            get: function (activeIndex){
                return activeIndex + 1
            }
        },
        hiddenShowNext: {
            bind: {
                activeIndex: '{activeIndex}',
                lastStepIndex: '{lastStepIndex}'
            },
            get: function (data){
                if (data.activeIndex == data.lastStepIndex) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        hiddenShowPrevious: {
            bind: '{activeIndex}',
            get: function (activeIndex){
                if (activeIndex == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        hiddenCreate: {
            bind: {
                activeIndex: '{activeIndex}',
                lastStepIndex: '{lastStepIndex}'
            },
            get: function (data){
                if (data.activeIndex != data.lastStepIndex) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
});


function makeChannelWizardConvert(name){
    return function defaultChannelWizardConvert (value){
        var name = name || this.name
        if (name == 'start_date'){
            value = Ext.Date.parse(value, IMCT.Globals.DateReadFormat, true);
        }
        return new Ext.data.Model({
            name: name || this.name,
            value: value,
            only_critical: true,
            node_id: imct.NodeTypeEnum.channel
        });
    }
}

function defaultChannelWizardSerialize(value){
    if (value) {
        return value.get('value')
    } 
}

Ext.define('imct.view.xml.builder.wizard.ChannelCreation', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'rest',
        url: '/api/wizard/channel/',
        writer: {
            type: 'json',
            writeAllFields: true
        }
    },
    fields: [{
        name: 'id',
        type: 'int'
    },{
        name: 'code1',
        convert: makeChannelWizardConvert('code'),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'code2',
        convert: makeChannelWizardConvert('code'),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'code3',
        convert: makeChannelWizardConvert('code'),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'chn_code2',
        type: 'string'
    },{
        name: 'chn_code3',
        type: 'string'
    },{
        name: 'start_date',
        convert: makeChannelWizardConvert(),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'location_code',
        convert: makeChannelWizardConvert(),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'latitude',
        convert: makeChannelWizardConvert(),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'longitude',
        convert: makeChannelWizardConvert(),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'elevation',
        convert: makeChannelWizardConvert(),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'depth',
        convert: makeChannelWizardConvert(),
        serialize: defaultChannelWizardSerialize
    },{
        name: 'azimuth1',
        convert: makeChannelWizardConvert('azimuth'),
        serialize: defaultChannelWizardSerialize        
    },{
        name: 'azimuth2',
        convert: makeChannelWizardConvert('azimuth'),
        serialize: defaultChannelWizardSerialize        
    },{
        name: 'azimuth3',
        convert: makeChannelWizardConvert('azimuth'),
        serialize: defaultChannelWizardSerialize        
    },{
        name: 'dip1',
        convert: makeChannelWizardConvert('dip'),
        serialize: defaultChannelWizardSerialize        
    },{
        name: 'dip2',
        convert: makeChannelWizardConvert('dip'),
        serialize: defaultChannelWizardSerialize        
    },{
        name: 'dip3',
        convert: makeChannelWizardConvert('dip'),
        serialize: defaultChannelWizardSerialize        
    },{
        name: 'sensorKeys'
    },{
        name: 'dataloggerKeys'
    }]
});
