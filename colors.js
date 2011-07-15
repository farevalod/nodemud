// prototypes the string object to have additional method calls that add terminal colors
var isHeadless = (typeof module !== 'undefined');
['bold', 'underline', 'italic', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'].forEach(function (style) {

  // __defineGetter__ at the least works in more browsers
  // http://robertnyman.com/javascript/javascript-getters-setters.html
  // Object.defineProperty only works in Chrome
  String.prototype.__defineGetter__(style, function () {
    return isHeadless ?
             stylize(this, style) : // for those running in node (headless environments)
             this.replace(/( )/, '$1'); // and for those running in browsers:
             // re: ^ you'd think 'return this' works (but doesn't) so replace coerces the string to be a real string
  });
});

// prototypes string with method "rainbow"
// rainbow will apply a the color spectrum to a string, changing colors every letter
String.prototype.__defineGetter__('rainbow', function () {
  if (!isHeadless) {
    return this.replace(/( )/, '$1');
  }
  var rainbowcolors = ['red','yellow','green','blue','magenta']; //RoY G BiV
  var exploded = this.split("");
  var i=0;
  exploded = exploded.map(function(letter) {
    if (letter==" ") {
      return letter;
    }
    else {
      return stylize(letter,rainbowcolors[i++ % rainbowcolors.length]);
    }
  });
  return exploded.join("");
});

function stylize(str, style) {
  var styles = {
  //styles
  'bold'      : [1,  22],
  'italic'    : [3,  23],
  'underline' : [4,  24],
  'inverse'   : [7,  27],
  //grayscale
  'white'     : [37, 39],
  'grey'      : [90, 39],
  'black'     : [90, 39],
  //colors
  'blue'      : [34, 39],
  'cyan'      : [36, 39],
  'green'     : [32, 39],
  'magenta'   : [35, 39],
  'red'       : [31, 39],
  'yellow'    : [33, 39]
  };
  return '\033[' + styles[style][0] + 'm' + str +
         '\033[' + styles[style][1] + 'm';
};
