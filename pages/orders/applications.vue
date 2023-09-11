<template lang="html">
  <div>
    <TitleBlock title="Заявки" :breadbrumb="['Заказы']" lastLink="Заявки">
      <div class="d-flex">
        <!-- <div
          class="add-btn add-header-btn add-header-btn-padding btn-primary"
          @click="$router.push('/catalog/add_products')"
        >
          <span class="svg-icon" v-html="addIcon"></span>
          Добавить продукт
        </div> -->
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-list-header-grid w-100 align-items-center">
            <SearchInput placeholder="Поиск" @changeSearch="changeSearch" />
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <a-table
          :columns="columnProductClick"
          :data-source="data"
          :loading="loading"
          :pagination="false"
          :page-size="params.pageSize"
          align="center"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            columnWidth: '40px',
            align: 'right',
          }"
        >
          <span slot="img" slot-scope="text">
            <img
              v-if="text != null"
              class="table-image"
              :src="text.product?.images[0]?.sm_img"
              alt="text"
            />
            <!-- <nuxt-img
              format="webp"
              v-if="text != null"
              class="table-image"
              :src="text.product?.images[0]?.sm_img"
              alt="text"
            /> -->
            <nuxt-img
              format="webp"
              v-else
              class="table-image"
              src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
              alt="text"
            />
          </span>
          <div slot="created_at" slot-scope="text">
            {{ moment(text).format("DD/MM/YYYY,  hh:mm") }}
          </div>
          <div slot="product" slot-scope="text">
            <h6>{{ text.product?.info?.name?.ru }}</h6>
            <span>{{
              text?.category?.parent?.parent &&
              text?.category?.parent?.parent?.name?.ru +
                "/" +
                text?.category?.parent?.name?.ru +
                "/" +
                text?.category?.name?.ru
            }}</span>
          </div>
          <span slot="phone_number" slot-scope="text"> {{ `+${text}` }}</span>
          <span slot="customTitle"></span>

          <span
            slot="status"
            slot-scope="text"
            class="tags-style"
            :class="{
              tag_new: text == 'active',
              tag_canceled: text == 'inactive',
            }"
          >
            {{ text == "active" ? "Активный " : "Неактивный" }}
          </span>

          <span slot="id" slot-scope="text">
            <a-popconfirm
              v-if="checkAccess('applications', 'DELETE')"
              title="Are you sure delete this application ?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deletePoduct(text)"
              @cancel="cancel"
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
  </div>
</template>
<script>
import SearchInput from "../../components/form/Search-input.vue";
import StatusFilter from "../../components/form/Status-filter.vue";
import TitleBlock from "../../components/Title-block.vue";
import global from "../../mixins/global";
import status from "@/mixins/status";
import columns from "../../mixins/columns";
import moment from "moment";
import authAccess from "@/mixins/authAccess";

export default {
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      brandSelect: [
        {
          value: 2,
          label: "Samsung",
        },
        {
          value: 3,
          label: "Apple",
        },
        {
          value: 0,
          label: "HP",
        },
      ],
      options: [
        {
          value: 2,
          label: "All",
        },
        {
          value: 1,
          label: "Активен",
        },
        {
          value: 0,
          label: "Неактивен",
        },
      ],
      brandSearch: "",
      status: "",
      loading: true,
      editIcon: require("../../assets/svg/components/edit-icon.svg?raw"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg?raw"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      tableData: [],
      selectedRowKeys: [], // Check here to configure the default column
      products: [],
      data: [],
      searchProduct: "",
    };
  },
  methods: {
    moment,
    async __GET_PRODUCTS() {
      this.loading = true;
      this.products = await this.$store.dispatch("fetchApplications/getOneClickOrders", {
        ...this.$route.query,
      });
      console.log(this.products);
      this.totalPage = this.products.products?.total;
      this.loading = false;
      this.data = this.products.orders.data;
    },
    deletePoduct(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchApplications/deleteOneClickOrders",
        "Заявкa успешно удален",
        "__GET_PRODUCTS"
      );
    },
    changeSearch(val) {
      this.searchProduct = val.target.value;
    },
    changeStatus(val) {
      // this.status = val;
    },
  },
  async mounted() {
    this.getFirstData("/orders/applications", "__GET_PRODUCTS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/orders/applications", "__GET_PRODUCTS");
    },
  },
  components: {
    SearchInput,
    TitleBlock,
    StatusFilter,
  },
  layout: "toolbar",
};
</script>
