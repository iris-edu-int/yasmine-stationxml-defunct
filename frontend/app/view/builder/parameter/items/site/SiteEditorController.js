Ext.define('imct.view.xml.builder.parameter.items.site.SiteEditorController', {
    extend: 'imct.view.xml.builder.parameter.ParameterItemEditorController',
    alias: 'controller.site-editor',
    initData: function () {
        var value = this.getViewModel().get('record').get('value');
        if (!value) {
            return;
        }

        this.getViewModel().set('name', value.name);
        this.getViewModel().set('town', value.town);
        this.getViewModel().set('description', value.description);
        this.getViewModel().set('county', value.county);
        this.getViewModel().set('region', value.region);
        this.getViewModel().set('country', value.country);
    },
    fillRecord: function () {
        var viewModel = this.getViewModel();
        var value = {
            'py/object': 'obspy.core.inventory.util.Site',
            name: viewModel.get('name'),
            town: viewModel.get('town'),
            description: viewModel.get('description'),
            county: viewModel.get('county'),
            region: viewModel.get('region'),
            country: viewModel.get('country')
        };

        viewModel.get('record').set('value', value);
    }
});
