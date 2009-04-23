#!/usr/bin/perl

use strict;
use warnings;
use feature ':5.10';
use IO::All;
use Carp;
use Readonly;
Readonly my $PORT => 7890;
use lib '../lib';
use WebCritic::Critic;

my $dir = shift;
my $port = shift || $PORT;

my $socket = io(":$port") or croak "server couldn't load on port $port";
say "server loaded on port $port";

my $critic = WebCritic::Critic->new({ directory => $dir });
while ( my $s = $socket->accept ) {
   say 'Servicing client';
   $s->print($critic->criticisms);
}
