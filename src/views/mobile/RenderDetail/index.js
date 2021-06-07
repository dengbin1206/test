import { queryForm, initData, getUserName } from "@/api/work/work";

export default class Detail {

    renderData = []
    mainModel = []
    editFlag = false
    static filedsValue = []

    init(paramId, paramType, proDefId, nodeCode, dataId, editFlag) {
        queryForm(paramId, paramType, proDefId, nodeCode, dataId).then(res => {
            let { mainModel } = res.data.data;
            this.mainModel = mainModel
            this.editFlag = editFlag
            this.getFileds(dataId, paramId,paramType)
        })
    }

    getFileds(dataId, paramId,paramType) {
        initData({
            modelId: paramId,
            dbTableName: "",
            modelType: paramType,
            dataId: dataId,
            mainModel: this.mainModel,
        }).then(res => {
            this.filedsValue = res.data.data;
            this.renderData = [];
            this.mainModel.forEach((item) => {
                this.renderData.push({
                    ...item,
                    filedsValue: this.filedsValue[item.modelAndField],
                    dictValue: typeof this.filedsValue[`$${item.modelAndField}`] !== 'undefined' ? this.filedsValue[`$${item.modelAndField}`].split(',') : [],
                    show: this.editFlag ? item.editDisplay : item.viewDisplay,
                    canEdit: this.editFlag ? item.editDisabled : true,
                });
            });
        })
    }




}

export const props = {
    paramId: {
        type: Number,
    },
    paramType: {
        type: String,
    },
    proDefId: {
        type: String,
    },
    nodeCode: {
        type: String,
    },
    dataId: {
        type: Number,
    },
    editFlag: {
        type: Boolean,
    },
    visible:{
        type: Boolean
    }
}

