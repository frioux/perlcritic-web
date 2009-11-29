WebCritic = {
   td: function(td) {
      return '<td class="' + td.class + '">' + td.value + '</td>';
   },
   generateRow: function(rowData) {
      return '<tr>' +
         WebCritic.formatSeverity(rowData.severity) +
         WebCritic.formatFile(rowData.filename) +
         WebCritic.formatLocation(rowData.location) +
         WebCritic.formatDescription(rowData.description) +
         WebCritic.formatExplanation(rowData.explanation) +
         WebCritic.formatPolicy(rowData.policy) +
         WebCritic.formatSource(rowData.source) +
         '</tr>';
   },
   formatSeverity: function(severity) {
      switch(severity) {
      case 1:
         return WebCritic.td({class: 'very-minor', value: '1 very minor' });
      case 2:
         return "<td class='minor'>2 minor</td>";
      case 3:
         return "<td class='medium'>3 medium</td>";
      case 4:
         return "<td class='major'>4 major</td>";
      case 5:
         return "<td class='very-major'>5 very major</td>";
      }
   },
   formatFile: function(file) {
      return "<td class='filename'>"+file+"</td>";
   },
   formatLocation: function(loc) {
      return "<td class='location'>" + 'L' +loc[0] + ' C' + loc[1] + "</td>";
   },
   formatDescription: function(value) {
      return "<td class='description'>"+value+"</td>";
   },
   formatExplanation: function(value) {
      return "<td class='explanation'>"+value+"</td>";
   },
   formatPolicy: function(value) {
      return "<td class='policy'>"+value+"</td>";
   },
   formatSource: function(value) {
      return "<td class='source'>"+value+"</td>";
   },
   update_criticisms_on_page: function(data) {
      $("#criticisms").replaceWith(
         '<table><thead><tr><th>Severity</th><th>File</th><th>Location</th><th>Description</th><th>Explanation</th><th>Policy</th><th>Source</th></tr></thead><tbody>' +
         $.map(data.data, WebCritic.generateRow).join('') +
         '</tbody></table>'
      );
      $("table").tablesorter({
         sortList: [[0,1]]
      });
      WebCritic.hideColumns();
   },
   update_criticisms: function() {
      $.getJSON("/criticisms", {}, WebCritic.update_criticisms_on_page);
   },
   globals: {
      shown: [ true, true, true, true, false, false, false ]
   },
   hideColumns: function() {
      $.each(WebCritic.globals.shown, function(i, x) {
         i++;
         var selector = 'td:nth-child('+i+'),th:nth-child('+i+')';
         if (x) {
            $(selector).show();
         } else {
            $(selector).hide();
         }
      });
   },
   toggleColumn: function(n) {
      var selector = 'td:nth-child('+n+'),th:nth-child('+n+')';
      return function() {
         if (WebCritic.globals.shown[n]) {
            $(selector).hide();
         } else {
            $(selector).show();
         }
         WebCritic.globals.shown[n] = !WebCritic.globals.shown[n];
      }
   }
};

$.extend(WebCritic, {
   toggleSeverity   : WebCritic.toggleColumn(1, true),
   toggleFile       : WebCritic.toggleColumn(2, true),
   toggleLocation   : WebCritic.toggleColumn(3, true),
   toggleDescription: WebCritic.toggleColumn(4, true),
   toggleExplanation: WebCritic.toggleColumn(5, true),
   togglePolicy     : WebCritic.toggleColumn(6, true),
   toggleSource     : WebCritic.toggleColumn(7, true),
   showAllColumns: function() {
      WebCritic.globals.shown = [ true, true, true, true, true, true, true ];
      WebCritic.hideColumns();
   },
   showDefaultColumns: function() {
      WebCritic.globals.shown = [ true, true, true, true, false, false, false ];
      WebCritic.hideColumns();
   }
});

$(document).ready(function() {
   var doc = $(document);
   doc.bind('keydown', '1', WebCritic.toggleSeverity);
   doc.bind('keydown', '2', WebCritic.toggleFile);
   doc.bind('keydown', '3', WebCritic.toggleLocation);
   doc.bind('keydown', '4', WebCritic.toggleDescription);
   doc.bind('keydown', '5', WebCritic.toggleExplanation);
   doc.bind('keydown', '6', WebCritic.togglePolicy);
   doc.bind('keydown', '7', WebCritic.toggleSource);
   doc.bind('keydown', 'h', WebCritic.toggleHelp);
   doc.bind('keydown', 'r', WebCritic.update_criticisms);
   doc.bind('keydown', 'd', WebCritic.showDefaultColumns);
   doc.bind('keydown', 'a', WebCritic.showAllColumns);
   WebCritic.update_criticisms();
   setInterval( WebCritic.update_criticisms, 5*60*1000 );
   $("#criticisms").click(WebCritic.update_criticisms);
});

