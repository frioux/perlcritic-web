#!perl
use Web::Simple 'WebCritic::Controller';
{
   package WebCritic::Controller;
   use WebCritic::Critic;
   use JSON ();

   my $critic = WebCritic::Critic->new({ directory => '.' });

   my $main = q[
<html>
<head>
   <title>WebCritic: for your health!</title>
   <script type="text/javascript" src="/static/js/lib/jquery-1.3.2.min.js"></script>
   <script type="text/javascript" src="/static/js/main.js"></script>
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
];
   sub main {
         [ 200, [ 'Content-type', 'text/html' ], [ $main ] ]
   }

   sub criticisms {
      [ 200, [ 'Content-type', 'application/json' ], [ JSON::encode_json( $critic->criticisms )] ]
   }

   dispatch {
      sub (/) { $self->main },
      sub (/criticisms) { $self->criticisms },
      sub (/static/**) {
         my $file = $_[1];
         open my $fh, '<', "static/$file" or return [ 404, [ 'Content-type', 'text/html' ], [ 'file not found']];
         local $/ = undef;
         my $data = <$fh>;
         [ 200, [ 'Content-type' => 'text/html' ], [ $data ] ]
      },
   };
}

WebCritic::Controller->run_if_script;
