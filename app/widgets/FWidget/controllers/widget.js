var args = arguments[0],
    TAG = "testWidget";

function parseStyle(object, rules, input) {
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

function parseConfig(definition, config) {
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
    $.updateViews(styles);
    return config;
}

_.extend(this, {
    // these styles must be translated into real tss
    /* Array contains a definition of styles names
     * "Original style name": "#ViewID.property"
      */
    definition: {
        // Change one property
        "text": "#label.text", // warning: #label.font.fontSize
        "borderColor": "#border.backgroundColor",
        "backgroundColor": "#inner.backgroundColor",

        // Change an array of properties
        "borderRadius": ["#inner.borderRadius", "#border.borderRadius"],

        // Apply a function, takes input as parameter
        "enabled": function(boolean){
            return ["#border.opacity", boolean?1:0.5]; // RETURN ARRAY [rules, input]
        },

        // Apply style calculated from a fonction taking arg input
        "buttonType": {
            "#border.backgroundColor": function(type){
                var colors = {
                    blue: "#2980b9",
                    green: "#27ae60",
                    red: "#c0392b"
                };
                return colors[type];
            },
            "#inner.backgroundColor": function(type){
                var colors = {
                    blue: "#3498db",
                    green:"#2ecc71",
                    red: "#e74c3c"
                };
                return colors[type];
            },
        }
    },

    construct: function( config ) {
        // TODO: call librairie function with arguments:
        // container, config, definitions
        $.border.applyProperties(parseConfig($.definition, config));
    },

    addEventListener: function(type, callback) {
        $.on(type, callback);
    },

    removeEventListener: function(type, callback) {
        $.off(type, callback);
    },

    destruct: function() {
        $.off("click");
    }
});

function onClick(evt) {
    // Trigger Backbone event
    $.trigger("click", evt);
    // Animation on opacity
    var opacity = $.border.opacity;
    $.border.opacity = 0.5;
    $.getView().animate(Ti.UI.createAnimation({
        opacity: 1,
        duration: 300
    }));
}
