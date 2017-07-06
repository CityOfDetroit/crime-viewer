var moment = require('moment')

const Helpers = {
  xDaysAgo: function(int) {
    return moment().subtract(int, 'days').toISOString().slice(0,10)
  }
}

export default Helpers;
