package CSS::Tags;

use strict;
use warnings;

sub to_css_string {
   my $css = shift;
   join ' ', map {
      my $outer = $_;
      "$_ {".join(' ', map "$_: $css->{$outer}{$_};", keys %{$css->{$outer}})."}"
   } keys %{$css};
}

1;
