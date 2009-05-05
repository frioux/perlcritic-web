package WebCritic::Critic;
use Moose;
use Moose::Autobox;
use Perl::Critic;
use File::Find::Rule;
use File::Spec;
use File::stat;
use Carp qw(croak);
use Method::Signatures::Simple;

has directory => (
   is       => 'rw',
   isa      => 'Str',
   required => 1,
   reader   => 'get_directory',
   writer   => 'set_directory',
);

has critic => (
   is       => 'ro',
   lazy     => 1,
   builder  => '_build_critic',
   init_arg => undef
);

method _build_critic {
   my $dir  = $self->get_directory;
   return Perl::Critic->new(
      -e "$dir/.perlcriticrc"
      ? ( -profile => "$dir/.perlcriticrc" )
      : ( -severity => 'brutal', -theme => 'core' )
   );
}

method criticisms {
   return {
      data => $self->files_criticized->values->map(sub { @{ $_->{criticisms} } })
   };
}

method files_criticized {
   my @files
      = File::Find::Rule->file()->name( '*.pm', '*.pl', '*.plx', '*.t' )
      ->in( $self->get_directory );

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

      next if ( $current_file->{timestamp} eq $mtime );

      $current_file->{timestamp}  = $mtime;
      $current_file->{criticisms} = [];

      my @violations = $critic->critique($file);
      foreach my $violation (@violations) {
         $current_file->{criticisms}->push({
            description => $violation->description(),
            explanation => $violation->explanation(),
            location    => [ @{ $violation->location() }[ 0 .. 1 ] ],
            filename    => File::Spec->abs2rel( $file, $self->get_directory ),
            severity    => $violation->severity(),
            policy      => $violation->policy(),
            source      => $violation->source(),
         });
      }
   }

   $self->{files_criticized} = $new_files_criticized;
}

no Moose;
__PACKAGE__->meta->make_immutable;
