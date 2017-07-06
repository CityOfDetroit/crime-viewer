var moment = require('moment')

const Helpers = {
  xDaysAgo: function(int) {
    return moment().subtract(int, 'days').toISOString().slice(0,10)
  },
  example: function(string) {
    return string;
  }
}

export default Helpers;
