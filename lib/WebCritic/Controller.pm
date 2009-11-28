#!perl
use Web::Simple 'WebCritic::Controller';
{
   package WebCritic::Controller;
   use WebCritic::Critic;
   use JSON ();

   my $critic = WebCritic::Critic->new({ directory => '.' });

   sub main {
         [ 200, [ 'Content-type', 'text/html' ], [
   q[
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
   <title>WebCritic: for your health!</title>
   <script type="text/javascript" src="/static/js/lib/jquery-1.3.2.min.js"></script>
   <script type="text/javascript" src="/static/js/main.js"></script>
</head>
<body>
<div id='main'></div>
</body>
</html>
]
      ] ]
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
