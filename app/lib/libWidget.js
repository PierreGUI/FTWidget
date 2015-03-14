var TAG = "libWidget";
/*
 * Extend Alloy's createWidget and createController to call construct during
 * controller's initialization (with normal alloy arguments).
 */
exports.init = function() {
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
};

var parseStyle = function(object, rules, input) {
    // Change one property from string
    if(_.isString(rules)) {
        Ti.API.info(TAG, "parseStyle string", rules, input);
        var update = {},
            splited = rules.split("."),
            id = splited.shift(),
            attributes = splited.join("."); // TODO: does this work on a 2 levels context ?
            attribute = {},
        attribute[attributes] = input
        // There might already be rules for this id
        if(object.hasOwnProperty(id)) {
            return _.extend(object[id], attribute);
        } else {
            update[id] = attribute;
            return _.extend(object, update);
        }
    }
    // Call a fonction taking input style as a param, and returns rules
    else if(_.isFunction(rules)) {
        Ti.API.info(TAG, "parseStyle function", input);
        return parseStyle.apply(null, _.union([object], rules(object, rules, input)));
    }
    // Change an array of properties
    else if(_.isArray(rules)) {
        Ti.API.info(TAG, "parseStyle array", rules, input);
        _.each(rules, function(rule){
            return parseStyle(object, rule, input);
        });
    }
    // Object: call fonction and apply result as input
    else if(_.isObject(rules)) {
        Ti.API.info(TAG, "parseStyle Object", rules, input);
        _.each(rules, function(rule, key){
            if(_.isFunction(rule)) {
                parseStyle(object, key, rule([input]));
            }
        });
    } else {
        Ti.API.error(TAG, "parseStyle failed with", object, rules, input);
    }
}

exports.parseConfig = function(widget, config, definition) {
    Ti.API.debug(TAG, "parseConfig", definition, config);
    var styles = {};
    if(_.isObject(definition) && _.isObject(config)) {
        _.each(config, function(value, key){
            if(definition.hasOwnProperty(key)) {
                parseStyle(styles, definition[key], value);
                delete config[key];
            } else {
                Ti.API.error(TAG, "parseConfig unknown rule", key);
            }
        });
    } else {
        Ti.API.error(TAG, "parseConfig failed with", definition, config);
    }
    Ti.API.debug(TAG, "parseConfig processed styles", styles);
    widget.updateViews(styles);
    return config;
}
