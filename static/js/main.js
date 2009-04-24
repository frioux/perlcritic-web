// reference local blank image
Ext.BLANK_IMAGE_URL = '/static/js/lib/ext3/resources/images/default/s.gif';

Ext.onReady( function() {
      Ext.QuickTips.init();
      var grid = Ext.ComponentMgr.create({
            xtype: 'critic_grid'
         });
      new Ext.Viewport({
            layout: 'fit',
            items: grid
         });

      var task = {
         run: function(){
            grid.getStore().load();
         },
         interval: 30*1000
      }

      Ext.TaskMgr.start(task);

      new Ext.KeyMap(Ext.getDoc(), {
            key: 'r',
            alt: true,
            handler: function() {
               Ext.TaskMgr.stop(task);
               Ext.TaskMgr.start(task);
            }
         });
   });
