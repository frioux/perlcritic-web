#!perl
use strict;
use warnings;
use CGI::Application::Server;
use FindBin;
use lib "$FindBin::Bin/../lib";
use WebCritic::Controller;

my $server = CGI::Application::Server->new(5053);
my $dir = shift || q{.};
my $app = WebCritic::Controller->new(PARAMS => {
   dir => $dir
});

$server->entry_points({
      '/critic'     => $app
   });
$server->document_root("$FindBin::Bin/../static");
$server->run();

