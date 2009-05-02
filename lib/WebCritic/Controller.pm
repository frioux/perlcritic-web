package WebCritic::Controller;
use strict;
use warnings;
use base 'CGI::Application';
use feature ':5.10';
use CGI::Application::Plugin::AutoRunmode;
use JSON 'encode_json';
use WebCritic::Critic;
use Moose;

has critic => (
   is => 'ro',
   lazy => 1,
   init_arg => undef,
   builder => '_build_critic',
);

sub _build_critic {
   my $self = shift;
   my $dir = '/home/frew/personal/web_critic';
   return WebCritic::Critic->new( { directory => $self->param('dir') || '.' } );
}

sub main : StartRunmode {
   my $self = shift;
   my $html        = <<'HTML';
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
   <title>WebCritic: for your health!</title>
   <script type="text/javascript" src="/js/lib/ext3/adapter/ext/ext-base.js"></script>
   <script type="text/javascript" src="/js/lib/ext3/ext-all.js"></script>
   <link rel="stylesheet" type="text/css" href="/js/lib/ext3/resources/css/ext-all.css" />
   <script type="text/javascript" src="/js/lib/WebCritic/CriticGrid.js"></script>
   <script type="text/javascript" src="/js/main.js"></script>
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
   return encode_json( $self->critic->criticisms );
}

no Moose;
__PACKAGE__->meta->make_immutable;
