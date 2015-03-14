/*
 * Extend Alloy's createWidget and createController to call construct during
 * controller's initialization (with normal alloy arguments).
 */
(function configure() {
    var _alloy_createWidget = Alloy.createWidget;
        var _alloy = {
            createWidget    : Alloy.createWidget,
            createController: Alloy.createController
        };
        Alloy = _.extend(Alloy, {
            /**
             * @method createWidget
             * Factory method for instantiating a widget controller. Creates and returns an instance of the
             * named widget.
             * @param {String} id Id of widget to instantiate.
             * @param {String} [name="widget"] Name of the view within the widget to instantiate ('widget' by default)
             * @param {Object} [args] Arguments to pass to the widget.
             * @return {Alloy.Controller} Alloy widget controller object.
             */
            createWidget: function(id, name, args) {
                var W = _alloy.createWidget(id, name, args);
                if( _.isFunction(W.construct) ) {
                    W.construct.call(W, args);
                }
            	return W;
            },
            /**
             * @method createController
             * Factory method for instantiating a controller. Creates and returns an instance of the
             * named controller.
             * @param {String} name Name of controller to instantiate.
             * @param {Object} [args] Arguments to pass to the controller.
             * @return {Alloy.Controller} Alloy controller object.
             */
            createController: function(name, args) {
                var C = _alloy.createController(name, args);
                if( _.isFunction(C.construct) ) {
                    C.construct.call(C, args);
                }
            	return C;
            }
        });
})();
