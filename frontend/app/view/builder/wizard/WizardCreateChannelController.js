Ext.define('imct.view.xml.builder.wizard.WizardCreateChannelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizard-create-channel',
    onCancelClick: function (){
        this.getView().close();
    },
    activateItem: function (delta){
        var me = this;
        var view = this.getView();
        var viewModel = this.getViewModel();
        var l = view.getLayout();
        var activeIndex = viewModel.get('activeIndex');
        var channelInfo = viewModel.get('channelInfo')
        
        activeIndex = activeIndex + delta;
        
        if (activeIndex == 1 && delta > 0) {
            var sensorStore = this.getStore('sensorStore')
            if (sensorStore.loadCount == 0) {
                sensorStore.load({
                    callback: function (records, store){
                        var sensorsCmp = me.lookupReference('sensorsCmp');
                        sensorsCmp._needsSync = true
                        sensorsCmp.updateSelection(store.node, store.node);
                        sensorsCmp.updateLayout()
                    }
                })
            }
            var dataloggerStore = this.getStore('dataloggerStore')
            if (dataloggerStore.loadCount == 0) {
                dataloggerStore.load({
                    callback: function (records, store){
                        var dataloggerCmp = me.lookupReference('dataloggerCmp');
                        dataloggerCmp._needsSync = true
                        dataloggerCmp.updateSelection(store.node, store.node);
                        dataloggerCmp.updateLayout()
                    }
                })
            }
            
        } else if (activeIndex == 3) {
            if (delta > 0){
                var sensorKeys = []
                this.buildKeys(viewModel.get('sensorSelection'), sensorKeys);
                var dataloggerKeys = [];
                this.buildKeys(viewModel.get('dataloggerSelection'), dataloggerKeys);
                if (sensorKeys.length>0 && dataloggerKeys.length>0){
                    Ext.Ajax.request({
                        scope: this,
                        jsonData: {sensorKeys: sensorKeys, dataloggerKeys: dataloggerKeys},
                        url: `/api/wizard/guess/code/`,
                        method: 'POST',
                        success: function (response) {
                            var code = response.responseText;
                            var codePrefix = '';
                            if (code.length>1){
                                codePrefix = code.substring(0, 2);              
                            }

                            if (!code.endsWith('Z')){
                                if (codePrefix){
                                    channelInfo.get('code1').set('value', 'BDF')
                                }
                                activeIndex += 1
                            }

                            viewModel.set('guessCode', code)                            
                            viewModel.set('codePrefix', codePrefix)
                            viewModel.set('activeIndex', activeIndex)
                        }
                    });
                    return;
                }else{
                   
                    viewModel.set('guessCode', '')                            
                    viewModel.set('codePrefix', '')     
                    viewModel.set('orient', null)  
                    
                    channelInfo.get('code1').set('value', 'BDF')
                    channelInfo.get('code2').set('value', '')
                    channelInfo.get('code3').set('value', '') 
                    
                    channelInfo.get('dip1').set('value', 0)
                    channelInfo.get('dip2').set('value', 0)
                    channelInfo.get('dip3').set('value', 0)
                    
                    channelInfo.get('azimuth1').set('value', 0)
                    channelInfo.get('azimuth2').set('value', 0)
                    channelInfo.get('azimuth3').set('value', 0) 
                    
                    activeIndex += 1
                }  
            } else {
                var guessCode = viewModel.get('guessCode')
                if (!guessCode || !guessCode.endsWith('Z')){
                    activeIndex -= 1
                }
            }
        } else if (activeIndex == 4) {
            if (delta > 0){
                var orient = viewModel.get('orient');
                var codePrefix = viewModel.get('codePrefix');
                
                if (orient == imct.ChannelOrient.ZNE){
                    channelInfo.get('code1').set('value', codePrefix + 'Z')
                    channelInfo.get('code2').set('value', codePrefix + 'N')
                    channelInfo.get('code3').set('value', codePrefix + 'E')
                    
                    channelInfo.get('dip1').set('value', -90)
                    channelInfo.get('dip2').set('value', 0)
                    channelInfo.get('dip3').set('value', 0)
                    
                    channelInfo.get('azimuth1').set('value', 0)
                    channelInfo.get('azimuth2').set('value', 0)
                    channelInfo.get('azimuth3').set('value', 90)                    
                    
                }else if (orient == imct.ChannelOrient.Z12){
                    channelInfo.get('code1').set('value', codePrefix + 'Z')
                    channelInfo.get('code2').set('value', codePrefix + '1')
                    channelInfo.get('code3').set('value', codePrefix + '2') 
                    
                    channelInfo.get('dip1').set('value', 0)
                    channelInfo.get('dip2').set('value', 0)
                    channelInfo.get('dip3').set('value', 0)
                    
                    channelInfo.get('azimuth1').set('value', 0)
                    channelInfo.get('azimuth2').set('value', 0)
                    channelInfo.get('azimuth3').set('value', 0)                     
                    
                }else if (orient == imct.ChannelOrient.Z){
                    channelInfo.get('code1').set('value',  codePrefix + 'Z')
                    channelInfo.get('code2').set('value', '')
                    channelInfo.get('code3').set('value', '')    
                    
                    channelInfo.get('dip1').set('value', 0)
                    channelInfo.get('dip2').set('value', 0)
                    channelInfo.get('dip3').set('value', 0)   
                    
                    channelInfo.get('azimuth1').set('value', 0)
                    channelInfo.get('azimuth2').set('value', 0)
                    channelInfo.get('azimuth3').set('value', 0)                     
                }
            }
        }
        
        viewModel.set('activeIndex', activeIndex)
    },
    createChanel: function (){
        if (this.validateActive()) {
            var view = this.getView();
            var viewModel = this.getViewModel();
            var channelInfo = viewModel.get('channelInfo')
            var sensorKeys = [];
            this.buildKeys(viewModel.get('sensorSelection'), sensorKeys);
            var dataloggerKeys = [];
            this.buildKeys(viewModel.get('dataloggerSelection'), dataloggerKeys);
            channelInfo.set('sensorKeys', sensorKeys)
            channelInfo.set('dataloggerKeys', dataloggerKeys)
            channelInfo.save({
                success: function (){
                    view.fireEvent('saved', null);
                    view.doClose()
                }
            })
        }
    },
    validateElement: function(element){
        var valid = true
        var elController = element.getController()
        if (elController) {
            if (!element.isHidden() && elController.validate &&
                !elController.validate()) {
                valid = false;
            }
        } else if (element instanceof Ext.form.field.Base) {
            if (!element.isHidden() && !element.validate()) {
                valid = false;
            }
        } else if (element instanceof Ext.form.FieldContainer){
            var items = element.items;
            for (var int = 0; int < items.getCount(); int++) {
                if(!this.validateElement(items.getAt(int))){
                    valid = false;
                    break;
                }
            }
        } else if (element instanceof Ext.toolbar.Breadcrumb) {
            var selectedNode = element.getSelection()
            if (!selectedNode.isRoot() &&
                !selectedNode.isLeaf()) {
                valid = false;
                if (!element.tooltip) {
                    element.tooltip = new Ext.tip.ToolTip({
                        target: element,
                        cls: 'x-tip-form-invalid',
                        bodyCls: 'x-tip-body-form-invalid',
                        html: 'Please accomplish or reset selection!'
                    });
                    element.tooltip.removeBodyCls('x-tip-body')
                    element.addCls('errorBorder')
                }
            } else {
                if (element.tooltip) {
                    element.tooltip.destroy()
                    element.removeCls('errorBorder');
                    element.tooltip = null;
                }
            }
        }  
        return valid;
    },
    validateActive: function (){
        var view = this.getView();
        var elements = view.getLayout().activeItem.items.items;
        var valid = true;
        for (var int = 0; int < elements.length; int++) {
            var element = elements[int];
            if (!this.validateElement(element)){
                valid = false;
                break
            }
        }
        return valid;
    },
    showNext: function (){
        if (this.validateActive()) {
            this.activateItem(1);
        }
    },
    showPrevious: function (){
        this.activateItem(-1);
    },
    buildKeys: function (node, result){
        if (!node) {
            return [];
        }
        result.push(node.get('key'));
        if (node.parentNode) {
            this.buildKeys(node.parentNode, result);
        } else {
            result = result.reverse();
            result = result.shift();
        }
    }
});
