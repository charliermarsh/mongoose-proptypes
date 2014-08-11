var mongoose = require('mongoose');
var React    = require('react');
var assert   = require('assert');
var sinon    = require('sinon');
var _        = require('underscore');

var generatePropTypes = require('./index.js');

var schema = mongoose.Schema({
    name:    String,
    binary:  Buffer,
    living:  Boolean,
    updated: { type: Date, default: Date.now },
    age:     { type: Number, min: 18, max: 65 },
    mixed:   mongoose.Schema.Types.Mixed,
    _someId: mongoose.Schema.Types.ObjectId,
    array:      [],
    ofString: [String],
    nested: {
        stuff: { type: String, lowercase: true, trim: true }
    }
});

// Create spies for nested propTypes
var arrayOfSpy = sinon.spy(React.PropTypes, "arrayOf");
var shapeSpy = sinon.spy(React.PropTypes, "shape");
var generated = generatePropTypes(schema);

assert(arrayOfSpy.calledWith(React.PropTypes.string));
assert(shapeSpy.calledWith({
    stuff: React.PropTypes.string
}));

// Test remaining (primitive) propTypes
var target = {
    name: React.PropTypes.string,
    binary: React.PropTypes.object,
    living: React.PropTypes.bool,
    updated: React.PropTypes.object,
    age: React.PropTypes.number,
    mixed: React.PropTypes.any,
    _someId: React.PropTypes.object,
    array: React.PropTypes.array
};

_.each(target, function(propType, propName) {
    assert.deepEqual(propType, generated[propName]);
});
