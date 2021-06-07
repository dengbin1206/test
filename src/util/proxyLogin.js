import {logout, loginByDingTalk} from '@/api/user'
import {getQueryString} from "@/util/util";
import {Message} from "element-ui";
import {removeToken, removeRefreshToken} from '@/util/auth'
import { resetRouter } from "@/router/router";
import { setStore, getStore, removeStore } from "@/util/store";

/************************
 * 代理系统集成登录
 ************************/

/**
 * 跳转的跳转
 * @returns {string}
 */
export function gotoPage() {
  // inputType=PC//PC端进入   MB//移动端
  let inputType = getQueryString("inputType");
  let route = getQueryString("systemType");
  let flowRoute = getQueryString("flowRoute");
  let proInstId = getQueryString("proInstId");
  let taskId = getQueryString("taskId");
  if(route){
    if(flowRoute == "myTodoList"){
      //return "/#/work/todoc";
      // 持久存储 proInstId taskId 防止刷新页面 vuex 被清空
      setStore({
        name: "proInstId",
        content: proInstId,
      });

      setStore({
        name: "taskId",
        content: taskId,
      });

      setStore({
        name: "flowRoute",
        content: "myTodoList",
      });
      return "/#/mobile/flowDetail";
    } else{
      return "/";
    }
  }
  return "/";
};


export function proxyLogin(commit,grantType,gotoUrl,callbackFun) {
    //clearCache(commit,grantType).then(()=>{
      // 钉钉集成
      if(grantType == "dd_token"){
        dingTalkLogin(commit,grantType,gotoUrl).then(callbackFun);
      }
    //});
};


export function clearCache(commit){
  return new Promise((resolve, reject) => {
      /*commit('SET_TOKEN', '');
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_USER_INFO', {});
      commit('SET_MENU', []);
      commit('SET_MENU_ID', {});
      commit('SET_MENU_ALL', []);
      commit('SET_ROLES', []);
      commit('SET_TAG_LIST', []);
      commit('DEL_ALL_TAG');
      commit('CLEAR_LOCK');
      removeToken();
      removeRefreshToken();*/
      //resetRouter();
      resolve();
  });
}
export function dingTalkLogin(commit,grantType,gotoUrl) {
  let tenantId = getQueryString("tenantId");
  let code = getQueryString("code");
  if(!tenantId||!code){
    Message({
      message: "缺少必要的参数！",
      type: 'error'
    });
    return;
  }
  return new Promise((resolve, reject) => {
    loginByDingTalk(tenantId,code,grantType).then(res => {
      const data = res.data;
      if (data.error_description) {
        Message({
          message: data.error_description,
          type: 'error'
        })
      } else {
        commit('SET_TOKEN', data.access_token);
        commit('SET_REFRESH_TOKEN', data.refresh_token);
        commit('SET_USER_INFO', data);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        window.location.href = gotoUrl;
      }
      resolve();
    }).catch(
      // 记录失败原因
      (reason) => {
        resolve(reason);
      });
  });
}

