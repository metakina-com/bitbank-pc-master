import wsBus from './wsBus'
const supportedResolutions = ['1', '5', '15', '30', '60', 'D', 'W'];
export default class {
    constructor(symbol) {
        // this.symbol = symbol
        this.lastBar = null;
    }
    //
    async onReady(callback) {
        let config = await Promise.resolve({
            supports_search: false,
            supports_group_request: false,
            supported_resolutions: supportedResolutions,
            supports_marks: false,
        });
        callback(config);
    }
    unsubscribeBars(subscriberUID) {
        //console.log('unsubscribeBars =====>\n', ...arguments)
    }
    async resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        let res = await Promise.resolve({
            name: symbolName,
            ticker: symbolName,
            type: 'bitcoin',
            "timezone": 'Asia/Hong_Kong',
            "minmov": 1, // 最小波动
            "pricescale": 1000000, // 价格刻度
            // "minmov2": 0.0001,
            // "pointvalue": 0.00000001,
            "session": "24x7",
            "has_intraday": true,
            // "has_no_volume":false,
            // "description":"Apple Inc.",
            "supported_resolutions": supportedResolutions,
            'has_empty_bars': true,
            "has_weekly_and_monthly": true,
        });
        onSymbolResolvedCallback(res);
    }
    async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        let res = await wsBus.reqKlinHistory(symbolInfo.name, resolution, from, to)
        // if (!res.getKlines) return onHistoryCallback([], {noData: true})
        let bars = [];
        let meta = {
            noData: false,
        }
        if (res.data.length < 1) {
            meta.noData = true;
            meta.nextTime = res.nextTime; // 如果没有数据，应该有nextTime
        } else {
            // bars = res.data.map(e => {
            //     let obj = JSON.parse(e)
            //         ()
            // });
            res.data.forEach(e => {
                let obj = JSON.parse(e)
                bars.push({
                    time: obj.time-0,
                    open: obj.open-0,
                    close: obj.close-0,
                    high: obj.high-0,
                    low: obj.low-0,
                    volume: obj.vol-0
                })
            });
            // console.log(bars)
          
            

        }
        onHistoryCallback(bars, meta)
    }
    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        wsBus.$on('subscribeBar', klines => {
            let { time, open, close, low, high, volume } = JSON.parse(klines.data[0])
            onRealtimeCallback({
                time,
                open,
                close,
                low,
                high,
                volume
            });
        });
    }
    // 自定义获取数据时间 
    /* 
    resolution : 请求商品的分辨率
    resolutionBack : 期望历史周期刻度。支持的值: D(天)|M(月)
    intervalBack :数 量 
    */
    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
        // console.log(resolution)
        switch (resolution) {
            case '1':  return { resolutionBack: 'D', intervalBack: 1};
            case '5':  return { resolutionBack: 'D', intervalBack: 1};
            case '15': return { resolutionBack: 'D', intervalBack: 1 };
            case '30': return { resolutionBack: 'D', intervalBack: 3 };
            case '60': return { resolutionBack: 'D', intervalBack: 5 };  // 240 条
            default:
                break;
        }
    }
}