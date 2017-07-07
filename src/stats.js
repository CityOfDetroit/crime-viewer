import _ from 'lodash';

const Stats = {
  /*
   * Counts number of times a unique value occurs for a specified key
   * @param {array} - array of objects
   * @param {string} - name of key in object
   * @returns {obj} - where keys are unique values for specified key above and values are integers
   */
  countByKey: function(arr, key) {
    return _.countBy(arr, key);
  }
}

export default Stats;
