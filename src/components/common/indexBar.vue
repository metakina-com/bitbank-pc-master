<template>
    <div class="bar">
        <div class="bar_flex" style="width: 1100px;">
            
            <div class="c_footer_t">
                <div class="c_footer_t_l"  style="width: 1100px;">
                    <dl>
                        <dt> {{$t('message.about')}} </dt>
                        <dd><router-link to="/single/company_profile">{{$t('message.companyProfile')}}</router-link></dd>                
                        <dd> <router-link to="/single/single_contact">{{$t('message.contact')}}</router-link></dd>
                        <!-- <dd><a href="javascript:void(0)" target="_blank">{{$t('message.support')}}</a></dd> -->
                        <dd><router-link to="/notice/gfgg">{{$t('message.Announcement')}}</router-link></dd>
                    </dl>
                    <dl>
                        <dt> {{$t('message.PaaS')}}</dt>
                        <dd><router-link to="/single/single_fees">{{$t('message.fee_schedule')}}</router-link></dd>
                        <dd> <router-link to="/notice/hyzx">{{$t('message.new_hyzx')}}</router-link> </dd>
                        <!-- <dd> <router-link to="/notice/gsxw">{{$t('message.new_gsxw')}}</router-link> </dd> -->
                        <dd> <router-link to="/single/single_introduced">{{$t('message.introduction_digital_assets')}}</router-link> </dd>                
                    </dl>
                    <dl>
                        <dt> {{$t('message.userSupport')}} </dt>
                        <!-- <dd> <router-link to="/single/single_proposer">{{$t('message.onCurrencyApplication')}}</router-link> </dd> -->
                        <dd> <router-link to="/single/api_document">{{$t('message.documentAPI')}}</router-link> </dd>
                        <dd> <router-link to="/single/new_guidance">{{$t('message.newbieGuide')}}</router-link> </dd>
                    </dl>
    
                    <dl>
                        <dt> {{$t('message.stipulation')}} </dt>
                        <dd> <router-link to="/single/single_user">{{$t('message.user')}}</router-link> </dd>
                        <dd> <router-link to="/single/single_privacy">{{$t('message.privacy')}}</router-link> </dd>
                        <dd> <router-link to="/single/disclaimer">{{$t('message.disclaimer')}}</router-link> </dd>
                        <dd> <router-link to="/single/security_policy">{{$t('message.securityPolicy')}}</router-link> </dd>
                    </dl>
                    <dl class="fedui_footer_link pointer">
                        <dd><a href="javascript:;" class="flex" style="width: 110px;display: flex; font-weight: 600;align-items: center;justify-content: flex-start;"><img style="padding:2px;" class="mar-r-10" src="../../assets/images/bar_1.png"/><span>faceBook</span></a></dd>
                        <dd><a href="https://twitter.com/ChinaQuantum" style="width: 110px;display: flex;font-weight: 600;justify-content: flex-start" target="_blank"><img style="padding:2px;" class="mar-r-10" src="../../assets/images/bar_2.png"/>twitter</a></dd>
                        <!-- <dd><a href="javascript:;" style="width: 110px;display: flex;font-weight: 600;justify-content: flex-start"><img style="padding:2px;"  class="mar-r-10" src="../../assets/images/bar_3.png"/>微信</a></dd> -->
                        <!-- <dd> <a href="https://weibo.com/6156690549/profile?topnav=1&wvr=6&is_all=1" style="display: flex;width: 110px;justify-content: flex-start" target="_blank"><img style="padding:2px;" class="mar-r-10" src="../../assets/images/bar_4.png"/>微博</a></dd> -->
                        <dd><a href="javascript:;"  style="display: flex;width: 110px;font-weight: 600;justify-content: flex-start"><img style="padding:2px;" class="mar-r-10" src="../../assets/images/bar_5.png"/>Reddit</a></dd>
                        <dd><a href="javascript:;" style="display: flex;width: 110px;font-weight: 600;justify-content: flex-start"><img class="mar-r-10" src="../../assets/images/bar_6.png"/>Telegram</a></dd>
                        <dd><a href="javascript:;" style="display: flex;width: 110px;font-weight: 600;justify-content: flex-start"><img class="mar-r-10" src="../../assets/images/bar_7.png"/>Discord</a></dd>
                    </dl>
                </div>
            </div>
            <div style="display: inline-block; margin-right: 13%;">
                <!-- <div style="width:90px;">
                    <img style="width:140px;" src="../../assets/images/fx_logo.png"/>
                    <span style="color:#fff;font-weight:bold;vertical-align: top;">BitBANK</span>
                </div> -->
                <!-- <div class="footer_copyright">© 2020 QT. All Rights Reserved</div> -->
                <!-- FVEX -->
                
            </div>
        </div>
        <div class="flex" style="width: 1100px;margin: 15px auto;justify-content: center;flex-direction: column;align-items: center;">
            <p>{{i18n.botInfo}}</p>
            <img style="width:160px;" class="mar-t-30" src="../../assets/images/fx_logo.png"/>

        </div>
        <!-- <div>
            <img style="height:45px;position: relative;left: 100%;margin-left: -65px;bottom: 50px;" src="https://download.ethecf.vip/a7068153a9aec96c3f3f16ff9950ec3.png"/>
        </div> -->
        <!-- <div class="c_footer_link" >
            <ul class="conta_buttom_box">
                <li v-for="val of friendList" :key="val.id"><a :href="val.linkUrl" target="_blank"><img :src="val.imageUrl" /></a></li>
            </ul>
        </div> -->
    </div>
</template>
<script>
export default {
    name: 'indexBar',
    // data () {
    //     return {
    //         friendList:[] 
    //     }
    // },
    // mounted() {
    //     this.initData();
    // },
    // methods: {
    //     initData(){
    //         this.$http.get(this.utils.config+'/api/cms/friend/list').then((data)=>{
    //             if(data.data.success){
    //                 this.friendList = data.data;
    //             }
    //         })
    //     }
    // },
    computed: {
        i18n() {
        return this.$t("message");
        },
    }
}
</script>

<style lang="less" src="./indexBar.less" scoped></style>