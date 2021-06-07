import dayjs from "dayjs";

export const filters = {

    isNull(value) {
        return value.name
    },

    concatTitle(value) {
        if (typeof value.userName !== 'undefined' && value.userName !== "") {
            return `${value.userName}发起的 ${value.flowName}`
        }
    },

    formatDate(value) {
        if (value) {
            return dayjs(value).format("MM.DD HH:mm");
        }
    },

    selectIcon(value, key) {
        return value[key];
    },

    iconSelect(status) {
        let iconName = [
            "el-icon-more",
            "el-icon-check",
            "el-icon-refresh",
            "el-icon-refresh-right",
            "el-icon-close",
            "el-icon-folder-delete",
        ];
        let tagStyle = [
            "#E6A23C",
            "#67C23A",
            "#409EFF",
            "#909399",
            "#F56C6C",
            "#F56C6C",
        ];
        switch (status) {
            case 1:
                return {
                    icon: iconName[1],
                    color: tagStyle[1],
                    text: "同意",
                };
                break;
            case 2:
                return {
                    icon: iconName[2],
                    color: tagStyle[2],
                    text: "转办",
                };
                break;
            case 3:
                return {
                    icon: iconName[3],
                    color: tagStyle[3],
                    text: "回退",
                };
                break;
            case 4:
                return {
                    icon: iconName[4],
                    color: tagStyle[4],
                    text: "拒绝",
                };
                break;
            case 5:
                return {
                    icon: iconName[5],
                    color: tagStyle[5],
                    text: "作废",
                };
                break;
            default:
                return {
                    icon: iconName[0],
                    color: tagStyle[0],
                    text: "待处理",
                };
                break;
        }
    }


}