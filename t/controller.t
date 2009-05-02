#!perl

use strict;
use warnings;
use Test::More tests => 2;
use Test::WWW::Mechanize::CGIApp;
use FindBin;
use lib "$FindBin::Bin/../lib";

my $mech = Test::WWW::Mechanize::CGIApp->new(app => 'WebCritic::Controller');

$mech->get_ok( '?rm=main' );
$mech->get_ok( '?rm=criticisms' );

