<template>
  <div class="auth_bg min-hei600">
    <div class="auth_section pad-t-40">
      <div class="bg-fff hei60 flex align-center size20 pad-l-30">
        <el-page-header @back="goBack" content="收款方式" title=""></el-page-header>
      </div>
      
      <div class="auth_content bg-fff mar-t-20 pad-b-50 pad-l-r-30 pad-t-20 min-hei400">
        <div v-if="isInit">
          <div class="items size14">
            <div
              class="bor_b size15 font1 c222 flex align-center pad-t-b-10 flex_bet"
              v-if="userInfo.bankCard"
            >
              <img src="../../assets/images/bankCard.png" alt srcset class="wid25 hei25 mar-r-5" />
              {{userInfo.bankUserName}}
              <div v-if="type=='open'">
                <el-switch v-model="checked"></el-switch>
              </div>
            </div>
            <div
              class="size15 font1 c222 flex align-center pad-t-b-10 pointer"
              v-else
              @click="goBankCard('card')"
            >
              <img src="../../assets/images/bankCard.png" alt srcset class="wid25 hei25 mar-r-5" />
              银行卡
              <div class="mar-l-15 flex1 flex flex_right align-center pointer"></div>
              <i class="el-icon-arrow-right mar-l-15"></i>
            </div>
            <div class="size15" v-if="userInfo.bankCard">
              <div class="mar-t-15 flex align-center pointer" @click="goBankCard('card')">
                {{userInfo.bankCard}}
                <div class="mar-l-15 flex1 flex flex_right align-center"></div>
                <i class="el-icon-arrow-right mar-l-15"></i>
              </div>
            </div>
          </div>
          <div class="darkLine mar-t-b-15"></div>
          <div class="items size14">
            <div
              class="bor_b size15 font1 c222 flex align-center pad-t-b-10 flex_bet"
              v-if="userInfo.payWechat"
            >
              <img src="../../assets/images/weixin.png" alt srcset class="wid25 hei25 mar-r-5" />
              微信名
              <div v-if="type=='open'">
                <el-switch v-model="checked1"></el-switch>
              </div>
            </div>
            <div
              class="size15 font1 c222 flex align-center pad-t-b-10 pointer"
              v-else
              @click="goBankCard('weixin')"
            >
              <img src="../../assets/images/weixin.png" alt srcset class="wid25 hei25 mar-r-5" />
              微信
              <div class="mar-l-15 flex1 flex flex_right align-center pointer"></div>
              <i class="el-icon-arrow-right mar-l-15"></i>
            </div>
            <div class="size15" v-if="userInfo.payWechat">
              <div class="mar-t-15 flex align-center pointer" @click="goBankCard('weixin')">
                {{userInfo.wechatName}}
                <div class="mar-l-15 flex1 flex flex_right align-center"></div>
                <i class="el-icon-arrow-right mar-l-15"></i>
              </div>
            </div>
          </div>
          <div class="darkLine mar-t-b-15"></div>
          <div class="items size14">
            <div
              class="bor_b size15 font1 c222 flex align-center pad-t-b-10"
              v-if="userInfo.aliayName"
            >
              <img src="../../assets/images/zhifubao.png" alt srcset class="wid25 hei25 mar-r-5" />
              支付宝
              <div v-if="type=='open'" class="flex1 flex flex_right">
                <el-switch v-model="checked2"></el-switch>
              </div>
            </div>
            <div
              class="size15 font1 c222 flex align-center pad-t-b-10 pointer"
              v-else
              @click="goBankCard('zhifubao')"
            >
              <img src="../../assets/images/zhifubao.png" alt srcset class="wid25 hei25 mar-r-5" />
              支付宝
              <div class="mar-l-15 flex1 flex flex_right align-center"></div>
              <i class="el-icon-arrow-right mar-l-15"></i>
            </div>
            <div class="size15" v-if="userInfo.aliayName">
              <div class="mar-t-15 flex align-center pointer" @click="goBankCard('zhifubao')">
                {{userInfo.aliayName}}
                <div class="mar-l-15 flex1 flex flex_right align-center"></div>
                <i class="el-icon-arrow-right mar-l-15"></i>
              </div>
            </div>
          </div>
          <div class="darkLine mar-t-b-15"></div>
        </div>
      </div>
    </div>
    <!-- 银行卡 -->
    <el-dialog
      title="银行卡绑定"
      :visible.sync="isBankcard"
      width="480px"
      :before-close="handleClose"
      @close="close"
      :close-on-click-modal="false"
    >
      <div>
        <div class="mar-t-10">
          <p class="size12 c333 pad-b-6">姓名</p>
          <el-input v-model="userInfo1.uname" readonly></el-input>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-6">银行卡</p>
          <el-input v-model="userInfo1.bankCard" type="number"></el-input>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-6">开户行</p>
          <el-select
            v-model="userInfo1.bankName"
            placeholder
            class="widall"
            @change="currencyChange"
          >
            <el-option
              v-for="item in bankList"
              :key="item.value"
              :label="item.text"
              :value="item.text"
            ></el-option>
          </el-select>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-6">支行</p>
          <el-input v-model="userInfo1.bankAddress"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
      </span>
      <paymentCode type="bank" ref="mychild" @submitEvent="submitEvent" />
    </el-dialog>
    <!-- 微信 -->
    <el-dialog
      title="微信绑定"
      :visible.sync="isWeChat"
      width="480px"
      :before-close="handleClose"
      @close="close"
      :close-on-click-modal="false"
    >
      <div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-6">账户名</p>
          <el-input v-model="userInfo1.wechatName"></el-input>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-12">请上传微信收款二维码（JPG/JPEG/PNG 格式上传）</p>
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="(file,list)=>{handleChange(file,list,'weixin')}"
            action
          >
            <img
              v-if="userInfo1.payWechat"
              :src="userInfo1.payWechat"
              class="hei140 wid140 pointer"
            />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit1" :loading="loading">提交</el-button>
      </span>
      <paymentCode type="weixin" ref="mychild" @submitEvent="submitEvent" />
    </el-dialog>
    <!-- 支付宝 -->
    <el-dialog
      title="支付宝绑定"
      :visible.sync="isAlipay"
      width="480px"
      :before-close="handleClose"
      @close="close"
      :close-on-click-modal="false"
    >
      <div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-6">账户名</p>
          <el-input v-model="userInfo1.aliayName"></el-input>
        </div>
        <div class="mar-t-20">
          <p class="size12 c333 pad-b-12">请上传支付宝收款二维码（JPG/JPEG/PNG 格式上传）</p>
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="(file,list)=>{handleChange(file,list,'zfb')}"
            action
          >
            <img v-if="userInfo1.payAliay" :src="userInfo1.payAliay" class="hei140 wid140 pointer" />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit2" :loading="loading">提交</el-button>
      </span>
      <paymentCode type="zhifubao" ref="mychild" @submitEvent="submitEvent" />
    </el-dialog>
  </div>
