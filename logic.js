const values = require('./values')
module.exports.calculateProfit = (order) => {
    const startTime = order.creationTime
    const nowTime = parseInt(Date.now()/1000)
    const difference = nowTime - startTime
    if (order.price) {
        if (difference < values.SECONDS_IN_ONE_DAY) { // one day 30%
            return order.price / 100 * 30
        }
        if (difference < 2 * values.SECONDS_IN_ONE_DAY) { // one day 30%
            return order.price / 100 * 25
        }
        if (difference < 3 * values.SECONDS_IN_ONE_DAY) { // one day 30%

            return order.price / 100 * 20
        }
    }
    return  0
}