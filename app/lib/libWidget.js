var LibWidget = function () {
    this.TAG = "libWidget";
    this.reset();
};

LibWidget.prototype = {
    _applyRule: function (ruleId, inputValue) {
        /**
         * Apply a rule once the input value is known.
         * @param {str} ruleId The rule's public identifier; should correspond to a previously
         *  defined rule.
         * @param {str} inputValue The value read from the config file that has to be set.
         * @return {boolean} true if the rule exist and have been applied, false otherwise.
         * */
        /* Grab the related rule, which is an array of either properties or functions. */
        if (!_.has(this.rules, ruleId)) { return false; }
        Ti.API.debug(this.TAG, "Apply rule", ruleId, JSON.stringify(inputValue));
        var rule = this.rules[ruleId];
        //Ti.API.debug(this.TAG, "Rule targets => ", rule);
        /* Browse each target of the rule to build corresponding property */
        _.each(rule, function (target) {
            Ti.API.debug(this.TAG, "Rule's target", target);
            /* Basic case, target is a string which represent the corresponding property to set */
            if (_.isString(target)) {
                var elementId = target.match(/^(#[^\.]+)\.?/)[1];
                if (_.isObject(inputValue)) {
                    /* First case, the input is an object, so only the id considered */
                    _.each(inputValue, function (propertyValue, propertyName) {
                        this.setProperty(elementId, propertyName, propertyValue);
                    }, this);
                } else {
                    /* The input is a value that should be assigned to the given property under the
                     * given element id */
                    var propertyChain = target.split(elementId)[1].substr(1);
                    this.setProperty(elementId, propertyChain, inputValue);
                }
            } else if (_.isFunction(target)) {
                /* If the target is a function, then, just execute the function; The function should be
                 * in charge of declaring properties if any. */
                target(inputValue);
            }
        }, this);
        return true;
    },

    parseAndApplyConfig: function (widget, config) {
        Ti.API.debug(this.TAG, "parseConfig", config);
        if (_.isObject(config)) {
            _.each(config, function (value, key) {
                if (this._applyRule(key, value)) { delete config[key]; }
            }, this);
        } else {
            Ti.API.error(this.TAG, "parseConfig failed with", config);
        }
        Ti.API.debug(this.TAG, "parseConfig processed styles", this.styleProperties);
        Ti.API.debug(this.TAG, JSON.stringify(this.styleProperties));
        widget.updateViews(this.styleProperties);
        return config;
    },

    addRule: function (publicIdentifier, target) {
        /**
        * Add a rule to the rules set;
        * @param {str} publicIdentifier The id use to access an internal style property in the module
        * @param {mixed} target The targeted property in the widget or a  process/function that
        *   would rather handle the property value into some special treatment instead of blindy bind
        *   it to a targetted identifier.
        * */
        //Ti.API.debug(this.TAG, "Adding rule to the set", publicIdentifier, target);
        if (!_.has(this.rules, publicIdentifier)) { this.rules[publicIdentifier] = []; }
        this.rules[publicIdentifier] = this.rules[publicIdentifier].concat(_.flatten([target]));
    },

    addRules: function (rules) {
         /**
         * Used to define several rules in one call. See addRule for more details.
         * @param {Object} rules All rules to define. Keys will be used as public identifier, and
         *  values as targets.
         */
        _.each(rules, function (target, id) { this.addRule(id, target); }, this);
    },

    setProperty: function (id, propertyChain, value) {
        /**
         * Add a new style property to the list.
         * @param {str} id The property id, as referenced in the View.
         * @param {str} propertyChain The property that have to be set. Might be a nested
         *  property such as my.nested.property
         * @value {mixed} value The value that has to be set, str or Number.
         */

        /* Properties might be simple such as 'backgroundColor', or more complex such as
         * 'font.fontFamily'; In both case, we have to re-build a corresponding object */
        if (!_.has(this.styleProperties, id)) { this.styleProperties[id] = {}; }

        propertyChain = propertyChain.split(".");
        var lastProperty = propertyChain.pop(),
            currentRootObject = this.styleProperties[id];

        _.each(propertyChain, function (property) {
            currentRootObject = (currentRootObject[property] = {});
        });

        /* Finally, set the value as the last element of our tree */
        currentRootObject[lastProperty] = value;
    },

    getAccessibleFunctions: function () {
        /**
         * Use to build an object of accessible functions from the outside.
         * @return An object of all public/accessible functions
         * */
        /* Select all functions */
        var _exports = _.omit(this.__proto__, 'getAccessibleFunctions', '_applyRule'),
            self = this;
        /* Then, wrap them into callable ... callers */
        return _.object(_.map(_exports, function (accessibleFunction, name) {
            return [name, function() { accessibleFunction.apply(self, arguments); }];
        }));
    },

    reset: function () {
        this.styleProperties = {};
        this.rules = {};
    }
};

/* Make the exports */
_.extend(exports, {
    newInstance: function() {
        var libWidgetInstance = new LibWidget();
        return libWidgetInstance.getAccessibleFunctions();
    }
});
