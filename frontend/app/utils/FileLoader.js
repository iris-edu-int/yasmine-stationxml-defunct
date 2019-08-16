Ext.define("yasmine.store.FileLoader", {
    singleton : true,
    load : function(url) {
        Ext.Ajax.request({
            scope: this,
            url: url,
            method: 'GET',
            success: function (response) {
                var disposition = response.getResponseHeader('content-disposition')
                
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) { 
                  filename = matches[1].replace(/['"]/g, '');
                }
                
                var blob = new Blob([response.responseText], { type: 'application/xml' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
});
