import { getStore } from "@/util/store";

export default {
    path:getStore({ name: 'qualityPath' }) || "",
    unpath:getStore({ name: 'unQualityPath' }) || "",
    query:getStore({ name: 'query' }) || {}
}