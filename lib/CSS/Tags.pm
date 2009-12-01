package CSS::Tags;

use strict;
use warnings;

use Perl6::Gather;

sub to_css_string {
   my $css = shift;

   return join q{ }, gather {
      while (my ($selector, $declarations) = splice(@{$css}, 0, 2)) {
         take "$selector "._generate_declarations($declarations)
      }
   };
}

sub _generate_declarations {
   my $declarations = shift;

   return '{'.join(q{;}, gather {
      while (my ($property, $value) = splice(@{$declarations}, 0, 2)) {
         take "$property:$value"
      }
   }).'}';
}

1;
