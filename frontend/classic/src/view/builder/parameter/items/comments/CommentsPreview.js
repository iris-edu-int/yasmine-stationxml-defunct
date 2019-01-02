Ext.define("imct.view.xml.builder.parameter.items.comments.CommentsPreview", {
    xtype: 'imct-comments-field-preview',
    getPreview: function(value) {
        if (!value || value.length === 0) {
            return null;
        }

        var comments = [];
        value.forEach(function(element) {
            comments = comments.concat(element._value);
        });
        
        return comments.join('; ');
    }
});
