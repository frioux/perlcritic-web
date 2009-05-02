#!perl
use strict;
use warnings;
use CGI::Application::Server;
use FindBin;
use lib "$FindBin::Bin/../lib";
use WebCritic::Controller;
use Readonly;
Readonly my $port => shift || 5053;
Readonly my $dir => shift || q{.};

my $server = CGI::Application::Server->new($port);
my $app = WebCritic::Controller->new(PARAMS => {
   dir => $dir
});

$server->entry_points({
      '/critic'     => $app
   });
$server->document_root("$FindBin::Bin/../static");
$server->run();

