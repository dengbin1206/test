<template>
  <div class="login-container"  v-show="proxy">
    <top-color v-show="false"></top-color>
    <div class="login-weaper animated bounceInDown">
      <div class="login-left" style="background:url('/img/bg/banner.jpg') no-repeat;background-size:100% 100%">
      </div>
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title" >
            大通宝富数字化{{website.title}}
          </h4>
          <userLogin v-if="activeName==='user'"></userLogin>
          <codeLogin v-else-if="activeName==='code'"></codeLogin>
          <thirdLogin v-else-if="activeName==='third'"></thirdLogin>
          <div class="login-menu">
             <a href="http://www.dart-rich.com">www.dart-rich.com</a>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import userLogin from "./userlogin";
  import codeLogin from "./codelogin";
  import thirdLogin from "./thirdlogin";
  import {mapGetters} from "vuex";
  import {dateFormat} from "@/util/date";
  import {validatenull} from "@/util/validate";
  import topLang from "@/page/index/top/top-lang";
  import topColor from "@/page/index/top/top-color";
  import {getQueryString, getTopUrl} from "@/util/util";
  import {proxyLogin,gotoPage} from "@/util/proxyLogin";
  import {Message} from "element-ui";
  import logo from "@/assets/image/logo.png";
  import {resetRouter} from "@/router/router";
  import backgroundImg from "@/assets/image/banner.jpg";
  export default {
    name: "login",
    components: {
      userLogin,
      codeLogin,
      thirdLogin,
      topLang,
      topColor
    },
    data() {
      return {
        imgurl: logo,
        bannerImg:backgroundImg,
        time: "",
        proxy:false,
        activeName: "user",
        socialForm: {
          tenantId: "000000",
          source: "",
          code: "",
          state: "",
        }
      };
    },
    watch: {
      $route() {
        this.handleLogin();
      }
    },
    created() {
      this.handleLogin();
      this.getTime();
    },
    mounted() {
      // this.getBackgroud()
    },
    computed: {
      ...mapGetters(["website", "tagWel"])
    },
    props: [],
    methods: {
      getBackgroud(){
         return "backgroud:url(backgroundImg)"
      },
      getTime() {
        setInterval(() => {
          this.time = dateFormat(new Date());
        }, 1000);
      },
      handleLogin() {
        let systemType  = getQueryString("systemType");
        //debugger;
        //是否为系统集成
        if(systemType){
          let commit = this.$store.commit;
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后... ...',
            spinner: "el-icon-loading"
          });
          let gotoUrl = gotoPage();
          proxyLogin(commit,systemType,gotoUrl,function(result){
            Message({
              message: result.message,
              type: 'error'
            });
          }).then(res=>{
            loading.close();
          }).catch(() => {
            loading.close();
          });
          return;
        }else{
          this.proxy = true;
          const topUrl = getTopUrl();
          const redirectUrl = "/oauth/redirect/";
          this.socialForm.source = getQueryString("source");
          this.socialForm.code = getQueryString("code");
          this.socialForm.state = getQueryString("state");
          if (validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
            let source = topUrl.split("?")[0];
            source = source.split(redirectUrl)[1];
            this.socialForm.source = source;
          }
          if (!validatenull(this.socialForm.source) && !validatenull(this.socialForm.code) && !validatenull(this.socialForm.state)) {
            const loading = this.$loading({
              lock: true,
              text: '第三方系统登录中,请稍后。。。',
              spinner: "el-icon-loading"
            });
            this.$store.dispatch("LoginBySocial", this.socialForm).then(() => {
              window.location.href = topUrl.split(redirectUrl)[0];
              this.$router.push({path: this.tagWel.value});
              loading.close();
            }).catch(() => {
              loading.close();
            });
          }
        }
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/login.scss";

</style>
