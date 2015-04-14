var args = arguments[0],
    TAG = "ProfileTile",
    libWidget = require("libWidget").newInstance();

_.extend(this, {
    // these styles must be translated into real tss
    /* Array contains a definition of styles names
     * "Original style name": "#ViewID.property"
     */

    construct: function( config ) {
        // TODO: call librairie function with arguments:
        // container, config, defi
        libWidget.addRules({
            "title": "#name", 
            "description": "#description.text",
            "image": "#avatar.image",
            "separatorColor": "#separator.backgroundColor",
            "avatarRadius": "#avatar.borderRadius",
            "roundImage": function(isRounded) {
                libWidget.setProperty("#avatar", "borderRadius", isRounded ? 25 : 0);
            },
        });
        $.container.applyProperties(libWidget.parseAndApplyConfig(this, config));

        // TEST: write rules from TSS (pb: functions)
        // var def = $.createStyle({
        //     id: "definition"
        // });
        // Ti.API.debug(TAG, def);
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
