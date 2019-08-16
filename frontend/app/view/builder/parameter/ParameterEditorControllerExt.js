Ext.define('yasmine.view.xml.builder.parameter.ParameterEditorControllerExt', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.parameter-editor-ext',
    requires: [
        'yasmine.view.xml.builder.parameter.items.text.TextEditor',
        'yasmine.view.xml.builder.parameter.items.int.IntEditor',
        'yasmine.view.xml.builder.parameter.items.float.FloatEditor',
        'yasmine.view.xml.builder.parameter.items.latitude.LatitudeEditor',
        'yasmine.view.xml.builder.parameter.items.longitude.LongitudeEditor',
        'yasmine.view.xml.builder.parameter.items.date.DateEditor'
    ],
    createFrom: function () {
        var record = this.getViewModel().get('record');
        var content = Ext.create({ 
            fieldLabel: Ext.String.capitalize(record.get('name')),
            xtype: record.get('class'), 
            reference: 'contentView',
            value: record.get('value')
        });
        this.getView().down('form').insert(0, content);
        content.getViewModel().set('record', record);
        
        this.getViewModel().set('station__spread_to_channels', yasmine.Globals.Settings.station__spread_to_channels)
        content.getViewModel().set('nodeType', this.getViewModel().get('nodeType'));
    },
    onSaveClick: function () {
        var contentView = this.lookupReference('contentView');
        var contentController = contentView.getController();
        var record = contentView.getViewModel().get('record');
        
        record.set('value', contentView.getValue(), {commit: false})
        
        if (contentController && contentController.validate && !contentController.validate()) {
            return;
        }
        var that = this;

        if (record.dirty && record.get('value') != null && record.get('value') !== undefined) {
           record.getProxy().extraParams = {'spread_to_channels': that.getViewModel().get('station__spread_to_channels')}
           record.save({ 
               success: function () { 
                   that.getView().fireEvent('recordSaved');
                   record.getProxy().extraParams = {};
               }
           });
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
