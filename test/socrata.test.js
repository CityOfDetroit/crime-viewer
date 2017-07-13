var assert = require('assert');
var should = require('should');

import Socrata from '../src/socrata';

describe("Socrata", function() {
  let sample_ds = "12a4-bc35";
  let sample_params = {
    "$where": ``,
    "$limit": 5
  };

  describe("sampleData", function() {
    it("should have id of type string", function() {
      sample_ds.should.be.type('string');
    });
    it("should have params of type object", function() {
      sample_params.should.be.type('object');
    });
  });

  describe("makeUrl", function() {
    it("should create a URL with id and query parameters", function() {
      assert.equal("https://data.detroitmi.gov/resource/12a4-bc35.geojson?$where=&$limit=5", Socrata.makeUrl(sample_ds, sample_params));
    });
  });

  describe("fetchData", function() {
    it("shoud resolve without error", function() {
      /** still trying to learn how to test promises */
    });
  }); 
});
