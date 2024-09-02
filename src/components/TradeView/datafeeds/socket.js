import { createHash } from "crypto";

class socket {
    // constructor(url = 'ws://192.168.101.53/', options) { 
    constructor(url = 'wss://api.ststoken.com/wss', options) {
        this.heartBeatTimer = null
        this.options = options
        this.messageMap = {}
        this.connState = 0
        this.socket = null
        this.url = url
    }
    // 解压方法
    unzip(b64Data) {
        var strData = atob(b64Data);
        // Convert binary string to character-number array
        var charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
        // Turn number array into byte-array
        var binData = new Uint8Array(charData);
        // // unzip
        var data = pako.inflate(binData);
        // Convert gunzipped byteArray back to ascii string:
        // strData   = String.fromCharCode.apply(null, new Uint16Array(data));
        var array = new Uint16Array(data)
        var res = '';
        var chunk = 8 * 1024;
        var i;
        for (i = 0; i < array.length / chunk; i++) {
            res += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
        }
        res += String.fromCharCode.apply(null, array.slice(i * chunk));

        strData = res
        return strData;
    }
    doOpen() {
        if (this.connState) return
        this.connState = 1
        this.afterOpenEmit = []
        const BrowserWebSocket = window.WebSocket || window.MozWebSocket
        const socket = new BrowserWebSocket(this.url)
        // socket.binaryType = 'arraybuffer'
        socket.onopen = evt => this.onOpen(evt)
        socket.onclose = evt => this.onClose(evt)
        socket.onmessage = evt => this.onMessage(evt.data)
        socket.onerror = err => this.onError(err)
        this.socket = socket
    }
    // 主动断掉scoket
    toClose() {
        console.log('断开')
        this.destroy()

    }
    onOpen(evt) {
        this.connState = 2
        this.heartBeatTimer = setInterval(this.checkHeartbeat.bind(this), 10000)
        this.onReceiver({ Event: 'open' })
    }
    checkOpen() {
        return this.connState === 2
    }
    onClose(evt) {
        this.connState = 0
        if (this.connState) {
            this.onReceiver({ Event: 'close' })
        }
    }
    send(data) {
        if (data == 'PING') {
            this.socket.send(data)
        } else {
            this.socket.send(data)
        }
    }
    emit(data) {
        return new Promise(resolve => {
            this.socket.send(JSON.stringify(data))
            this.on('message', data => {
                resolve(data)
            })
        })
    }
    // 盘口数据处理 合约
    handerDataPank(data) {
        // console.log(data);
        // let name = data1.split('*')[0];
        // console.log(name)

        // let data = '"{' + data1.split('*')[1];

        // console.log(data)


        let dataAll = {
            openup: [],
            opendown: [],
            chengjiao: []
        }
        try {
            let up = data.split('matchList')[0].split('},')[0].split(':{')[1];
            up = up.split(',');
            let openup = up.map(ele => {
                return {
                    price: ele.split(':')[0] - 0,
                    num: ele.split(':')[1] - 0,
                }
            })
            if (openup.length > 0) {
                // for (let i = 0; i < 8; i++) {
                //     openup = openup.concat(openup)
                // }
                openup = openup.slice(0, 200);
                dataAll['openup'] = openup;


            }
        } catch (err) {
            console.error(' >> Data parsing error:', err)
        }



        let down = data.split('opendown')[1].trim().split(':{')[1];
        down = down.replace("}}", "");
        down = down.split(',');
        let opendown = down.map(ele => {
            return {
                price: ele.split(':')[0] - 0,
                num: ele.split(':')[1] - 0,
            }
        })
        if (opendown.length > 0) {
            // for (let i = 0; i < 8; i++) {
            //     opendown = opendown.concat(opendown)
            // }
            opendown = opendown.slice(0, 200);
            dataAll['opendown'] = opendown
        }

        // console.log(data)
        // 成交列表
        let pank = data.split('opendown')[0].split('matchList')[1];
        pank = pank.split(':[')[1].split('],')[0].trim().substr(1);
        let x2 = '["' + pank.substr(0, pank.length - 1) + '"]';
        let x3 = x2.replace(new RegExp('"{', 'g'), "'{").replace(new RegExp('}"', 'g'), "}'").replace("['", "").replace("']", "").replace(/\\/g, '').trim();
        let x4 = x3.split("','")
        let pankArr = [];
        x4.forEach(ele => {
            pankArr.push(JSON.parse(ele))

        })
        // console.log(pankArr)
        if (pankArr.length > 0) {
            pankArr = pankArr.slice(0, 10);
            dataAll['chengjiao'] = pankArr
        }

        // console.log(dataAll)
        return dataAll
    }
    // 盘口数据处理 币币
    handerBibiData(data) {
        // console.log(data)
        let dataAll = {
            openup: [],
            opendown: [],
            chengjiao: []
        }
        // 已成交列表
        try {
            // count: 10
            // pairsName: "ETH/USDT"
            // price: 268.13791298
            // time: 1581841074026
            // tradeType: "OPEN_DOWN"
            let entrustList = data.split("buy")[0].split('entrustList')[1].replace(/\\/g, '');

            entrustList = entrustList.substring(0, entrustList.length - 2);
            entrustList = entrustList.substring(2, entrustList.length).trim();
            entrustList = entrustList.replace(new RegExp('"{', 'g'), "{").replace(new RegExp('}"', 'g'), "}")

            entrustList = JSON.parse(entrustList)
            let chengjiao = [];
            entrustList.forEach(ele => {
                chengjiao.push({
                    count: ele.count,
                    pairsName: ele.pairsName,
                    price: ele.price,
                    time: ele.time,
                    tradeType: ele.entrustType == 'BUY' ? "OPEN_DOWN" : "OPEN_UP"
                })
            })
            // console.log(chengjiao)
            dataAll['chengjiao'] = chengjiao

            // count: 1
            // entrustType: "BUY"
            // pairsName: "ETH/USDT"
            // price: 281
            // time: 1581844174772



        } catch (err) {
            console.error(' >> entrustList error:', err)

        }



        // buy列表
        try {
            let buy = data.split("buy")[1].split('sell')[0];
            // console.log(buy)

            buy = buy.substring(0, buy.length - 3);
            buy = buy.substring(3, buy.length);
            buy = buy.split(',');
            // console.log(buy)
            let opendown = buy.map(ele => {
                return {
                    price: ele.split(':')[0] - 0,
                    num: ele.split(':')[1] - 0,
                }
            })
            if (opendown.length > 0) {
                // for (let i = 0; i < 8; i++) {
                //     opendown = opendown.concat(opendown)
                // }
                opendown = opendown.slice(0, 200);
                dataAll['openup'] = opendown
            }

        } catch (err) {
            console.error(' >> buy error:', err)

        }

        // sell列表
        try {
            let sell = data.split("sell")[1];
            sell = sell.substring(0, sell.length - 2);
            sell = sell.substring(3, sell.length);
            sell = sell.split(',');
            let openup = sell.map(ele => {
                return {
                    price: ele.split(':')[0] - 0,
                    num: ele.split(':')[1] - 0,
                }
            })
            if (openup.length > 0) {

                openup = openup.slice(0, 200);
                openup = openup.sort((a, b) => {
                    return a.price - b.price
                })
                dataAll['opendown'] = openup


            }
        } catch (err) {
            console.error(' >> buy error:', err)

        }





        // console.log(dataAll)
        return dataAll
    }



