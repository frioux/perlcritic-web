package WebCritic::Controller;
use strict;
use warnings;
use base 'CGI::Application';
use feature ':5.10';
use CGI::Application::Plugin::AutoRunmode;

sub main : StartRunmode {
   my $self = shift;
   my $html        = <<'HTML';
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
   <title>WebCritic: for your health!</title>
   <script type="text/javascript" src="/static/js/lib/ext3/adapter/ext/ext-base.js"></script>
   <script type="text/javascript" src="/static/js/lib/ext3/ext-all.js"></script>
   <link rel="stylesheet" type="text/css" href="/static/js/lib/ext3/resources/css/ext-all.css" />
   <script type="text/javascript" src="/static/js/lib/WebCritic/CriticGrid.js"></script>
   <script type="text/javascript" src="/static/js/main.js"></script>
</head>
<body>
<div id='main'></div>
</body>
</html>
HTML
   return $html;
}

sub criticisms : Runmode {
   my $self = shift;
   use IO::All;

   my $port = $ENV{ CRITIC_PORT } || 7890;

   my $io = io("localhost:$port");
   my $output;
   while ( my $line = $io->getline ) {
      $output .= $line;
   }
   return $output;
}

1;
