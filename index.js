var React = require('react');
var mongoose = require('mongoose');
var _ = require('underscore');

function getPropType(schemaType) {
    if (_.isArray(schemaType)) {
        if (schemaType.length > 0) {
            schemaType = _.head(schemaType);
            return React.PropTypes.arrayOf(getPropType(schemaType));
        } else {
            return React.PropTypes.array;
        }
    } else if (_.isObject(schemaType) && !_.isFunction(schemaType)) {
        var shape = {};
        _.each(schemaType, function(subType, name) {
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
        var root = _.head(pieces);
        expandedSchema[root] = expandedSchema[root] || {};
        expandPath(expandedSchema[root], _.rest(pieces), value);
    } else {
        expandedSchema[_.head(pieces)] = value;
    }
}

function generatePropTypes(Schema) {
    // Expand out dot paths
    var expandedSchema = {};
    _.each(Schema.paths, function(obj) {
        var pieces = obj.path.split('.');
        var type = obj.options.type;
        expandPath(expandedSchema, pieces, type);
    });

    // Map Mongoose schema types to React propTypes
    var propTypes = {};
    _.each(expandedSchema, function(type, propName) {
        propTypes[propName] = getPropType(type);
    });
    return propTypes;
}

module.exports = generatePropTypes;
