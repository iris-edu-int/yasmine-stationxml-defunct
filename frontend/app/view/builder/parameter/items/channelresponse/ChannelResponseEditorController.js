Ext.define('imct.view.xml.builder.parameter.items.channelresponse.ChannelResponseEditorController', {
    extend: 'imct.view.xml.builder.parameter.ParameterItemEditorController',
    alias: 'controller.channel-response-editor',
    initData: function () {
        var record = this.getViewModel().get('record');
        var value = record.get('value');
        if (value) {
            this.getViewModel().getParent().set('previewMode', true);
            this.getViewModel().set('channelPreview', value);
            return;
        }

        this.getStore('sensorStore').root.expand();
        this.getStore('dataloggerStore').root.expand();
    },
    fillRecord: function () {
        var isPreview = this.getViewModel().get('previewMode');
        var sensorKeys = this.getViewModel().get('sensorKeys');
        var dataloggerKeys = this.getViewModel().get('dataloggerKeys');
        if (isPreview || !sensorKeys || !dataloggerKeys) {
            return;
        }

        this.getViewModel().get('record').set('value', { sensorKeys, dataloggerKeys });
    },
    onSensorSelectionChange: function (cmp, node) {
        this.showResponse(node, 'sensor', 'sensorKeys');
    },
    onSensorClick: function (item) {
        var node = this.getStore('sensorStore').getNodeById(item._breadcrumbNodeId);
        this.showResponse(node, 'sensor', 'sensorKeys');
    },
    onDataloggerSelectionChange: function (cmp, node) {
        this.showResponse(node, 'datalogger', 'dataloggerKeys');
    },
    onDataloggerClick: function (item) {
        var node = this.getStore('dataloggerStore').getNodeById(item._breadcrumbNodeId);
        this.showResponse(node, 'datalogger', 'dataloggerKeys');
    },
    showResponse: function (node, device, keysProperty) {
        if (this.getViewModel().get('previewMode')) {
            return;
        }
        this.getViewModel().set(`${device}Preview`, null);
        this.getViewModel().set('channelPreview', null);
        this.getViewModel().set(keysProperty, null);
        if (!node.isLeaf()) {
            return;
        }
        this.setKeys(node, keysProperty);
        this.loadPreviewResponse(device, this.getViewModel().get(keysProperty));
    },
    loadPreviewResponse: function (device, keys) {
        var that = this;
        Ext.Ajax.request({
            method: 'GET',
            params: { keys },
            url: `/api/nrl/${device}/response/`,
            success: function (response, options) {
                that.getViewModel().set(`${device}Preview`, response.responseText);
                that.loadChannelResponseIfPossible();
            },
            failure: function (response, options) {
                that.getViewModel().set('preview', response.status);
            }
        });
    },
    loadChannelResponseIfPossible: function () {
        this.getViewModel().set('channelPreview', null);

        var sensorKeys = this.getViewModel().get('sensorKeys');
        if (!sensorKeys || sensorKeys.length === 0) {
            return;
        }
        var dataloggerKeys = this.getViewModel().get('dataloggerKeys');
        if (!dataloggerKeys || dataloggerKeys.length === 0) {
            return;
        }
        var that = this;
        Ext.Ajax.request({
            method: 'GET',
            params: { sensorKeys, dataloggerKeys },
            url: `/api/nrl/channel/response/preview/`,
            success: function (response, options) {
                that.getViewModel().set('channelPreview', response.responseText);
            }
        });
    },
    setKeys: function (node, device) {
        var keys = [];
        this.buildKeys(node, keys);
        this.getViewModel().set(device, keys);
    },
    buildKeys: function (node, result) {
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
    },
    switchMode: function(editing){
      if (editing){
          var me = this;
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
      }  
    },
    control:{
        '#':{
            switchMode: 'switchMode'
        }
    }
});
