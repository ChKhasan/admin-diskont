<template lang="html">
  <div>
    <el-form
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <TitleBlock
        title="Общие данные"
        :breadbrumb="['Контент сайта']"
        lastLink="Общие данные"
      >
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
          </span>
          <a-button
            v-if="checkAccess('Общие данные', 'POST')"
            class="add-btn add-header-btn btn-primary d-flex align-items-center"
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="uploadLoading"
          >
            <span class="svg-icon" v-html="addIcon" v-if="!uploadLoading"></span>
            Добавить
          </a-button>
        </div>
      </TitleBlock>
      <div class="container_xl">
        <div class="card_block-form py-5">
          <div
            class="d-flex justify-content-between align-items-center card_header card_tabs_padding"
          ></div>
          <el-tabs class="form_tabs" v-model="activeName">
            <el-tab-pane
              v-for="(item, index) in lang"
              :label="item.label"
              :name="item.label"
              :key="index"
            >
              <div class="form-container form-container-ltr">
                <FormTitle title="Общие данные" />

                <div class="form-block required">
                  <el-form-item prop="phone_number" label="Номер телефона">
                    <el-input
                      type="text"
                      v-mask="'+998 ## ### ## ##'"
                      placeholder="+998 (__) ___ __ __"
                      v-model="ruleForm.phone_number"
                    />
                  </el-form-item>
                </div>
                <div class="form-block">
                  <el-form-item prop="email" label="Электронная почта">
                    <el-input
                      v-model="ruleForm.email"
                      placeholder="Электронная почта..."
                      type="email"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-block">
                  <el-form-item label="Telegram">
                    <el-input
                      v-model="ruleForm.telegram"
                      placeholder="Telegram..."
                      type="text"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-block">
                  <el-form-item label="SEO-ключевые слова">
                    <el-input
                      v-model="ruleForm.meta_keywords[item.key]"
                      placeholder="Keywords..."
                      type="textarea"
                      rows="5"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-block">
                  <el-form-item label="SEO описание">
                    <el-input
                      v-model="ruleForm.meta_desc[item.key]"
                      placeholder="описание..."
                      type="textarea"
                      rows="5"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-block">
                  <div><label for="">Логотип</label></div>
                  <div class="clearfix variant-img">
                    <a-upload
                      action="https://api.e-shop.ndc.uz/api/admin/files/upload"
                      :headers="headers"
                      list-type="picture-card"
                      :file-list="fileList"
                      :multiple="true"
                      @preview="handlePreview"
                      @change="($event) => handleChange($event)"
                    >
                      <div v-if="fileList.length < 1">
                        <span v-html="addImgIcon"></span>
                        <div class="ant-upload-text">Добавить изображение</div>
                      </div>
                    </a-upload>
                    <a-modal
                      :visible="previewVisible"
                      :footer="null"
                      @cancel="handleCancel"
                    >
                      <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import LayoutHeaderBtn from "../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../components/Title-block.vue";
import authAccess from "@/mixins/authAccess";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  layout: "toolbar",
  mixins: [authAccess],
  data() {
    return {
      activeName: "Русский",
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      lang: [
          {
          key: "uz",
          label: "Uzbek",
        },
        {
          key: "ru",
          label: "Русский",
        },
      ],
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      previewVisible: false,
      previewImage: "",
      fileList: [],
      uploadLoading: false,
      rules: {
        phone_number: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],

        email: [
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
        ],
      },
      ruleForm: {
        phone_number: "",
        email: "",
        logo: "",
        telegram: "",
        meta_desc: {
          ru: "",
          uz: "",
        },
        meta_keywords: {
          ru: "",
          uz: "",
        },
      },
    };
  },
  mounted() {
    this.__GET_SITE_INFO();
  },
  methods: {
    submitForm(ruleForm) {
      const data = {
        ...this.ruleForm,
        phone_number: this.ruleForm.phone_number.split(" ").join(""),
      };
      this.$refs[ruleForm].validate((valid) => {
        valid ? this.__PUT_SITE_INFO(data) : false;
      });
    },

    async __PUT_SITE_INFO(data) {
      try {
        await this.$store.dispatch("fetchSiteInfo/editSiteInfo", data);
        await this.$notify({
          title: "Success",
          message: "Упешно изменен",
          type: "success",
        });
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_SITE_INFO(data) {
      try {
        const data = await this.$store.dispatch("fetchSiteInfo/getSiteInfo");
        const { created_at, id, updated_at, ...rest } = data.info;
        this.ruleForm = { ...rest };
        this.fileList = [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            oldImg: true,
            url: rest?.md_logo,
          },
        ];
        console.log(data);
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    statusFunc(res) {
      switch (res.status) {
        case 422:
          this.$notify.error({
            title: "Error",
            message: "Указанные данные недействительны.",
          });
          break;
        case 500:
          this.$notify.error({
            title: "Error",
            message: "Cервер не работает",
          });
          break;
        case 404:
          this.$notify.error({
            title: "Error",
            message: res.data.errors,
          });
          break;
      }
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      if (fileList[0]?.response?.path) {
        this.ruleForm.logo = fileList[0]?.response?.path;
      }
      this.fileList = fileList;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    toBack() {
      this.$router.push("/contents/feedbacks");
    },
  },

  components: {
    TitleBlock,
    LayoutHeaderBtn,
  },
};
</script>
