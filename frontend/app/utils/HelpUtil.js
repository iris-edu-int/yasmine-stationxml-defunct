Ext.define("imct.utils.HelpUtil", {
    singleton: true,
    helpMe: function (helpId, helpTitle = 'Help panel') {
        var title = `Help: '${helpTitle}'`;
    	imct.help.HelpModel.load(helpId, {
			success: function(record, operation){
				var main_help = Ext.ComponentQuery.query('main_help');
				if (main_help.length>0){
					main_help[0].getViewModel().set('record', record)
					main_help[0].setTitle(title)
				}else{
			   		Ext.create('imct.help.Help',{
			   			title: title,
			   			viewModel:{
			   				type: 'main_help',
			   				data:{
			   					record: record
			   				}
			   			}
			   		}).show()
				}
			}
		})
    }
});


Ext.define('imct.help.HTMLEditor',{
	extend: 'Ext.form.field.HtmlEditor',
	alias: 'widget.help_html_editor',
	getToolbarCfg: function(){
        var cfg = this.callParent(arguments);
        if (this.readOnly){
        	cfg['hidden'] = true
        }
        return cfg
    },
    getDocMarkup: function() {
        var me = this,
            h = me.iframeEl.getHeight() - me.iframePad * 2;

        // - IE9+ require a strict doctype otherwise text outside visible area can't be selected.
        // - Opera inserts <P> tags on Return key, so P margins must be removed to avoid double line-height.
        // - On browsers other than IE, the font is not inherited by the IFRAME so it must be specified.
        return Ext.String.format(
               '<!DOCTYPE html>'
               + '<html><head><style type="text/css">'
               + (Ext.isOpera ? 'p{margin:0;}' : '')
               + 'body{border:0;margin:0;padding:{0}px;direction:' + (me.rtl ? 'rtl;' : 'ltr;')
               + (Ext.isIE8 ? Ext.emptyString : 'min-')
               + 'height:{1}px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;cursor:text;background-color:white;'
               + (Ext.isIE ? '' : 'font-size:12px;font-family:{2}')
               + '}</style><link rel="stylesheet" type="text/css" href="/static/css/help.css"/></head><body></body></html>'
            , me.iframePad, h, me.defaultFont);
    }    
})

Ext.define('imct.help.HelpModel', {
    extend: 'Ext.data.Model',
    fields: ['key', 'content'],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url : '/api/help/',
        writer:{
        	type: 'json'
        }
    }
});

Ext.define('imct.help.HelpViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main_help'
})

Ext.define('imct.help.HelpController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main_help'    
})

Ext.define('imct.help.Help', {
    extend: 'Ext.window.Window',
    alias: 'widget.main_help',
    viewModel: 'main_help',
    controller: 'main_help',
    modal: false,
    alignOffset: [-10, 0],
    defaultAlign: 'r-r',
    alwaysOnTop: true,
    width: "30%",
    height: "80%",
    maximizable: true,
    border: false,
    layout: 'fit',
    items:[{
    	xtype: 'help_html_editor',
    	readOnly: true,
    	bind: {
    		value: '{record.content}'
    	}
    }] 
})

Ext.on('resize', function() { 
	var main_help = Ext.ComponentQuery.query('main_help');
	if (main_help.length>0){
		main_help[0].close()
	}
});
