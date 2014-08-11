mongoose-proptypes
==================

Generate React PropTypes for your Mongoose schema.

```
npm install mongoose-proptypes
```

## API

```js
var generatePropTypes = require('mongoose-proptypes');
var mySchema = require('./schema.js');

var Component = React.createClass({
    propTypes: {
        data: generatePropTypes(mySchema),
        ...
    },

    ...
});
```

## License

MIT.
