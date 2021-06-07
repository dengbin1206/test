<template>
  <van-uploader
    upload-icon="upgrade"
    v-model="fileList"
    multiple
    :max-count="maxCount"
    :after-read="afterRead"
    :disabled="readonly"
    :deletable="!readonly"
    :show-upload="!readonly"
    :accept="acceptType"
    @delete="deleteFile"
    @click-preview="clickPreview"
  >
  </van-uploader>
</template>

<script>
import { asyncUploadAction, uploadList } from "@/api/tool/dynamic";
import { showImage } from "@/api/mobileApi/flow";
import request from "@/router/axios";
import website from "@/config/website";
import { getToken } from "@/util/auth";

export default {
  name: "uploader",
  props: {
    maxCount: {
      type: Number,
    },
    accept: {
      type: String,
    },
    dataSrcId: {
      type: String,
    },
    affixType: {
      type: String,
    },
    getAllFile: {
      type: Array | Object,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    item: Object
  },
  data() {
    return {
      fileList: [],
      acceptType: "all",
      allFileList: this.getAllFile,
      suffix: null,
    };
  },

  created() {
    this.acceptType = this.accept;
    this.init();
  },

  // watch:{
  //   allFileList:{
  //     handler(next,pre){
  //         this.$emit('update:')
  //     }
  //   }
  // },

  methods: {
    afterRead(file, detail) {
      let files = [];
      this.fileList.map(async (file) => {
        if (file.fileId) {
          files.push(file);
        } else {
          let fileItem = file.file;
          let content = file.content;
          let uploadFile = new FormData();
          uploadFile.append("file", fileItem);
          uploadFile.append("dataSrcId", this.dataSrcId || "");
          uploadFile.append("affixType", this.affixType || "");
          const { data } = await asyncUploadAction(uploadFile);
          files.push({
            fileId: data.data.id,
            fileName: data.data.originalFileName,
            suffix: data.data.suffix,
            dataSrcId: this.dataSrcId,
            affixType: this.affixType,
            isDeleted: 0,
            content: content,
            file: fileItem,
          });

          this.allFileList.push({
            fileId: data.data.id,
            fileName: data.data.originalFileName,
            suffix: data.data.suffix,
            dataSrcId: this.dataSrcId,
            affixType: this.affixType,
            isDeleted: 0,
          });
          this.$emit("uploadData", {
            allFileList: this.allFileList,
            item: this.item
          });
        }
      });
      this.fileList = files;

      console.log(this.fileList,'flieList');
    },

    deleteFile(file, detail) {
      this.allFileList.forEach((e) => {
        if (e.fileId === file.fileId) {
          e.isDeleted = 1;
          return;
        }
      });
    },

    init() {
      let files = [];
      this.getAllFile.forEach((file) => {
        if (
          file.suffix.match(
            /(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|avif)/i
          )
        ) {
          showImage(file.fileId).then((res) => {
            files.push({
              ...file,
              content: `data:image/${file.suffix}+xml;base64,${res.data.data}`,
            });
          });
        } else {
          files.push({
            ...file,
            file: {
              name: file.fileName,
            },
          });
        }
      });
      this.fileList = files;
    },

    clickPreview(file) {
      if (
        !file.suffix.match(
          /(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|avif)/i
        )
      ) {
        window.open(
          `/api/blade-resource/affix/singleDownloadByFileId?${
            this.website.tokenHeader
          }=${getToken()}&fileId=${file.fileId}`
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}

/deep/.van-uploader__file-icon {
  display: none;
}

/deep/.van-uploader__file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 215px;
  height: unset;
}

/deep/.van-uploader__file-name {
  text-align: left;
}
</style>
