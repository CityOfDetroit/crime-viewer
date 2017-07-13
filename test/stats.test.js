var assert = require('assert');
var should = require('should');

import Stats from '../src/stats';

describe("Stats", function() {
  let sample_geojson_features = [
    { council_district: 1, crime_id: 123456789, offense_category: "WEAPONS OFFENSES" },
    { council_district: 7, crime_id: 223456789, offense_category: "FRAUD" },
    { council_district: 3, crime_id: 323456789, offense_category: "DAMAGE TO PROPERTY" },
    { council_district: 1, crime_id: 423456789, offense_category: "AGGRAVATED ASSAULT" },
    { council_district: 5, crime_id: 523456789, offense_category: "DISORDERLY CONDUCT - GENERAL" },
    { council_district: 5, crime_id: 623456789, offense_category: "WEAPONS OFFENSES" },
    { council_district: 4, crime_id: 723456789, offense_category: "FRAUD" },
    { council_district: 2, crime_id: 823456789, offense_category: "DAMAGE TO PROPERTY" },
  ];

  describe("sampleData", function() {
    it("should be of type array", function() {
      sample_geojson_features.should.be.an.instanceOf(Array);
    });
    it("should have nested objects", function() {
      sample_geojson_features[0].should.be.an.instanceOf(Object);
    });
  });
  
  describe("countFeatures", function() {
    it("should return the length of an array of data", function() {
      assert.equal(8, Stats.countFeatures(sample_geojson_features));
    });
  });

  describe("countByKey", function() {
    it("should return the count of each unique value of a specific key", function() {
      assert.deepEqual({ 1: 2, 2: 1, 3: 1, 4: 1, 5: 2, 7: 1 }, Stats.countByKey(sample_geojson_features, "council_district"));
    });
  });
});
