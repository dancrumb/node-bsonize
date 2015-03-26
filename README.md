# bsonize

BSON serialization and deserialization.

## Installation

```sh
npm i bsonize -S
```

## API documentation

* [`serialize(obj)`](#serialize-obj-)
* [`deserialize(buffer, [isArray=false])`](#deserialize-buffer-isarray-false-)
* [`serializeToFile(file, obj, [cb])`](#serializetofile-file-obj-cb-)
* [`deserializeFromFile(file, [isArray=false], [cb])`](#deserializefromfile-file-isarray-false-cb-)

### `serialize(obj)`
* **obj** (`Object|Array`) The object/array to serialize.
* **_returns_** {Buffer} Result in BSON.

Serializes an object/array to BSON.

```js
bsonize.serialize([ 1, 234, 56, 78, 9 ]);
//=> <Buffer 28 00 00 00 10 ..>
```
### `deserialize(buffer, [isArray=false])`
* **buffer** (`Buffer`) The buffer contains BSON data.
* **[isArray=false]** (`Boolean`) Whether result is an array or not.
* **_returns_** {Object|Array} The object/array after deserialize.

Deserializes an object/array from BSON.

```js
var buffer = new Buffer('IQAAABAwAJQmAAAQMQAFAAAAEDIAKwAAABAzABUAAAAA', 'base64');

bsonize.deserialize(buffer);
//=> { 0: 9876, 1: 5, 2: 43, 3: 21 }

bsonize.deserialize(buffer, true);
//=> [ 9876, 5, 43, 21 ]
```
### `serializeToFile(file, obj, [cb])`
* **file** (`String`) File path.
* **obj** (`Object|Array`) The array/object to serialize.
* **[cb]** (`Function`) Callback function. The buffer contains BSON data after serialize will be passed to.
* **_returns_** {Promise} A promise will be returned if callback function is not set.

Serializes an object/array to BSON and write to file.

```js
bsonize.serializeToFile('data.bson', [ 1, 234, 56, 78, 9 ], function (err, buffer) {
  console.log(buffer);
  //=> <Buffer 28 00 00 00 10 ..>
});
```
### `deserializeFromFile(file, [isArray=false], [cb])`
* **file** (`String`) File path.
* **[isArray=false]** (`Boolean`) Whether result is an array or not.
* **[cb]** (`Function`) Callback function. The deserialized object/array will be passed to.
* **_returns_** {Promise} A promise will be returned if callback function is not set.

Deserializes an object/array from BSON file.

```js
bsonize.deserializeFromFile('data.bson', function (err, obj) {
  console.log(obj);
  //=> { 0: 9876, 1: 5, 2: 43, 3: 21 }
});

bsonize.deserializeFromFile('data.bson', true, function (err, arr) {
  console.log(arr);
  //=> [ 9876, 5, 43, 21 ]
});
```

## License

MIT licensed.
