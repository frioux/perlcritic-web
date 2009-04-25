#!perl
use strict;
use warnings;
use Test::Simple tests => 1;

sub hello_world {
   return 'Hello World!';
}

ok hello_world eq 'Hello World!',
   'hello_world should have a sane result';


