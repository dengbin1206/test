import { getStore } from "@/util/store";
export default {
    proInstId: getStore({ name: 'proInstId' }) || "",
    taskId: getStore({ name: 'taskId' }) || "",
    selectedList: []
}