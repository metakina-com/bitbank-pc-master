<template>
<div>
    <i ref="btn"></i>
</div>
</template>

<script>
export default {
    //   接受父组件传递的值，用来控制图形验证的加载
    props: ["isGeet"],
    methods: {
        GtCaptcha() {
            //   此url是极验官网的测试请求地址，加随机数防止缓存
            this.$axios.get(`https://www.geetest.com/demo/gt/register-slide?t=${new Date().getTime()}`).then(res => {
                // 极验第一次，请求回来的参数
                let data = res.data;
                let handler = (captchaObj) => {
                    //   图形验证成功
                    captchaObj.onSuccess(() => {
                        let result = captchaObj.getValidate();
                        let param = {
                            geetest_challenge: result.geetest_challenge,
                            geetest_validate: result.geetest_validate,
                            geetest_seccode: result.geetest_seccode,
                            status: data.success
                        };
                        // 极验校验的参数，将其传给服务端，进行校验。
                        this.$emit("geetPath", param);
                    }).onError(() => {
                        //   图形验证失败
                    });
                    //   为此页面的虚拟按钮添加点击事件
                    this.$refs.btn.addEventListener("click", () => {
                        // 极验图片触发之后，修改控制变量额布尔值，实现再次触发
                        this.$emit("clickChange", false);
                        this.isGeet && captchaObj.verify();
                    });
                };
                //   初始化极验
                this.$initGeet({
                    gt: data.gt,
                    challenge: data.challenge,
                    product: "bind",
                    offline: !data.success,
                    https: true
                }, handler);
            });
        }
    },
    created() {
        // 页面创建，调用函数
        this.GtCaptcha();
    },
    watch: {
        // 监听参数的变化，调用极验
        isGeet() {
            //   这里通过按钮事件调用极验
            this.$refs.btn.click();
        }
    }
};
</script>
