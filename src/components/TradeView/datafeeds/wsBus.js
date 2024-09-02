import Vue from 'vue'
import { promiseBreaker } from "./tools";
import { mapState } from 'vuex';
const WS_URL = 'wss://api.ststoken.com/wss' // socket URL
let wsBus = window.wsBus = new Vue({
    // store,
    data: {
        timer:null,
        type:null,
        ws: null,
        WS_URL: '',
        connectReady: promiseBreaker(), // 将是可外部决议的promise
        from: 0,
        period: ''
    },
 
  
    watch: {
    
    },
    methods: {
      
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
                entrustList = JSON.parse(entrustList);
                // console.error(entrustList.length)
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
        },
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
                // pankArr = pankArr.slice(0, 10);
                dataAll['chengjiao'] = pankArr
            }

            return dataAll
        },

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
        },
        init() {
            let ws = this.ws = new WebSocket(WS_URL);
            ws.onopen = () => {
                this.connectReady.resolve()
            }
            ws.onmessage = (ev) => {
                let blob = ev.data
                if (typeof blob == 'string') { return }
                let newblob = blob.slice(0, blob.size)
                //js中的blob没有没有直接读出其数据的方法，通过FileReader来读取相关数据
                let reader = new FileReader();
                reader.readAsBinaryString(newblob);
                reader.onload = (evt) => {
                    if (evt.target.readyState == FileReader.DONE) {
                        let zipdata = this.unzip(evt.target.result); //base64
                       
                        if(zipdata=='{"openup":{},"matchList":[],"opendown":{}}'){
                            window.MV.$emit('pankData',{openup:[],opendown:[],chengjiao:[]});
                            return
                        }
                        // JSON 能解析  k 线数据
                        try {
                            let msg = JSON.parse(zipdata);
                          
                            localStorage.setItem('klineTime', msg.timeType)
                            if (msg.method && msg.method === "oneKline") {
                                this.$emit('subscribeBar', msg)
                                // 发送到quotesDetail页面
                                if(msg.timeType=='1m'){
                                    msg = JSON.parse(msg.data[0]);
                                    window.MV.$emit('fromRandomCurrentPrice', msg.close);
                                }
                            } else if (msg.method && msg.method === "initKline") {
                            // } else if (msg.method && msg.method === "historyKline") {
                              
                              
                                this.$emit('klineHistoryData', msg)
                            } else {
                                // console.log(msg)
                            }
                        } catch (error) {
                            // 不能解析、为盘口
                             // 和约 盘口数据  matchList
                            //  console.log(zipdata)
                    
                            let pankData = null;
                            if (zipdata.indexOf("entrustList") != -1) { //币币的列表 盘口
                                pankData = this.handerBibiData(zipdata)
                            } else {
                                pankData = this.handerDataPank(zipdata);
                            }
                         
                            window.MV.$emit('pankData',pankData)
                        }
 
                    }
                }
            }
            ws.onclose = () => {
                this.connectReady = promiseBreaker();
                this.init();
            }
            ws.onerror = err => {
                this.init();
            }
        },
        doClose(){
            this.ws.close()
        },
        async reqKlinHistory(symbol, resolution, from, to) { // 请求k线历史数据
            let _t = this;
            await this.connectReady
            this.from = from;
            if (resolution > 0 && resolution < 60) {
                this.period = resolution + "m"
            }
            else if (resolution == 60) {
                this.period = "1h";
            } else if (resolution == "D") {
                this.period = "1d";
            } else if (resolution == "W") {
                this.period = "1w";
            }
            let res = await new Promise((resolve, reject) => {
                this.$once('klineHistoryData', (msg) => {
                    resolve(msg)
                });

                // console.log(this.type)

                // 发送盘口指令
                if (this.type == 'bibi') {
                    // if (true) {
                    this.ws.send(`initEntrust-${symbol}`);   //bibi
                } else {
                    this.ws.send(`initMatch-${symbol}`);  //合约
                }
                this.ws.send("PING");
                clearInterval(_t.timer);
                _t.timer = setInterval(()=>{
                    this.ws.send("PING")
                },5000)


                // this.ws.send(`historyKline-${symbol}-${this.period}`);

                this.ws.send("initKline-"+ symbol +"-" + this.period + '-' + from * 1000 + '-' + to * 1000)
                // this.ws.send("getKline-"+ symbol +"-" + this.period)
            });
            return res;
        }
    },
    created() {
        this.init();
        window.MV.$on('currentType',type => {
            this.type = type
        })

      
    }
})
export default wsBus;