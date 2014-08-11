mongoose-proptypes
==================

Generate React PropTypes for your Mongoose schema.

```
npm install mongoose-proptypes
```

## API

The exported function returns a JavaScript object that can be plugged in as a React
component's `propTypes` property and mirrors the provided Mongoose schema.

```js
var generatePropTypes = require('mongoose-proptypes');
var mySchema = require('./schema.js');

var Component = React.createClass({
    propTypes: {
        data: React.PropTypes.shape(generatePropTypes(mySchema)),
        ...
    },

    // Or, if you want to flatten out your props...
    propTypes: generatePropTypes(mySchema)
});
```

## License

MIT.
