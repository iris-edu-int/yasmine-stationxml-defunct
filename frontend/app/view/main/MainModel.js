Ext.define('yasmine.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    data: {
        name: 'yasmine'
    },
    formulas: {
        version: function (get) {
            // var build = (typeof applicationBuildNumber !== 'undefined') ? `(${applicationBuildNumber})` : '';
            return `${Ext.manifest.version}`;
        }
    }
});
