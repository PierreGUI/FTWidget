# FWidget
A small framework to create and customise Alloy Widgets from controller

**Example:** create a button and attach custom styles.
![alt text](https://github.com/PierreGUI/FWidget/blob/master/documentation/screen0.png "Logo Title Text 1")

## How to install

In your `app/alloy.js` add a line to have Alloy calling the `construct` method of the widgets automatically:
```
// Configure Alloy to call widget's construct
var libWidget = require("libWidget");
```

Copy example `FWidget` folder in `widgets` folder and add to your `config.json`:
```
"dependencies": {
	"FWidget":"1.0"
}
```

You can add the widget in any `View.xml` (except ListViews :p):
```
<Widget src="FWidget" id="example" onClick="onClick" />
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

