#!/usr/bin/perl

use strict;
use warnings;
use feature ':5.10';
use Socket;
use Carp;
use constant PORT => 7890;
use lib '../lib';
use WebCritic::Critic;

my $dir = shift;
my $port = shift || PORT;
my $proto = getprotobyname 'tcp';

# create a socket, make it reusable
socket SERVER, PF_INET, SOCK_STREAM, $proto or croak "socket: $!";
setsockopt SERVER, SOL_SOCKET, SO_REUSEADDR, 1 or croak "setsock: $!";

# grab a port on this machine
my $paddr = sockaddr_in( $port, INADDR_ANY );

# bind to a port, then listen
bind SERVER, $paddr or croak "bind: $!";
listen SERVER, SOMAXCONN or croak "listen: $!";
say "SERVER started on port $port ";

my $client_addr;
my $critic = WebCritic::Critic->new({ directory => $dir });
while ( $client_addr = accept CLIENT, SERVER ) {

    # find out who connected
    my ( $client_port, $client_ip ) = sockaddr_in($client_addr);
    my $client_ipnum = inet_ntoa($client_ip);
    my $client_host = gethostbyaddr $client_ip, AF_INET;

    # print who has connected
    say "got a connection from: $client_host", "[$client_ipnum] ";

    # send them a message, close connection
    say CLIENT $critic->criticisms;
    close CLIENT or croak "couldn't close connection! $@";
}
