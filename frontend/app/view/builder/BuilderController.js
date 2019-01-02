Ext.define('imct.view.xml.builder.BuilderController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.builder',
    afterRender: function(){
        var viewModel = this.getViewModel();
        var xmlId = viewModel.get('xmlId');
        viewModel.set('xml', imct.model.Xml.load(parseInt(xmlId)));
    }
});
