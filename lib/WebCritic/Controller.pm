#!perl
use Web::Simple 'WebCritic::Controller';
{
   package WebCritic::Controller;
   use WebCritic::Critic;
   use JSON ();

   my $critic = WebCritic::Critic->new({ directory => q{.} });

   my $main = do {
      use HTML::Tags;
      use CSS::Declare;
      join '', HTML::Tags::to_html_string(
         <html>, <head>,
         <title>,"WebCritic: for your health!",</title>,
         <script type="text/javascript" src="/static/js/lib/jquery-1.3.2.min.js">,</script>,
         <script type="text/javascript" src="/static/js/lib/jquery.hotkeys-0.7.9.min.js">,</script>,
         <script type="text/javascript" src="/static/js/lib/tablesorter.js">,</script>,
         <script type="text/javascript" src="/static/js/main.js">,</script>,
         <style>,
         CSS::Declare::to_css_string([
               "*" => [ font_size '11px', font_family 'arial' ],

               table    => [ border_collapse 'collapse' ],
               'td, tr' => [ border_top '1px solid grey', ],

               '.very-minor' => [ background '#FEE' ],
               '.minor'      => [ background '#FCC' ],
               '.medium'     => [ background '#F88' ],
               '.major'      => [ background '#F44' ],
               '.very-major' => [ background '#F00' ],

               '.filename, .location, .explanation, .policy, .source' => [ color 'grey' ],

               '#help' => [
                  float 'right', padding '.5em', background_color '#CFD4E8',
                  border '1px solid #B3BDE8',
                  '-moz-border-radius'    => '5px',
                  '-webkit-border-radius' => '5px',
               ],
               '#help ul' => [ list_style_type 'none', padding 0, margin 0 ],
         ]),
         </style>,
         </head>,
         <body>,
            <div id="help">,
               <ul>,
                  <li>, "[1] ", <a href="javascript:WebCritic.toggleSeverity()">, "toggle severity", </a>, </li>,
                  <li>, "[2] ", <a href="javascript:WebCritic.toggleFile()">, "toggle file", </a>, </li>,
                  <li>, "[3] ", <a href="javascript:WebCritic.toggleLocation()">, "toggle location", </a>, </li>,
                  <li>, "[4] ", <a href="javascript:WebCritic.toggleDescription()">, "toggle description", </a>, </li>,
                  <li>, "[5] ", <a href="javascript:WebCritic.toggleExplanation()">, "toggle explanation", </a>, </li>,
                  <li>, "[6] ", <a href="javascript:WebCritic.togglePolicy()">, "toggle policy", </a>, </li>,
                  <li>, "[7] ", <a href="javascript:WebCritic.toggleSource()">, "toggle source", </a>, </li>,
                  <li>, "[a] ", <a href="javascript:WebCritic.showAllColumns()">, "show all", </a>, </li>,
                  <li>, "[d] ", <a href="javascript:WebCritic.showDefaultColumns()">, "show default columns", </a>, </li>,
                  <li>, "[h] ", <a href="javascript:WebCritic.toggleHelp()">, "toggle help", </a>, </li>,
               </ul>,
            </div>,
            <div id="criticisms">,</div>,
         </body>,
         </html>
      );
   };

   sub main {
      return [ 200, [ 'Content-type', 'text/html' ], [ $main ] ];
   }

   sub criticisms {
      return [ 200, [ 'Content-type', 'application/json' ], [ JSON::encode_json( $critic->criticisms )] ];
   }

   dispatch {
      sub (/) { $self->main },
      sub (/criticisms) { $self->criticisms },
      sub (/static/**) {
         my $file = $_[1];
         open my $fh, '<', "static/$file" or return [ 404, [ 'Content-type', 'text/html' ], [ 'file not found']];
         local $/ = undef;
         my $data = <$fh>;
         close $fh or return [ 500, [ 'Content-type', 'text/html' ], [ 'Internal Server Error'] ];
         [ 200, [ 'Content-type' => 'text/html' ], [ $data ] ]
      },
   };
}

WebCritic::Controller->run_if_script;
