// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Configure Alloy to call widget's construct
var libWidget = require("libWidget");

/* Override Alloy.createWidget() and Alloy.createController to automatically call 
 * construct() function of a controller / widget after instantiating if any. 
 * See Alloy documentation for more details about both Alloy.createWidget() and
 * Alloy.createController() functions.
 * */
(function(_createWidget, _createController) {
    Alloy.createWidget = function(id, name, args) {
        var W = _createWidget(id, name, args);
        if (_.isFunction(W.construct)) W.construct.call(W, args);
        return W
    };
    Alloy.createController = function(name, args) {
        var C = _createController(name, args);
        if (_.isFunction(C.construct)) C.construct.call(C, args);
        return C; 
    };
})(Alloy.createWidget, Alloy.createController);
