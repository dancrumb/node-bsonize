'use strict';

var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

var bsonize = require('..');

describe('bsonize', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe('.serialize', function () {
    it('should serialize any object correctly', function () {
      var buffer = bsonize.serialize([ 1, 234, 56, 78, 9 ]);
      expect(buffer.toString('base64')).to.equal('KAAAABAwAAEAAAAQMQDqAAAAEDIAOAAAABAzAE4AAAAQNAAJAAAAAA==');
    });
  });

  describe('.deserialize', function () {
    it('should deserialize any object correctly', function () {
      var buffer = new Buffer('IQAAABAwAJQmAAAQMQAFAAAAEDIAKwAAABAzABUAAAAA', 'base64');
      var obj = bsonize.deserialize(buffer);

      expect(obj).to.deep.equal({ 0: 9876, 1: 5, 2: 43, 3: 21 });
    });

    it('should deserialize any array correctly', function () {
      var buffer = new Buffer('IQAAABAwAJQmAAAQMQAFAAAAEDIAKwAAABAzABUAAAAA', 'base64');
      var obj = bsonize.deserialize(buffer, true);

      expect(obj).to.deep.equal([ 9876, 5, 43, 21 ]);
    });
  });

  describe('.serializeToFile', function () {
    it('should serialize object to file correctly', function (done) {
      var writeFile = this.sandbox.stub(fs, 'writeFile', function (file, content, enc, cb) {
        if (typeof enc === 'function') { cb = enc; }
        cb();
      });

      bsonize.serializeToFile('noname.bson', [ 1, 234, 56, 78, 9 ], function (err) {
        expect(err).to.not.exist;

        var buffer = new Buffer('KAAAABAwAAEAAAAQMQDqAAAAEDIAOAAAABAzAE4AAAAQNAAJAAAAAA==', 'base64');
        expect(writeFile).to.have.been.calledOnce;
        expect(writeFile).to.have.been.calledWith('noname.bson', buffer);

        done();
      });
    });
  });

  describe('.deserializeFromFile', function () {
    it('should deserialize object from file correctly', function (done) {
      var readFile = this.sandbox.stub(fs, 'readFile', function (file, enc, cb) {
        var content = new Buffer('IQAAABAwAJQmAAAQMQAFAAAAEDIAKwAAABAzABUAAAAA', 'base64');

        if (typeof enc !== 'function') {
          content = content.toString(enc);
        } else {
          cb = enc;
        }

        cb(null, content);
      });

      bsonize.deserializeFromFile('noname.bson', function (err, obj) {
        expect(err).to.not.exist;

        expect(readFile).to.have.been.calledOnce;
        expect(readFile).to.have.been.calledWith('noname.bson');

        expect(obj).to.deep.equal({ 0: 9876, 1: 5, 2: 43, 3: 21 });

        done();
      });
    });

    it('should deserialize array from file correctly', function (done) {
      var readFile = this.sandbox.stub(fs, 'readFile', function (file, enc, cb) {
        var content = new Buffer('IQAAABAwAJQmAAAQMQAFAAAAEDIAKwAAABAzABUAAAAA', 'base64');

        if (typeof enc !== 'function') {
          content = content.toString(enc);
        } else {
          cb = enc;
        }

        cb(null, content);
      });

      bsonize.deserializeFromFile('noname.bson', true, function (err, obj) {
        expect(err).to.not.exist;

        expect(readFile).to.have.been.calledOnce;
        expect(readFile).to.have.been.calledWith('noname.bson');

        expect(obj).to.deep.equal([ 9876, 5, 43, 21 ]);

        done();
      });
    });
  });
});