    //    k线数据处理
    handerData(data) {


        let obj = {};
        if (data.timeType.indexOf('m') != -1) {
            obj.param = 'MIN' + data.timeType.slice(0, -1); //0123456
        } else if (data.timeType.indexOf('h') != -1) {
            obj.param = 'H' + data.timeType.slice(0, -1); //0123456
        } else if (data.timeType.indexOf('d') != -1) {
            obj.param = 'D' + data.timeType.slice(0, -1); //0123456
        } else if (data.timeType.indexOf('w') != -1) {
            obj.param = 'W' + data.timeType.slice(0, -1); //0123456
        } else { }

        if (data.method == 'oneKline') {
            let item = JSON.parse(data.data[0]);
            obj.method = 'getKline';
            obj.volume = item.volume;
            obj.high = item.high;
            obj.low = item.low;
            obj.open = item.open;
            obj.close = item.close;
            obj.time = item.time;
            obj.pairs = data.pairs;
            return obj

        } else {
            obj.method = 'initKline'
            obj.data = data.data.map(ele => JSON.parse(ele));
            obj.pairs = data.pairs;
            return obj

        }






    }
    onMessage(message) {
        // console.error('解压前时间戳：' +  new Date().getTime());

        let blob = message
        if (typeof blob == 'string') { return } // 如果是字符串，什么操作也不做
        else {
            try {

                let newblob = blob.slice(0, blob.size)
                //js中的blob没有没有直接读出其数据的方法，通过FileReader来读取相关数据
                let reader = new FileReader();
                reader.readAsBinaryString(newblob);
                reader.onload = (evt) => {
                    if (evt.target.readyState == FileReader.DONE) {
                        let zipdata = evt.target.result; //base64
                        try {
                            let data = this.unzip(zipdata);

                            // console.log(data)
                            try {
                                // 正常的数据结构 k 线
                                data = this.handerData(JSON.parse(data))
                                // console.log(data)
                            } catch {
                                // 和约 盘口数据  matchList
                                // console.log(data)
                                if (data.indexOf("entrustList") != -1) { //币币的列表 盘口

                                    data = this.handerBibiData(data)
                                    // console.log(data)



                                } else {
                                    data = this.handerDataPank(data);
                                    //    console.error('解压后时间戳：' +  new Date().getTime());


                                    // console.log(data)
                                    // count: 11
                                    // pairsName: "ETH/USDT"
                                    // price: 262.47695087
                                    // time: 1581864939026
                                    // tradeType: "OPEN_DOWN"
                                }

                            }


                            this.onReceiver({ Event: 'message', Data: data })
                            // console.log(data)

                        } catch (err) {
                            console.error(' >> Data parsing error:', err)
                        }
                    }
                }
            } catch (error) {
                console.error('解压出错')
                console.log(error)
            }
        }
    }
    checkHeartbeat() {
        const data = "PING"
        this.send(data)
    }
    onError(err) {

    }
    onReceiver(data) {
        const callback = this.messageMap[data.Event]
        if (callback) callback(data.Data)
    }
    on(name, handler) {
        this.messageMap[name] = handler
    }
    doClose() {
        this.socket.close()
    }
    destroy() {
        if (this.heartBeatTimer) {
            clearInterval(this.heartBeatTimer)
            this.heartBeatTimer = null
        }
        this.doClose()
        this.messageMap = {}
        this.connState = 0
        this.socket = null
    }

}

export default socket