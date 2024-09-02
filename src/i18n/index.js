import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from "./modules/en.js";
import zh from "./modules/zh.js";
import zh_tw from "./modules/zh_tw.js";
import jp from "./modules/jp.js";
Vue.use(VueI18n);



const locale = localStorage.getItem('language') || "en";

export default new VueI18n({
	locale: locale, // 默认选择的语言
	messages: {
		en,
		zh,
		zh_tw,
		jp
	}
});
