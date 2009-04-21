package WebCritic::Controller;
use strict;
use warnings;
use base 'CGI::Application';
use feature ':5.10';
use CGI::Application::Plugin::AutoRunmode;
use JSON 'encode_json';
use Perl::Critic;
use File::Find::Rule;
use File::Spec;

sub main : StartRunmode {
   my $self = shift;
   return $self->basic_page({
         javascript_classes => [ 'CriticGrid' ],
      });
}

sub criticisms : Runmode {
   my @files = File::Find::Rule->file()->name(
      '*.pm','*.pl','*.plx'
   )->in(
      $ENV{CRITICIZE}
   );

   my @problems;

   my $critic = Perl::Critic->new(-theme => 'core');
   foreach my $file (@files) {
      my @violations = $critic->critique($file);
      foreach my $violation (@violations) {
         push @problems, {
            description => $violation->description(),
            explanation => $violation->explanation(),
            location => [ @{$violation->location()}[0..1] ],
            filename => File::Spec->abs2rel($file, $ENV{CRITICIZE}),
            severity => $violation->severity(),
            policy => $violation->policy(),
            source => $violation->source(),
         };
      }
   }

   return encode_json({
      data => [ @problems ]
      });
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
