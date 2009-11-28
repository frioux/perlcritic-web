#!perl
use Web::Simple 'WebCritic::Controller';
{
   package WebCritic::Controller;
   use WebCritic::Critic;
   use JSON ();

   my $critic = WebCritic::Critic->new({ directory => q{.} });

   my $main = <<'HTML';
<html>
<head>
   <title>WebCritic: for your health!</title>
   <script type="text/javascript" src="/static/js/lib/jquery-1.3.2.min.js"></script>
   <script type="text/javascript" src="/static/js/lib/tablesorter.js"></script>
   <script type="text/javascript" src="/static/js/main.js"></script>
   <style>
      * {
         font-size: 11px;
         font-family: arial;
      }
      table {
         border-collapse: collapse;
      }
      td, tr {
         border-top: 1px solid grey;
      }
      .very-minor {
         background: #FEE;
      }
      .minor {
         background: #FCC;
      }
      .medium {
         background: #F88;
      }
      .major {
         background: #F44;
      }
      .very-major {
         background: #F00;
      }
      .filename {
         color: grey;
      }
      .location {
         color: grey;
      }
      .explanation {
         color: grey;
      }
      .policy {
         color: grey;
      }
      .source {
         color: grey;
      }
   </style>
</head>
<body>
<table id="criticisms">
<thead><tr>
<th>Severity</th>
<th>File</th>
<th>Location</th>
<th>Description</th>
<th>Explanation</th>
<th>Policy</th>
<th>Source</th>
</tr></thead>
<tbody</tbody>
</table>
</body>
</html>
HTML

   sub main {
      return [ 200, [ 'Content-type', 'text/html' ], [ $main ] ];
   }

   sub criticisms {
      return [ 200, [ 'Content-type', 'application/json' ], [ JSON::encode_json( $critic->criticisms )] ];
   }

   dispatch {
      sub (/) { $self->main },
      sub (/criticisms) { $self->criticisms },
      sub (/static/**) {
         my $file = $_[1];
         open my $fh, '<', "static/$file" or return [ 404, [ 'Content-type', 'text/html' ], [ 'file not found']];
         local $/ = undef;
         my $data = <$fh>;
         close $fh or return [ 500, [ 'Content-type', 'text/html' ], [ 'Internal Server Error'] ];
         [ 200, [ 'Content-type' => 'text/html' ], [ $data ] ]
      },
   };
}

WebCritic::Controller->run_if_script;
