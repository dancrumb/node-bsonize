'use strict';

var fs = require('fs');

if (!global.Promise) {
  global.Promise = function () {
    console.error('`bsonize` requires `Promise` but neither `bluebird` nor ' +
      'the native `Promise` implementation were found.');
    console.error('Please install `bluebird` yourself.');
    process.exit(1);
  };
}

var bson = require('bson').BSONPure.BSON;
var thenify = require('thenify').withCallback;

/**
 * Serializes an object/array to BSON.
 *
 * ```js
 * bsonize.serialize([ 1, 234, 56, 78, 9 ]);
 * //=> <Buffer 28 00 00 00 10 ..>
 * ```
 *
 * @param {Object|Array} obj The object/array to serialize.
 * @returns {Buffer} Result in BSON.
 * @api public
 */
exports.serialize = function (obj) {
  var size = bson.calculateObjectSize(obj);
  var buffer = new Buffer(size);

  bson.serializeWithBufferAndIndex(obj, null, buffer, 0);

  return buffer;
};

/**
 * Deserializes an object/array from BSON.
 *
 * ```js
 * var buffer = new Buffer('IQAAABAwAJQmAAAQMQAFAAAAEDIAKwAAABAzABUAAAAA', 'base64');
 *
 * bsonize.deserialize(buffer);
 * //=> { 0: 9876, 1: 5, 2: 43, 3: 21 }
 *
 * bsonize.deserialize(buffer, true);
 * //=> [ 9876, 5, 43, 21 ]
 * ```
 *
 * @param {Buffer} buffer The buffer contains BSON data.
 * @param {Boolean} [isArray=false] Whether result is an array or not.
 * @returns {Object|Array} The object/array after deserialize.
 * @api public
 */
exports.deserialize = function (buffer, isArray) {
  return bson.deserialize(buffer, null, isArray);
};

/**
 * Serializes an object/array to BSON and write to file.
 *
 * ```js
 * bsonize.serializeToFile('data.bson', [ 1, 234, 56, 78, 9 ], function (err, buffer) {
 *   console.log(buffer);
 *   //=> <Buffer 28 00 00 00 10 ..>
 * });
 * ```
 *
 * @param {String} file File path.
 * @param {Object|Array} obj The array/object to serialize.
 * @param {Function} [cb] Callback function. The buffer contains BSON data after serialize will be passed to.
 * @returns {Promise} A promise will be returned if callback function is not set.
 * @api public
 */
exports.serializeToFile = thenify(function (file, obj, cb) {
  var buffer = exports.serialize(obj);

  fs.writeFile(file, buffer, function (err) {
    if (err) {
      return cb(err);
    }

    cb(null, buffer);
  });
});

/**
 * Deserializes an object/array from BSON file.
 *
 * ```js
 * bsonize.deserializeFromFile('data.bson', function (err, obj) {
 *   console.log(obj);
 *   //=> { 0: 9876, 1: 5, 2: 43, 3: 21 }
 * });
 *
 * bsonize.deserializeFromFile('data.bson', true, function (err, arr) {
 *   console.log(arr);
 *   //=> [ 9876, 5, 43, 21 ]
 * });
 * ```
 *
 * @param {String} file File path.
 * @param {Boolean} [isArray=false] Whether result is an array or not.
 * @param {Function} [cb] Callback function. The deserialized object/array will be passed to.
 * @returns {Promise} A promise will be returned if callback function is not set.
 * @api public
 */
exports.deserializeFromFile = thenify(function (file, isArray, cb) {
  if (typeof isArray === 'function') {
    cb = isArray;
    isArray = false;
  }

  fs.readFile(file, function (err, buffer) {
    if (err) {
      return cb(err);
    }

    var obj = bson.deserialize(buffer, null, isArray);

    cb(null, obj);
  });
});
