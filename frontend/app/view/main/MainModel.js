Ext.define('imct.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    data: {
        name: 'IMCT'
    },
    formulas: {
        version: function (get) {
            // var build = (typeof applicationBuildNumber !== 'undefined') ? `(${applicationBuildNumber})` : '';
            return `${Ext.manifest.version}`;
        }
    }
});
