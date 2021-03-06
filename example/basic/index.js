import Terminal from 'reterm';

const t = new Terminal;

t.onTerminalReady = function() {

  // Create a new terminal IO object and give it the foreground.
  // (The default IO object just prints warning messages about unhandled
  // things to the the JS console.)
  var io = t.io.push();

  io.onVTKeystroke = function(str) {
    // Do something useful with str here.
    // For example, Secure Shell forwards the string onto the NaCl plugin.
  };

  io.sendString = function(str) {
    // Just like a keystroke, except str was generated by the
    // terminal itself.
    // Most likely you'll do the same this as onVTKeystroke.
  };

  io.onTerminalResize = function(columns, rows) {
    // React to size changes here.
    // Secure Shell pokes at NaCl, which eventually results in
    // some ioctls on the host.
  };

  // You can call io.push() to foreground a fresh io context, which can
  // be uses to give control of the terminal to something else.  When that
  // thing is complete, should call io.pop() to restore control to the
  // previous io object.
};

t.decorate(document.querySelector('#terminal'));

t.io.print('Print a string without a newline');
t.io.println('Print a string and add CRLF');
