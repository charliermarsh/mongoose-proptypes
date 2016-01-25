var React = require('react');
var mongoose = require('mongoose');

function getPropType(schemaType) {
    if (Array.isArray(schemaType)) {
        if (schemaType.length > 0) {
            schemaType = schemaType[0];
            return React.PropTypes.arrayOf(getPropType(schemaType));
        } else {
            return React.PropTypes.array;
        }
    } else if (typeof schemaType === 'object' && typeof schemaType !== 'function') {
        var shape = {};
        schemaType.forEach(function(subType, name) {
            shape[name] = getPropType(subType);
        });
        return React.PropTypes.shape(shape);
    } else {
        switch (schemaType) {
            case String:
                return React.PropTypes.string;

            case Boolean:
                return React.PropTypes.bool;

            case Number:
                return React.PropTypes.number;

            case mongoose.Schema.Types.Mixed:
                return React.PropTypes.any;

            default:
                return React.PropTypes.object;
        }
    }
}

function expandPath(expandedSchema, pieces, value) {
    if (pieces.length > 1) {
        var root = pieces[0];
        expandedSchema[root] = expandedSchema[root] || {};
        expandPath(expandedSchema[root], pieces.slice(1), value);
    } else {
        expandedSchema[pieces[0]] = value;
    }
}

function generatePropTypes(Schema) {
    // Expand out dot paths
    var expandedSchema = {};
    Schema.paths.forEach(function(obj) {
        var pieces = obj.path.split('.');
        var type = obj.options.type;
        expandPath(expandedSchema, pieces, type);
    });

    // Map Mongoose schema types to React propTypes
    var propTypes = {};
    expandedSchema.forEach(function(type, propName) {
        propTypes[propName] = getPropType(type);
    });
    return propTypes;
}

module.exports = generatePropTypes;
