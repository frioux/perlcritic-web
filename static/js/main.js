// reference local blank image
Ext.BLANK_IMAGE_URL = '/static/js/lib/ext3/resources/images/default/s.gif';

Ext.onReady( function() {
      Ext.QuickTips.init();
      var win = new Ext.Viewport({
            layout: 'border',
            items: {
               region: 'center',
               xtype: 'critic_grid'
            }
         });
      win.show();
});
