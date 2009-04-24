package WebCritic::Dispatch;
use base 'CGI::Application::Dispatch';
use strict;
use warnings;

sub dispatch_args {
   return {
      prefix => 'WebCritic',
      table  => [
         q{}         => { app => 'Controller', rm => 'main' },
         ':app/:rm?' => {},
      ],
   };
}

1;
