<template>
  <div class="">
    <TitleBlock title="Переводы" :breadbrumb="['Настройки сайта']" lastLink="Переводы">
      <div class="d-flex">
        <a-button
          v-if="checkAccess('translations', 'POST')"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="addGroup"
        >
          <span class="svg-icon" v-html="addIcon"></span>

          Добавить группу
        </a-button>
      </div>
    </TitleBlock>
    <div class="container_xl app-container pb-5 pt-5">
      <div class="card_block main-table px-4">
        <div class="translate-links-grid btn_group translate-service-btns pt-3">
          <a-button
            v-if="loading"
            class="add-btn text-black-btn add-header-btn btn-primary d-flex align-items-center"
          >
            Empty
          </a-button>
          <a-button
            v-else
            v-for="(group, index) in groups"
            :key="group.id"
            class="add-btn text-black-btn add-header-btn btn-primary d-flex align-items-center"
            @click="$router.push(`/settings/translations-group/${group.id}`)"
          >
            {{ group?.title }}
          </a-button>
        </div>
      </div>
    </div>
    <div class="container_xl app-container pb-5">
      <div class="card_block main-table px-4 mt-0 pb-4">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-list-header-grid2 w-100 align-items-center">
            <SearchInput
              placeholder="Поиск
            "
              @changeSearch="
                changeSearch($event, '/settings/translations', '__GET_TRANSLATIONS')
              "
            />
            <div></div>
            <a-button
              @click="clearQuery('/settings/translations', '__GET_TRANSLATIONS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <a-table
          :columns="columns"
          :pagination="false"
          :data-source="translations"
          :loading="loading"
        >
          <span slot="indexId" slot-scope="text">#{{ text?.key }}</span>
          <h6
            style="cursor: pointer"
            slot="keyIndex"
            slot-scope="text"
            @click="copyText(`${text.sub_text}.${text.key}`)"
          >
            {{ `${text.sub_text}.${text.key}` }}
          </h6>

          <h6 slot="valRu" slot-scope="text">
            {{ text?.val?.ru ? text?.val?.ru : "-----" }}
          </h6>
          <h6 slot="valEn" slot-scope="text">
            {{ text?.val?.en ? text?.val?.en : "-----" }}
          </h6>
          <h6 slot="valUz" slot-scope="text">
            {{ text?.val?.uz ? text?.val?.uz : "-----" }}
          </h6>

          <span slot="id" slot-scope="text">
            <span
              class="action-btn"
              v-html="editIcon"
              v-if="checkAccess('translations', 'PUT')"
              @click="editAction(text)"
            >
            </span>
            <a-popconfirm
              v-if="checkAccess('translations', 'DELETE')"
              title="Are you sure delete this row?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteAction(text.id)"
            >
              <span class="action-btn" v-html="deleteIcon"> </span>
            </a-popconfirm>
          </span>
        </a-table>
        <div class="d-flex justify-content-end mt-4">
          <a-pagination
            class="table-pagination"
            :simple="false"
            v-model.number="current"
            :total="totalPage"
            :page-size.sync="params.pageSize"
          />
        </div>
      </div>
    </div>
    <a-modal
      v-model="visible"
      :dialog-style="{ top: '50px' }"
      :title="title"
      :closable="false"
      width="576px"
      @ok="handleOk"
    >
      <div class="d-flex flex-column">
        <div class="d-flex flex-column">
          <el-form :model="form" ref="ruleFormFaq" :rules="rules" class="demo-ruleForm">
            <el-form-item
              class="form-block required mb-3 align-items-start"
              label="Название"
              prop="sub_text"
            >
              <el-input v-model="form.sub_text" placeholder="Название..." />
            </el-form-item>
            <el-form-item
              class="form-block mb-3 align-items-start required"
              label="Субтекст"
              prop="title"
            >
              <el-input v-model="form.title" placeholder="Субтекст..." />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOk"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            type="primary"
            @click="postGroup"
          >
            <span class="svg-icon" v-html="addIcon"></span>
            Сохранять
          </a-button>
        </div>
      </template>
    </a-modal>
    <a-modal
      v-model="visibleTranslate"
      :dialog-style="{ top: '50px' }"
      :title="title"
      :closable="false"
      width="720px"
      @ok="handleOkTranslate"
    >
      <div class="d-flex flex-column">
        <div class="d-flex flex-column form-container">
          <el-form
            :model="formTranlate"
            ref="ruleFormTrans"
            :rules="rulesTranslate"
            layout="vertical"
            class="demo-ruleForm"
          >
            <el-form-item class="form-block mb-3" label="Ключ" prop="key">
              <a-input v-model="formTranlate.key" placeholder="Ключ..." />
            </el-form-item>
            <el-form-item class="form-block mb-3" label="Значение(ru)" prop="val.ru">
              <a-input v-model="formTranlate.val.ru" placeholder="Значение(ru)..." />
            </el-form-item>
            <el-form-item class="form-block mb-3" label="Значение(en)">
              <a-input v-model="formTranlate.val.en" placeholder="Значение(en)..." />
            </el-form-item>
            <el-form-item class="form-block mb-3" label="Значение(uz)">
              <a-input v-model="formTranlate.val.uz" placeholder="Значение(uz)..." />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOkTranslate"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            type="primary"
            @click="putTranslation"
          >
            Сохранять
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import SearchInput from "../../components/form/Search-input.vue";
import TitleBlock from "../../components/Title-block.vue";
import status from "@/mixins/status";
import global from "../../mixins/global";
import authAccess from "@/mixins/authAccess";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
const columns = [
  {
    title: "№",
    key: "indexId",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "indexId" },
    className: "column-name",
    align: "left",
    width: 100,
  },
  {
    title: "КЛЮЧ",
    dataIndex: "keyGroup",
    key: "keyGroup",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "keyIndex" },
    className: "column-name",
    width: "20%",
  },
  {
    title: "ЗНАЧЕНИЕ(RU)",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "valRu" },
    className: "column-name",
    align: "left",
  },
  {
    title: "ЗНАЧЕНИЕ(EN)",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "valEn" },
    className: "column-name",
  },
  {
    title: "ЗНАЧЕНИЕ(UZ)",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "valUz" },
    className: "column-name",
  },
  {
    title: "ДЕЙСТВИЯ",
    className: "column-btns",
    align: "right",
    scopedSlots: { customRender: "id" },
    width: 100,
  },
];

