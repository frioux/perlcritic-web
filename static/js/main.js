WebCritic = {
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
         return "<td class='very-minor'>1 very minor</td>";
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
      var html = '<tbody>' + $.map(data.data, WebCritic.generateRow).join('') + '</tbody>';
      $("#criticisms tbody").replaceWith( html);
      $("#criticisms").tablesorter({
         sortList: [[0,1]]
      });
   },
   update_criticisms: function() {
      $.getJSON("/criticisms", {}, WebCritic.update_criticisms_on_page);
   }
};

$(document).ready(function() {
   WebCritic.update_criticisms();
   setInterval( WebCritic.update_criticisms, 5*60*1000 );
   $("#criticisms").click(WebCritic.update_criticisms);
});

