var args = arguments[0],
    TAG = "ProfileTile",
    libWidget = require("libWidget");

_.extend(this, {
    // these styles must be translated into real tss
    /* Array contains a definition of styles names
     * "Original style name": "#ViewID.property"
      */
    definition: {
        // Change one property
        "image": "#avatar.image", // warning: #label.font.fontSize
        "backgroundColor": "#container.backgroundColor",
        "name": "#name.text",
        "description": "#description.text",

        // Change an array of properties
        "borderRadius": ["#container.borderRadius", "#avatar.borderRadius"],

        "roundImage": function(boolean){
            return ["#avatar.borderRadius", boolean?25:0]; // RETURN ARRAY [rules, input]
        },

        // Apply style calculated from a fonction taking arg input
        //     "#border.backgroundColor": function(type){
        //         var colors = {
        //             blue: "#2980b9",
        //             green: "#27ae60",
        //             red: "#c0392b"
        //         };
        //         return colors[type];
        //     },
        //     "#inner.backgroundColor": function(type){
        //         var colors = {
        //             blue: "#3498db",
        //             green:"#2ecc71",
        //             red: "#e74c3c"
        //         };
        //         return colors[type];
        //     },
        // }
    },

    construct: function( config ) {
        // TODO: call librairie function with arguments:
        // container, config, definitions
        $.container.applyProperties(libWidget.parseConfig(this, config, $.definition));
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
    var opacity = $.container.opacity;
    $.container.opacity = 0.5;
    $.container.animate(Ti.UI.createAnimation({
        opacity: 1,
        duration: 300
    }));
}
