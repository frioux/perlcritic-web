package WebCritic::Critic;
use strict;
use warnings;
use feature ':5.10';

use JSON 'encode_json';
use Perl::Critic;
use File::Find::Rule;
use File::Spec;
use File::stat;
use Carp;

sub new {
   my $class = shift;
   my $args  = shift;
   my $self  = {};
   bless $self, $class;
   my $directory = $args->{directory}
      or croak q{didn't pass a directory into constructor};
   $self->{files_criticized} = {};
   $self->directory( $args->{directory} );
   return $self;
}

sub directory {
   my $self = shift;
   my $dir  = shift;
   if ($dir) {
      $self->{directory} = $dir;
   }
   return $self->{directory};
}

sub critic {
   my $self = shift;
   my $dir  = $self->directory;
   if ( !$self->{critic} ) {
      if ( -e "$dir/.perlcriticrc" ) {
         $self->{critic}
            = Perl::Critic->new( -profile => "$dir/.perlcriticrc" );
      }
      else {
         $self->{critic} = Perl::Critic->new( -severity => 'brutal', -theme => 'core' );
      }
   }
   return $self->{critic};
}

sub criticisms {
   my $self = shift;
   my $files_criticized = $self->files_criticized;

   return encode_json(
      {  data => [ map { @{ $_->{criticisms} } } values %{$files_criticized} ]
      }
   );
}

sub files_criticized {
   my $self = shift;
   my @files = File::Find::Rule->file()->name( '*.pm', '*.pl', '*.plx', '*.t' )
      ->in( $self->directory );

   my $files_criticized = $self->{files_criticized};
   my $critic           = $self->critic;

   my $new_files_criticized = {};

   foreach my $file (@files) {
      my $mtime = stat($file)->mtime or croak qq{couldn't stat file $file};
      if ( !$files_criticized->{$file} ) {
         $files_criticized->{$file} = { timestamp => 0, };
      }

      my $current_file = $files_criticized->{$file};
      $new_files_criticized->{$file} = $current_file;

      if ( $current_file->{timestamp} eq $mtime ) {
         next;
      }

      $current_file->{timestamp} = $mtime;
      $current_file->{criticisms} = [];

      my @violations = $critic->critique($file);
      foreach my $violation (@violations) {
         push @{ $current_file->{criticisms} },
            {
            description => $violation->description(),
            explanation => $violation->explanation(),
            location    => [ @{ $violation->location() }[ 0 .. 1 ] ],
            filename    => File::Spec->abs2rel( $file, $self->directory ),
            severity    => $violation->severity(),
            policy      => $violation->policy(),
            source      => $violation->source(),
            };
      }
   }

   $self->{files_criticized} = $new_files_criticized;
}

1;