export default {
  name: "IndexPage",
  mixins: [status, global, authAccess],
  layout: "toolbar",
  head: {
    title: "Переводы",
  },
  data() {
    return {
      title: "Добавить группу",
      editId: null,
      editIdTrans: null,
      visible: false,
      visibleTranslate: false,
      editIcon: require("../../assets/svg/components/edit-icon.svg?raw"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg?raw"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      loading: false,
      search: "",
      columns,
      translations: [],
      groups: [],
      rules: {
        sub_text: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
        title: {
          ru: [{ required: true, message: "This field is required", trigger: "change" }],
        },
      },
      rulesTranslate: {
        val: {
          ru: [{ required: true, message: "This field is required", trigger: "change" }],
        },
        key: [{ required: true, message: "This field is required", trigger: "change" }],
      },
      form: {
        sub_text: "",
        title: "",
      },
      formTranlate: {
        translate_group_id: null,
        key: "",
        val: {
          ru: "",
          uz: "",
          en: "",
        },
      },
    };
  },
  async mounted() {
    this.getFirstData("/settings/translations", "__GET_TRANSLATIONS");
    this.__GET_TRANSLATE_GROUPS();
    // this.checkAllActions("translates");
  },
  methods: {
    async copyText(name) {
      await navigator.clipboard.writeText(name);
      this.$message.success("Copy");
    },
    putTranslation() {
      this.$refs["ruleFormTrans"].validate((valid) => {
        if (valid) {
          this.__PUT_TRANSLATIONS(this.formTranlate);
        } else {
          return false;
        }
      });
    },
    postGroup() {
      this.$refs["ruleFormFaq"].validate((valid) => {
        if (valid) {
          this.__POST_GROUPS(this.form);
        } else {
          return false;
        }
      });
    },
    editAction(id) {
      this.visibleTranslate = true;
      this.title = "Изменить";
      this.editIdTrans = id.id;
      this.formTranlate.translate_group_id = id.translate_group_id;
      this.formTranlate.key = id.keyGroup.key;
      this.formTranlate.val = id.val;
    },
    deleteAction(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchTranslations/deleteTranslations",
        "Успешно удален",
        "__GET_TRANSLATIONS"
      );
    },
    async __GET_TRANSLATE_GROUPS() {
      const data = await this.$store.dispatch("fetchTranslations/getTranslateGruop", {});
      this.groups = data?.groups?.data;
      console.log(this.groups);
    },
    async __GET_TRANSLATIONS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchTranslations/getTranslations", {
        ...this.$route.query,
      });
      console.log(data, "asdasds");
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.translates?.current_page,
        data?.translates?.per_page
      );
      this.translations = data?.translates?.data.map((item, index) => {
        return {
          keyIndex: item.key,
          keyGroup: {
            key: item.key,
            sub_text: item.group.sub_text,
          },
          key: index + pageIndex,
          val: item.val,
          id: item.id,
          translate_group_id: item.translate_group_id,
        };
      });
      this.totalPage = data?.translates?.total;
    },

    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    addGroup() {
      this.title = "Добавить";
      this.fileList = [];
      this.editId = null;
      this.visible = true;
    },
    handleOkTranslate() {
      this.visibleTranslate = false;
    },
    handleOk() {
      this.visible = false;
    },
    async __POST_GROUPS(data) {
      try {
        await this.$store.dispatch("fetchTranslations/postTranslateGroup", data);
        this.notification("success", "success", "Успешно добавлен");
        this.handleOk();
        this.__GET_TRANSLATE_GROUPS();
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __PUT_TRANSLATIONS(data) {
      try {
        await this.$store.dispatch("fetchTranslations/editTranslations", {
          id: this.editIdTrans,
          data: data,
        });
        this.notification("success", "success", "Успешно изменена");
        this.visibleTranslate = false;
        this.__GET_TRANSLATIONS();
      } catch (e) {
        this.statusFunc(e);
      }
    },
    emptyData() {
      this.form = {
        question: {
          ru: "",
          uz: "",
        },
        answer: {
          ru: "",
          uz: "",
        },
        service_id: null,
      };
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/settings/translations", "__GET_TRANSLATIONS");
    },
    // visible(val) {
    //   if (val == false) {
    //     this.emptyData();
    //   }
    // },
  },
  components: { TitleBlock, SearchInput },
};
</script>
<style lang="css">
.prodduct-list-header-grid2 {
  display: grid;
  grid-template-columns: 1fr 46px 46px;
  grid-gap: 24px;
}
.card_header {
  padding: 16.25px 0;
}
.translate-links-grid {
  display: flex;
  flex-wrap: wrap;
}
.translate-service-btns .add-btn {
  margin-right: 16px;
  height: 40px;
  padding: 0 20px;
  font-size: 14px !important;
}
</style>
