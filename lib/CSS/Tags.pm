package CSS::Tags;

use strict;
use warnings;

use Perl6::Gather;

my $IN_SCOPE = 0;

sub import {
  die "Can't import XML::Tags into a scope when already compiling one that uses it"
    if $IN_SCOPE;
  my ($class, @args) = @_;
  my $opts = shift(@args) if ref($args[0]) eq 'HASH';
  my $target = $class->_find_target(0, $opts);
  my $unex = $class->_export_tags_into($target);
  $class->_install_unexporter($unex);
  $IN_SCOPE = 1;
}

sub _find_target {
  my ($class, $extra_levels, $opts) = @_;
  return $opts->{into} if defined($opts->{into});
  my $level = ($opts->{into_level} || 1) + $extra_levels;
  return (caller($level))[0];
}

my @properties = qw{
background
background_color
border
border_collapse
border_top
color
float
font_family
font_size
list_style_type
margin
padding
};

sub _export_tags_into {
  my ($class, $into) = @_;
   for my $property (@properties) {
      my $property_name = $property;
      $property_name =~ tr/_/-/;
      no strict 'refs';
      *{"$into\::$property"} = sub ($) { return ($property_name => $_[0]) };
   }
  return sub {
    foreach my $property (@properties) {
      no strict 'refs';
      delete ${"${into}::"}{$property}
    }
    $IN_SCOPE = 0;
  };
}

sub _install_unexporter {
  my ($class, $unex) = @_;
  $^H |= 0x120000; # localize %^H
  $^H{'CSS::Tags::Unex'} = bless($unex, 'CSS::Tags::Unex');
}

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

package CSS::Tags::Unex;

sub DESTROY { local $@; eval { $_[0]->(); 1 } || warn "ARGH: $@" }

1;