</template>

<script>
import paymentCode from "../../components/common/paymentCode";
import { mapActions } from "vuex";
export default {
  name: "payment",
  components: { paymentCode },
  data() {
    return {
      name: "",
      idCard: "",
      loading: false,
      isRenzhang: false,
      idNUm: "",
      IdName: "",
      userInfo: {},
      userInfo1: {},
      isInit: false,
      isBankcard: false, //银行卡
      isWeChat: false, //微信
      isAlipay: false, //支付宝
      bankList: [],
      type: "",
      checked: false, //银行卡switch
      checked1: false, //微信switch
      checked2: false, //支付宝switch
    };
  },
  watch: {
    "userInfo1.uname"(val) {
      if (!val) return;
      this.userInfo1.uname = val.replace(/\s+/g, "");
    },
    "userInfo1.bankCard"(val) {
      if (!val) return;
      this.userInfo1.bankCard = val.replace(/\s+/g, "");
    },
    "userInfo1.bankAddress"(val) {
      if (!val) return;
      this.userInfo1.bankAddress = val.replace(/\s+/g, "");
    },
    "userInfo.wechatName"(val) {
      if (!val) return;
      this.userInfo1.wechatName = val.replace(/\s+/g, "");
    },
  },
  activated() {
    this.getUserInfo();
    this.type = this.$route.query.type || "";
    this.bankList = [
      {
        value: "CDB",
        text: "国家开发银行",
      },
      {
        value: "ICBC",
        text: "中国工商银行",
      },
      {
        value: "ABC",
        text: "中国农业银行",
      },
      {
        value: "BOC",
        text: "中国银行",
      },
      {
        value: "CCB",
        text: "中国建设银行",
      },
      {
        value: "PSBC",
        text: "中国邮政储蓄银行",
      },
      {
        value: "COMM",
        text: "交通银行",
      },
      {
        value: "CMB",
        text: "招商银行",
      },
      {
        value: "SPDB",
        text: "上海浦东发展银行",
      },
      {
        value: "CIB",
        text: "兴业银行",
      },
      {
        value: "HXBANK",
        text: "华夏银行",
      },
      {
        value: "GDB",
        text: "广东发展银行",
      },
      {
        value: "CMBC",
        text: "中国民生银行",
      },
      {
        value: "CITIC",
        text: "中信银行",
      },
      {
        value: "CEB",
        text: "中国光大银行",
      },
      {
        value: "EGBANK",
        text: "恒丰银行",
      },
      {
        value: "CZBANK",
        text: "浙商银行",
      },
      {
        value: "BOHAIB",
        text: "渤海银行",
      },
      {
        value: "SPABANK",
        text: "平安银行",
      },
      {
        value: "SHRCB",
        text: "上海农村商业银行",
      },
      {
        value: "YXCCB",
        text: "玉溪市商业银行",
      },
      {
        value: "YDRCB",
        text: "尧都农商行",
      },
      {
        value: "BJBANK",
        text: "北京银行",
      },
      {
        value: "SHBANK",
        text: "上海银行",
      },
      {
        value: "JSBANK",
        text: "江苏银行",
      },
      {
        value: "HZCB",
        text: "杭州银行",
      },
      {
        value: "NJCB",
        text: "南京银行",
      },
      {
        value: "NBBANK",
        text: "宁波银行",
      },
      {
        value: "HSBANK",
        text: "徽商银行",
      },
      {
        value: "CSCB",
        text: "长沙银行",
      },
      {
        value: "CDCB",
        text: "成都银行",
      },
      {
        value: "CQBANK",
        text: "重庆银行",
      },
      {
        value: "DLB",
        text: "大连银行",
      },
      {
        value: "NCB",
        text: "南昌银行",
      },
      {
        value: "FJHXBC",
        text: "福建海峡银行",
      },
      {
        value: "HKB",
        text: "汉口银行",
      },
      {
        value: "WZCB",
        text: "温州银行",
      },
      {
        value: "QDCCB",
        text: "青岛银行",
      },
      {
        value: "TZCB",
        text: "台州银行",
      },
      {
        value: "JXBANK",
        text: "嘉兴银行",
      },
      {
        value: "CSRCB",
        text: "常熟农村商业银行",
      },
      {
        value: "NHB",
        text: "南海农村信用联社",
      },
      {
        value: "CZRCB",
        text: "常州农村信用联社",
      },
      {
        value: "H3CB",
        text: "内蒙古银行",
      },
      {
        value: "SXCB",
        text: "绍兴银行",
      },
      {
        value: "SDEB",
        text: "顺德农商银行",
      },
      {
        value: "WJRCB",
        text: "吴江农商银行",
      },
      {
        value: "ZBCB",
        text: "齐商银行",
      },
      {
        value: "GYCB",
        text: "贵阳市商业银行",
      },
      {
        value: "ZYCBANK",
        text: "遵义市商业银行",
      },
      {
        value: "HZCCB",
        text: "湖州市商业银行",
      },
      {
        value: "DAQINGB",
        text: "龙江银行",
      },
      {
        value: "JINCHB",
        text: "晋城银行JCBANK",
      },
      {
        value: "ZJTLCB",
        text: "浙江泰隆商业银行",
      },
      {
        value: "GDRCC",
        text: "广东省农村信用社联合社",
      },
      {
        value: "DRCBCL",
        text: "东莞农村商业银行",
      },
      {
        value: "MTBANK",
        text: "浙江民泰商业银行",
      },
      {
        value: "GCB",
        text: "广州银行",
      },
      {
        value: "LYCB",
        text: "辽阳市商业银行",
      },
      {
        value: "JSRCU",
        text: "江苏省农村信用联合社",
      },
      {
        value: "LANGFB",
        text: "廊坊银行",
      },
      {
        value: "CZCB",
        text: "浙江稠州商业银行",
      },
      {
        value: "DYCB",
        text: "德阳商业银行",
      },
      {
        value: "JZBANK",
        text: "晋中市商业银行",
      },
      {
        value: "BOSZ",
        text: "苏州银行",
      },
      {
        value: "GLBANK",
        text: "桂林银行",
      },
      {
        value: "URMQCCB",
        text: "乌鲁木齐市商业银行",
      },
      {
        value: "CDRCB",
        text: "成都农商银行",
      },
      {
        value: "ZRCBANK",
        text: "张家港农村商业银行",
      },
      {
        value: "BOD",
        text: "东莞银行",
      },
      {
        value: "LSBANK",
        text: "莱商银行",
      },
      {
        value: "BJRCB",
        text: "北京农村商业银行",
      },
      {
        value: "TRCB",
        text: "天津农商银行",
      },
      {
        value: "SRBANK",
        text: "上饶银行",
      },
      {
        value: "FDB",
        text: "富滇银行",
      },
      {
        value: "CRCBANK",
        text: "重庆农村商业银行",
      },
      {
        value: "ASCB",
        text: "鞍山银行",
      },
      {
        value: "NXBANK",
        text: "宁夏银行",
      },
      {
        value: "BHB",
        text: "河北银行",
      },
      {
        value: "HRXJB",
        text: "华融湘江银行",
      },
      {
        value: "ZGCCB",
        text: "自贡市商业银行",
      },
      {
        value: "YNRCC",
        text: "云南省农村信用社",
      },
      {
        value: "JLBANK",
        text: "吉林银行",
      },
      {
        value: "DYCCB",
        text: "东营市商业银行",
      },
      {
        value: "KLB",
        text: "昆仑银行",
      },
      {
        value: "ORBANK",
        text: "鄂尔多斯银行",
      },
      {
        value: "XTB",
        text: "邢台银行",
      },
      {
        value: "JSB",
        text: "晋商银行",
      },
      {
        value: "TCCB",
        text: "天津银行",
      },
      {
        value: "BOYK",
        text: "营口银行",
      },
      {
        value: "JLRCU",
        text: "吉林农信",
      },
      {
        value: "SDRCU",
        text: "山东农信",
      },
      {
        value: "XABANK",
        text: "西安银行",
      },
      {
        value: "HBRCU",
        text: "河北省农村信用社",
      },
      {
        value: "NXRCU",
        text: "宁夏黄河农村商业银行",
      },
      {
        value: "GZRCU",
        text: "贵州省农村信用社",
      },
      {
        value: "FXCB",
        text: "阜新银行",
      },
      {
        value: "HBHSBANK",
        text: "湖北银行黄石分行",
      },
      {
        value: "ZJNX",
        text: "浙江省农村信用社联合社",
      },
      {
        value: "XXBANK",
        text: "新乡银行",
      },
      {
        value: "HBYCBANK",
        text: "湖北银行宜昌分行",
      },
      {
        value: "LSCCB",
        text: "乐山市商业银行",
      },
      {
        value: "TCRCB",
        text: "江苏太仓农村商业银行",
      },
      {
        value: "BZMD",
        text: "驻马店银行",
      },
      {
        value: "GZB",
        text: "赣州银行",
      },
      {
        value: "WRCB",
        text: "无锡农村商业银行",
      },
      {
        value: "BGB",
        text: "广西北部湾银行",
      },
      {
        value: "GRCB",
        text: "广州农商银行",
      },
      {
        value: "JRCB",
        text: "江苏江阴农村商业银行",
      },
      {
        value: "BOP",
        text: "平顶山银行",
      },
      {
        value: "TACCB",
        text: "泰安市商业银行",
      },
      {
        value: "CGNB",
        text: "南充市商业银行",
      },
      {
        value: "CCQTGB",
        text: "重庆三峡银行",
      },
      {
        value: "XLBANK",
        text: "中山小榄村镇银行",
      },
      {
        value: "HDBANK",
        text: "邯郸银行",
      },
      {
        value: "KORLABANK",
        text: "库尔勒市商业银行",
      },
      {
        value: "BOJZ",
        text: "锦州银行",
      },
      {
        value: "QLBANK",
        text: "齐鲁银行",
      },
      {
        value: "BOQH",
        text: "青海银行",
      },
      {
        value: "YQCCB",
        text: "阳泉银行",
      },
      {
        value: "SJBANK",
        text: "盛京银行",
      },
      {
        value: "FSCB",
        text: "抚顺银行",
      },
      {
        value: "ZZBANK",
        text: "郑州银行",
      },
      {
        value: "SRCB",
        text: "深圳农村商业银行",
      },
      {
        value: "BANKWF",
        text: "潍坊银行",
      },
      {
        value: "JJBANK",
        text: "九江银行",
      },
      {
        value: "JXRCU",
        text: "江西省农村信用",
      },
      {
        value: "HNRCU",
        text: "河南省农村信用",
      },
      {
        value: "GSRCU",
        text: "甘肃省农村信用",
      },
      {
        value: "SCRCU",
        text: "四川省农村信用",
      },
      {
        value: "GXRCU",
        text: "广西省农村信用",
      },
      {
        value: "SXRCCU",
        text: "陕西信合",
      },
      {
        value: "WHRCB",
        text: "武汉农村商业银行",
      },
      {
        value: "YBCCB",
        text: "宜宾市商业银行",
      },
      {
        value: "KSRB",
        text: "昆山农村商业银行",
      },
      {
        value: "SZSBK",
        text: "石嘴山银行",
      },
      {
        value: "HSBK",
        text: "衡水银行",
      },
      {
        value: "XYBANK",
        text: "信阳银行",
      },
      {
        value: "NBYZ",
        text: "鄞州银行",
      },
      {
        value: "ZJKCCB",
        text: "张家口市商业银行",
      },
      {
        value: "XCYH",
        text: "许昌银行",
      },
      {
        value: "JNBANK",
        text: "济宁银行",
      },
      {
        value: "CBKF",
        text: "开封市商业银行",
      },
      {
        value: "WHCCB",
        text: "威海市商业银行",
      },
      {
        value: "HBC",
        text: "湖北银行",
      },
      {
        value: "BOCD",
        text: "承德银行",
      },
      {
        value: "BODD",
        text: "丹东银行",
      },
      {
        value: "JHBANK",
        text: "金华银行",
      },
      {
        value: "BOCY",
        text: "朝阳银行",
      },
      {
        value: "LSBC",
        text: "临商银行",
      },
      {
        value: "BSB",
        text: "包商银行",
      },
      {
        value: "LZYH",
        text: "兰州银行",
      },
      {
        value: "BOZK",
        text: "周口银行",
      },
      {
        value: "DZBANK",
        text: "德州银行",
      },
      {
        value: "SCCB",
        text: "三门峡银行",
      },
      {
        value: "AYCB",
        text: "安阳银行",
      },
      {
        value: "ARCU",
        text: "安徽省农村信用社",
      },
      {
        value: "HURCB",
        text: "湖北省农村信用社",
      },
      {
        value: "HNRCC",
        text: "湖南省农村信用社",
      },
      {
        value: "NYNB",
        text: "广东南粤银行",
      },
      {
        value: "LYBANK",
        text: "洛阳银行",
      },
      {
        value: "NHQS",
        text: "农信银清算中心",
      },
      {
        value: "CBBQS",
        text: "城市商业银行资金清算中心",
      },
    ];
  },
  deactivated() {
    this.userInfo1 = {
      payWechat: "",
      payAliay: "",
    };
    if (this.$refs.mychild) {
      this.$refs.mychild.close();
    }

    this.close();
    var chooseArr = [];
    if (this.checked) {
      chooseArr.push("BANKCARD");
    }
    if (this.checked1) {
      chooseArr.push("WECHAT");
    }
    if (this.checked2) {
      chooseArr.push("ALIAY");
    }
    this.setPayType(chooseArr);
    this.checked = false; //银行卡switch
    this.checked1 = false; //微信switch
    this.checked2 = false;
  },
  methods: {
    ...mapActions(["setPayType"]),
    goBack() {
      this.$router.go(-1);
    },
    //设置银行卡
    goBankCard(type) {
      if (!this.isRenzhang) {
        this.$util.Toast("请先进行初级实名认证", "warning");
        return;
      }
      if (type == "card") {
        this.isBankcard = true;
      } else if (type == "weixin") {
        this.isWeChat = true;
      } else {
        this.isAlipay = true;
      }
    },
    //上传收款码
    handleChange(file, fileList, type) {
      this.$util.getBase64(file.raw).then((res) => {
        this.$util.dealImage(res, 500, (data) => {
          if (type == "weixin") {
            this.userInfo1.payWechat = data;
          } else if (type == "zfb") {
            this.userInfo1.payAliay = data;
          }
        });
      });
    },
    getUserInfo() {
      var _this = this;
      this.$get("member/member/getMember", {
        member: this.$store.state.userId,
      }).then((res) => {
        if (res.status == "FAILED") {
        } else if (res.status == "SUCCEED") {
          this.isInit = true;
          let data = res.result;
          this.userInfo = data;
          this.userInfo1 = JSON.parse(JSON.stringify(data));
          if (data.cardNo == "") {
            this.isRenzhang = false;
            this.$alert("请先进行初级实名认证", "提示", {
              confirmButtonText: "确定",
              showClose: false,
              callback: (action) => {
                if (action == "confirm") {
                  _this.$router.replace("/personalCenter");
                }
              },
            });
          } else {
            this.isRenzhang = true;
          }
        }
      });
    },
    //银行切换
    currencyChange() {
      // this.getBalances();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.close();
          done();
        })
        .catch((_) => {});
    },
    close() {
      this.isBankcard = false;
      this.isWeChat = false;
      this.isAlipay = false;
      this.loading = false;
      // this.userInfo1 = {
      //   payWechat: "",
      //   payAliay: "",
      //   wechatName:'',
      //   payWechat:''
      // };
      this.userInfo1 = JSON.parse(JSON.stringify(this.userInfo));
    },
    //银行卡提交按钮
    submit() {
      if (!this.userInfo1.uname) {
        this.$util.Toast("请输入姓名", "warning");
        return;
      }
      if (!this.userInfo1.bankCard) {
        this.$util.Toast("请输入银行卡号", "warning");
        return;
      }
      if (!this.userInfo1.bankName) {
        this.$util.Toast("请输入开户行", "warning");
        return;
      }
      if (!this.userInfo1.bankAddress) {
        this.$util.Toast("请输入开户行支行", "warning");
        return;
      }
      this.$refs.mychild.submit();
    },
    //微信提交按钮
    submit1() {
      if (!this.userInfo1.wechatName) {
        this.$util.Toast("请输入账户名", "warning");
        return;
      }
      if (!this.userInfo1.payWechat) {
        this.$util.Toast("请上传收款二维码", "warning");
        return;
      }
      this.$refs.mychild.submit();
    },
    //支付宝提交按钮
    submit2() {
      if (!this.userInfo1.aliayName) {
        this.$util.Toast("请输入账户名", "warning");
        return;
      }
      if (!this.userInfo1.payAliay) {
        this.$util.Toast("请上传收款二维码", "warning");
        return;
      }
      this.$refs.mychild.submit();
    },
    submitEvent(val) {
      if (val.type == "card") {
        var data = {
          member: this.$store.state.userId,
          bankUserName: this.userInfo1.uname,
          bankCard: this.userInfo1.bankCard,
          bankName: this.userInfo1.bankName,
          bankAddress: this.userInfo1.bankAddress,
          code: val.code,
        };
        // this.$util.showLoading()

        this.loading = true;

        this.$post1("member/member/setBankInfo", data)
          .then((res) => {
            this.loading = false;
            if (res && res.status == "SUCCEED") {
              this.$util.Toast("银行卡绑定成功", "success");
              this.getUserInfo();
              setTimeout((res) => {
                this.close();
              }, 300);
            } else {
              this.$util.Toast(res.errorMessage);
            }
          })
          .catch((err) => {
            this.loading = false;
          });
        return;
      }
      var data = {
        code: val.code,
      };
      var url;
      if (val.type == "weixin") {
        data["name"] = this.userInfo1.wechatName;
        data["file"] = this.userInfo1.payWechat;
        url = "member/member/setPayWechat";
      } else {
        data["name"] = this.userInfo1.aliayName;
        data["file"] = this.userInfo1.payAliay;
        url = "member/member/setPayAliay";
      }
      var fd = new FormData();
      fd.append("code", data.code);
      fd.append("name", data.name);
      var reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
      if (reg.test(data.file)) {
        fd.append("file", this.$util.base64toFile(data.file));
      } else {
        fd.append("file", null);
      }
      this.loading = true;
      this.$post1(url, { member: this.$store.state.userId }, fd)
        .then((res) => {
          this.loading = false;
          if (res && res.status == "SUCCEED") {
            if (val.type == "weixin") {
              this.$util.Toast("微信绑定成功", "success");
            } else {
              this.$util.Toast("支付宝绑定成功", "success");
            }
            this.getUserInfo();
            setTimeout(() => {
              this.close();
            }, 300);
          } else {
            this.$util.Toast(res.errorMessage);
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped>
.auth_bg {
  background: #f2f3f8;
  /deep/.el-dialog__body {
    padding-top: 0;
  }
  /deep/.el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    display: block;
  }
  .bor_b {
    border-bottom: 1px solid rgba(225, 225, 225, 0.6);
  }
  .darkLine {
    height: 6px;
    background: #f8f7fd;
    margin-left: -30px;
    margin-right: -30px;
  }
  .auth_section {
    width: 1200px;
    margin: 0 auto;
  }
  .tips {
    width: 100%;
    height: 48px;
    background: #f8f9fb;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .realname {
    width: 480px;
    margin: 0 auto;
    .right_text {
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      width: 100%;
    }
  }
}
</style>
