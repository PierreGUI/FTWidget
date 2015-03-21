# FTWidget
A small framework to create and customise Alloy Widgets from controller

**Example:** create a button and attach custom styles.

![alt text](https://github.com/PierreGUI/FTWidget/blob/master/documentation/screen0.png "Logo Title Text 1")

## How to install

# Submodules
Some demo widget can require git submodules, after cloning:
```
cd FTWidget
git submodule init
git submodule update
```

(Thanks @timanrebel)

In your `app/alloy.js` add a line to have Alloy calling the `construct` method of the widgets automatically:
```
// Configure Alloy to call widget's construct
var libWidget = require("libWidget");
```

Copy example `FTWidget` folder in `widgets` folder and add to your `config.json`:
```
"dependencies": {
	"FTWidget":"1.0"
}
```

You can add the widget in any `View.xml` (except ListViews :p):
```
<Widget src="FTWidget" id="example" onClick="onClick" />
```

Here is a sample of the TSS you can apply:
```
"#example": {
    top: 20, bottom: 20,
    left: 5, right: 5,
    text: "Button!",
    buttonType: "red",
    borderRadius: 5,
    enabled: true
}
```

## How it works
In the Widget, when extending local context you can define the `definition` object. It contains rules describing how to dispatch TSS properties from controller over Widget's views:
```
_.extend(this, {
    /* Array contains a definition of styles names
     * "Original style name": "#ViewID.property"
     */
    definition: {

        // Change one property
        "text": "#label.text",
        "borderColor": "#border.backgroundColor",
        "backgroundColor": "#inner.backgroundColor",

        // Change an array of properties
        "borderRadius": ["#inner.borderRadius", "#border.borderRadius"],

        // Apply a function, takes input as parameter
        "enabled": function(object, rule, boolean){
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
```
