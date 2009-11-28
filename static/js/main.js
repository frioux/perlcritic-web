WebCritic = {
   generateRow: function(rowData) {
      return '<tr>' +
         '<td>' + WebCritic.formatSeverity(rowData.severity) + '</td>' +
         '<td>' + WebCritic.formatFile(rowData.file) + '</td>' +
         '<td>' + WebCritic.formatLocation(rowData.location) + '</td>' +
         '<td>' + WebCritic.formatDescription(rowData.description) + '</td>' +
         '<td>' + WebCritic.formatExplanation(rowData.explanation) + '</td>' +
         '<td>' + WebCritic.formatPolicy(rowData.policy) + '</td>' +
         '<td>' + WebCritic.formatSource(rowData.source) + '</td>' +
         '</tr>';
   },
   formatSeverity: function(severity) {
      return severity;
   },
   formatFile: function(file) {
      return file;
   },
   formatLocation: function(loc) {
      return loc;
   },
   formatDescription: function(description) {
      return description;
   },
   formatExplanation: function(explanation) {
      return explanation;
   },
   formatPolicy: function(policy) {
      return policy;
   },
   formatSource: function(source) {
      return source;
   }
};

WebCritic.update_criticisms_on_page = function(data) {
   var html = $.map(data.data, WebCritic.generateRow).join('');
   $("#criticisms tbody").replaceWith( html);
}

WebCritic.update_criticisms = function() {
   $.getJSON("/criticisms", {}, WebCritic.update_criticisms_on_page);
}


$(document).ready(function() {
   WebCritic.update_criticisms();

  $("#criticisms").click(function() {
   WebCritic.update_criticisms();
  });
});

