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
   globals: { tableSorted: false },
   update_criticisms_on_page: function(data) {
      $("#criticisms tbody").html(
         $.map(data.data, WebCritic.generateRow).join('')
      );
      $("#criticisms").tablesorter({
         sortList: [[0,1]]
      });
   },
   update_criticisms: function() {
      $.getJSON("/criticisms", {}, WebCritic.update_criticisms_on_page);
   },
   toggle_column: function(n, toggled) {
      var selector = '#criticisms td:nth-child('+n+'),#criticisms th:nth-child('+n+')';
      return function() {
         if (toggled) {
            $(selector).hide();
         } else {
            $(selector).show();
         }
         toggled = !toggled;
         return toggled;
      }
   }
};

WebCritic.toggleSeverity    = WebCritic.toggle_column(1, true);
WebCritic.toggleFile        = WebCritic.toggle_column(2, true);
WebCritic.toggleLocation    = WebCritic.toggle_column(3, true);
WebCritic.toggleDescription = WebCritic.toggle_column(4, true);
WebCritic.toggleExplanation = WebCritic.toggle_column(5, true);
WebCritic.togglePolicy      = WebCritic.toggle_column(6, true);
WebCritic.toggleSource      = WebCritic.toggle_column(7, true);
WebCritic.showAllColumns    = function() {
   while (!WebCritic.toggleSeverity()) {}
   while (!WebCritic.toggleFile()) {}
   while (!WebCritic.toggleLocation()) {}
   while (!WebCritic.toggleDescription()) {}
   while (!WebCritic.toggleExplanation()) {}
   while (!WebCritic.togglePolicy()) {}
   while (!WebCritic.toggleSource()) {}
};

$(document).ready(function() {
   var doc = $(document);
   doc.bind('keydown', '1', WebCritic.toggleSeverity);
   doc.bind('keydown', '2', WebCritic.toggleFile);
   doc.bind('keydown', '3', WebCritic.toggleLocation);
   doc.bind('keydown', '4', WebCritic.toggleDescription);
   doc.bind('keydown', '5', WebCritic.toggleExplanation);
   doc.bind('keydown', '6', WebCritic.togglePolicy);
   doc.bind('keydown', '7', WebCritic.toggleSource);
   doc.bind('keydown', 'h', WebCritic.toggleSeverity);
   doc.bind('keydown', 'r', WebCritic.update_criticisms);
   doc.bind('keydown', 'a', WebCritic.showAllColumns);
   WebCritic.update_criticisms();
   setInterval( WebCritic.update_criticisms, 5*60*1000 );
   $("#criticisms").click(WebCritic.update_criticisms);
});

