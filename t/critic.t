#!/usr/bin/perl

use strict;
use warnings;
use Test::More tests => 5;
use Test::Exception;
use FindBin;
use lib "$FindBin::Bin/../lib";

BEGIN { use_ok 'WebCritic::Critic' };

throws_ok { WebCritic::Critic->new() }
   qr/Attribute \(directory\) is required/sm,
   q{didn't pass directory into constructor};

my $critic = WebCritic::Critic->new({
      directory => q{t/test_files}
   });

ok defined $critic && ref $critic eq 'WebCritic::Critic',
   'new() works';

ok $critic->get_directory eq q{t/test_files}, 'get_directory() works';
{
   my $source =q{print 'perl is cool!';};
   my $filename = 'fool.pl';
   my $location = [ 4, 1 ];
   is_deeply $critic->files_criticized->{'t/test_files/fool.pl'}->{'criticisms'}, [
      {
         source => $source,
         filename => $filename,
         location => $location,
         explanation => 'See pages 208,278 of PBP',
         policy => 'Perl::Critic::Policy::InputOutput::RequireCheckedSyscalls',
         severity => '1',
         description => 'Return value of flagged function ignored - print'
      },
      {
         source => $source,
         filename => $filename,
         location => $location,
         explanation => 'See page 431 of PBP',
         policy => 'Perl::Critic::Policy::TestingAndDebugging::RequireUseWarnings',
         severity => '4',
         description => 'Code before warnings are enabled'
      },
   ], 'should find errors in test file';
}
