import { getStore } from "@/util/store";
export default {
    userInfo: {},
    todoCountNum: null,
    copyCountNum: null,
    actionsLogout: [
        {
            name: "退出登录",
            color: "red",
        }
    ],
    popoupVisible: false,
    navBarTitle: getStore({ name: 'navBarTitle' }) || "",
    modelFiled: [],
    actionList: [1]
}