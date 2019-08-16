Ext.define('yasmine.view.xml.builder.parameter.ParameterItemEditorModel', {
    extend: 'Ext.app.ViewModel',
    data: {
        record: null,
        nodeType: null,
        validation: {
            activeErrors: []
        }
    },
    formulas: {
        validationErrors: {
            bind: {
                bindTo: '{validation.activeErrors}'
            },
            get: function (target) {
                var errors = (target) ? target : [];
                return `<span style="color: red">${errors.join('<br/>')}</span>`;
            }
        },
        canShowValidationError: {
            bind: {
                bindTo: '{validation.activeErrors}'
            },
            get: function (target) {
                return target && target.length > 0;
            }
        }
    }
});
