/*global Ext */
/*global WebCritic */
Ext.ns('WebCritic');
WebCritic.Grid = Ext.extend(Ext.grid.GridPanel, {
      initComponent: function () {
         var config = {
            store: new Ext.data.Store({
                  proxy: new Ext.data.HttpProxy({
                        url: 'critic/controller/criticisms',
                        timeout: 1800000
                     }),
                  sortInfo: {
                     field: 'severity',
                     direction: 'DESC'
                  },
                  reader: new Ext.data.JsonReader({
                        root: 'data'
                     }, [
                     'description', 'explanation',
                     'location', 'filename',
                     'severity', 'policy',
                     'source'
                  ]
               )
            }),
         columns: [{
               header: 'Severity',
               dataIndex: 'severity',
               sortable: true,
               renderer: function(value, metadata, record) {
                  switch(value) {
                  case 1:
                     metadata.attr += 'style="background: #FEE;"';
                     return "very minor";
                  case 2:
                     metadata.attr += 'style="background: #FCC;"';
                     return "minor";
                  case 3:
                     metadata.attr += 'style="background: #F88;"';
                     return "medium";
                  case 4:
                     metadata.attr += 'style="background: #F44;"';
                     return "major";
                  case 5:
                     metadata.attr += 'style="background: #F00;"';
                     return "very major";
                  }
               },
               width: 60
            }, {
               header: 'File',
               dataIndex: 'filename',
               renderer: function(value, metadata, record) {
                  metadata.attr += 'style="color: grey;"';
                  return value;
               },
               sortable: true,
               width: 200
            }, {
               header: 'Location',
               dataIndex: 'location',
               renderer: function(value, metadata, record) {
                  metadata.attr += 'style="color: grey;"';
                  return String.format("L{0} C{1}", value[0], value[1]);
                        },
                        sortable: true,
                        width: 50
                     }, {
                        header: 'Description',
                        dataIndex: 'description',
                        sortable: true,
                        renderer: function(value, metadata, record) {
                           metadata.attr += String.format('qtip="{0}"', record.get('explanation'));
                           return value;
                        },
                        width: 300
                     }, {
                        header: 'Explanation',
                        renderer: function(value, metadata, record) {
                           metadata.attr += 'style="color: grey;"';
                           return value;
                        },
                        dataIndex: 'explanation',
                        sortable: true,
                        hidden: true,
                        width: 200
                     }, {
                        header: 'Policy',
                        dataIndex: 'policy',
                        renderer: function(value, metadata, record) {
                           metadata.attr += 'style="color: grey;"';
                           return value;
                        },
                        sortable: true,
                        hidden: true,
                        width: 100
                     }, {
                        header: 'Source',
                        dataIndex: 'source',
                        renderer: function(value, metadata, record) {
                           metadata.attr += 'style="color: grey;"';
                           return value;
                        },
                        sortable: true,
                        width: 300
                     }]
                  };
                  Ext.apply(this, Ext.apply(this.initialConfig, config));
                  WebCritic.Grid.superclass.initComponent.apply(this, arguments);
               }
            });

         Ext.reg('critic_grid', WebCritic.Grid);
