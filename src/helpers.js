var moment = require('moment');
var _ = require('lodash');

const Helpers = {
  xDaysAgo: function(int, date) {
    return moment(date).subtract(int, 'days').toISOString().slice(0,10)
  },

  /** 
   * Formats a string by capitalizing the first letters of each word
   * @param {str}
   * @returns {str}
   */
  toSentenceCase: function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

export default Helpers;
