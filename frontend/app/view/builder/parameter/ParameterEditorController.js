Ext.define('yasmine.view.xml.builder.parameter.ParameterEditorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parameter-editor',
    requires: [
        'yasmine.view.xml.builder.parameter.items.text.TextEditor',
        'yasmine.view.xml.builder.parameter.items.int.IntEditor',
        'yasmine.view.xml.builder.parameter.items.float.FloatEditor',
        'yasmine.view.xml.builder.parameter.items.latitude.LatitudeEditor',
        'yasmine.view.xml.builder.parameter.items.longitude.LongitudeEditor',
        'yasmine.view.xml.builder.parameter.items.date.DateEditor',
        'yasmine.view.xml.builder.parameter.items.site.SiteEditor',
        'yasmine.view.xml.builder.parameter.items.externalreferences.ExternalReferencesEditor',
        'yasmine.view.xml.builder.parameter.items.comments.CommentsEditor',
        'yasmine.view.xml.builder.parameter.items.operators.OperatorsEditor',
        'yasmine.view.xml.builder.parameter.items.operators.OperatorsEditorForm',
        'yasmine.view.xml.builder.parameter.items.channelequipment.ChannelEquipmentEditor',
        'yasmine.view.xml.builder.parameter.items.channeltypes.ChannelTypesEditor',
        'yasmine.view.xml.builder.parameter.items.channelresponse.ChannelResponseEditor'
    ],
    createFrom: function () {
        var record = this.getViewModel().get('record');
        var content = Ext.create({ xtype: record.get('class'), reference: 'contentView' });
        this.getView().add([content]);
        content.getViewModel().set('record', record);
        content.getViewModel().set('nodeType', this.getViewModel().get('nodeType'));
        var contentController = content.getController();
        if (contentController && contentController.initData) {
            contentController.initData();
        };
    },
    editButton: function(){
        this.getViewModel().set('previewMode', false);
        this.getView().items.each(function(item){
            item.fireEvent('switchMode', true);
        })
    },
    onSaveClick: function () {
        var contentView = this.lookupReference('contentView');
        var contentController = contentView.getController();
        if (contentController && contentController.fillRecord) {
            contentController.fillRecord();
        }
        if (contentController && contentController.validate && !contentController.validate()) {
            return;
        }
        var that = this;
        var record = contentView.getViewModel().get('record');
        if (record.dirty && record.get('value') != null && record.get('value') !== undefined) {
           record.save({ success: function () { that.getView().fireEvent('recordSaved'); } });
        } else {
            that.getView().fireEvent('editingCanceled', record);
        }
    },
    onCancelClick: function () {
        var contentView = this.lookupReference('contentView');        
        var record = contentView.getViewModel().get('record');        
        this.getView().fireEvent('editingCanceled', record);
    },
    onHelpClick: function () {
        var record = this.getViewModel().get('record');
        var nodeTypeString = yasmine.utils.NodeTypeConverter.toString(this.getViewModel().get('nodeType'));
        var nodeTypeId = nodeTypeString.toLowerCase();
        yasmine.utils.HelpUtil.helpMe(`parameter_${nodeTypeId}_${record.get('name')}`, `${nodeTypeString} ${record.get('name')}`);
    }
});
