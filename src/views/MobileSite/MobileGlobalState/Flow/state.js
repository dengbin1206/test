import { getStore } from "@/util/store";
export default {
    proInstId: getStore({ name: 'proInstId' }) || "",
    taskId: getStore({ name: 'taskId' }) || "",
    flowRoute: getStore({ name: 'flowRoute' }) || "",
    copyReplyId: getStore({ name: 'copyReplyId' }) || "",
    diaType: getStore({ name: 'diaType' }) || "",
    copyReplyId: []
}