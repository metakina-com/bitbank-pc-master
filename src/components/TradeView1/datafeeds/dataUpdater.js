/**
 * 数据更新器
 * 通过更新器触发datafeeds的getBars实时更新图表数据
 */
class dataUpdater {
  constructor(datafeeds) {

    this.subscribers = {}
    this.requestsPending = 0
    this.historyProvider = datafeeds
  }
  subscribeBars(symbolInfo, resolution, newDataCallback, listenerGuid) {

    this.subscribers[listenerGuid] = {
      lastBarTime: null,
      listener: newDataCallback,
      resolution: resolution,
      symbolInfo: symbolInfo
    }
  }
  unsubscribeBars(listenerGuid) {
    delete this.subscribers[listenerGuid]
  }
  updateData() {
    if (this.requestsPending) return
    this.requestsPending = 0
    for (let listenerGuid in this.subscribers) {
      this.requestsPending++
      this.updateDataForSubscriber(listenerGuid).then(() => this.requestsPending--).catch(() => this.requestsPending--)
    }
  }
  updateDataForSubscriber(listenerGuid) {
    return new Promise((resolve, reject) => {
      const subscriptionRecord = this.subscribers[listenerGuid]
      const rangeEndTime = parseInt((Date.now() / 1000).toString())
      const rangeStartTime = rangeEndTime - this.periodLengthSeconds(subscriptionRecord.resolution, 1)
      this.historyProvider.getBars(subscriptionRecord.symbolInfo, subscriptionRecord.resolution, rangeStartTime, rangeEndTime,
        bars => {
          console.log('更新的数据')
          console.log(bars)
          this.onSubscriberDataReceived(listenerGuid, bars)
          resolve()
        },
        () => {
          reject()
        }
      )
    })
  }
  onSubscriberDataReceived(listenerGuid, bars) {
    if (!this.subscribers.hasOwnProperty(listenerGuid)) return
    if (!bars.length) return
    const lastBar = bars[bars.length - 1]
    const subscriptionRecord = this.subscribers[listenerGuid]
    if (subscriptionRecord.lastBarTime !== null && lastBar.time < subscriptionRecord.lastBarTime) return
    const isNewBar = subscriptionRecord.lastBarTime == null && lastBar.time > subscriptionRecord.lastBarTime
    if (isNewBar) {
      const previousBar = bars[bars.length - 1]
      // console.log('更新的数据')
      // console.log(previousBar.time)
      subscriptionRecord.listener(previousBar)
    } else {

      subscriptionRecord.lastBarTime = lastBar.time
      subscriptionRecord.listener(lastBar)
    }

  }
  periodLengthSeconds(resolution, requiredPeriodsCount) {
    let daysCount = 0
    if (resolution === 'D' || resolution === '1D') {
      daysCount = requiredPeriodsCount
    } else if (resolution === 'W' || resolution === '1W') {
      daysCount = 7 * requiredPeriodsCount
    } else {

      daysCount = requiredPeriodsCount * parseInt(resolution) / (24 * 60)

    }

    return daysCount * 24 * 60 * 60
  }
}

export default dataUpdater