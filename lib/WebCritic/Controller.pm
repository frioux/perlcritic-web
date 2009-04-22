package WebCritic::Controller;
use strict;
use warnings;
use base 'CGI::Application';
use feature ':5.10';
use CGI::Application::Plugin::AutoRunmode;

sub main : StartRunmode {
   my $self = shift;
   return $self->basic_page({
         javascript_classes => [ 'CriticGrid' ],
      });
}

sub criticisms : Runmode {
   use IO::All;

   my $io = io('localhost:7890');
   my $output;
   while ( my $line = $io->getline ) {
      $output .= $line;
   }
   return $output;
}

sub basic_page {
   my $self = shift;
   my $params = shift;
   my $javascripts = $params->{javascript_classes};
   my $html = <<'HTML';
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
   <title>WebCritic: for your health!</title>
   <script type="text/javascript" src="/static/js/lib/ext3/adapter/ext/ext-base.js"></script>
   <script type="text/javascript" src="/static/js/lib/ext3/ext-all.js"></script>
   <link rel="stylesheet" type="text/css" href="/static/js/lib/ext3/resources/css/ext-all.css" />
HTML

   $html .= join "\n",
      map {
         qq|   <script type="text/javascript" src="/static/js/lib/WebCritic/$_.js"></script>|
      } @{$javascripts};

   $html .= <<'HTML';
   <script type="text/javascript" src="/static/js/main.js"></script>
</head>
<body>
<div id='main'></div>
</body>
</html>
HTML
   return $html;
}

1;
