<template lang="html">
  <div>
    <TitleBlock title="Продукты" :breadbrumb="['Каталог']" lastLink="Продукты">
      <div class="d-flex">
        <!-- <div
          class="add-btn add-header-btn add-header-btn-padding btn-primary disabledBtn"
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
            <SearchInput
              placeholder="Поиск продукта"
              @changeSearch="
                ($event) => changeSearch($event, '/catalog/products', '__GET_PRODUCTS')
              "
            />
            <div class="input status-select w-100">
              <!-- <el-select v-model="brandSearch" placeholder="Сортировать" class="w-100">
                <el-option
                  class="w-100"
                  v-for="item in brandSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select> -->
            </div>
            <StatusFilter @changeStatus="changeStatus" />
            <a-button
              @click="clearQuery('/catalog/products', '__GET_PRODUCTS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <a-table
          :columns="columnProduct"
          :data-source="data"
          :loading="loading"
          :pagination="false"
          :page-size="params.pageSize"
          align="center"
        >
          <span slot="key" slot-scope="text">#{{ text }}</span>
          <span slot="img" slot-scope="text">
            <img v-if="text" class="table-image" :src="text" alt="text" />
            <img
              v-else
              class="table-image"
              src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
              alt="text"
            />
            <!-- <img v-if="text != null" class="table-image" :src="text" /> -->
            <!-- <img
              v-else
              class="table-image"
              src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
            /> -->
          </span>
          <div slot="name" slot-scope="text">
            <h6>{{ text?.name?.ru }}</h6>
            <span
              >{{
                text?.category?.parent?.parent &&
                text?.category?.parent?.parent?.name?.ru + "/"
              }}{{
                text?.category?.parent?.name && text?.category?.parent?.name?.ru + "/"
              }}
              {{ text?.category?.name && text?.category?.name?.ru }}</span
            >
          </div>
          <h4 slot="model" slot-scope="text">{{ text ? text : "------" }}</h4>
          <span slot="qty" slot-scope="text">{{ text }}</span>
          <a slot="price" slot-scope="text">{{
            text ? `${`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm` : "------"
          }}</a>
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
            <span
              v-if="checkAccess('products', 'PUT')"
              class="action-btn"
              @click="$router.push(`/catalog/edit_products/${text}`)"
              v-html="editIcon"
            >
            </span>
            <a-popconfirm
              v-if="checkAccess('products', 'DELETE')"
              title="Are you sure delete this product?"
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
import columns from "../../mixins/columns";
import status from "@/mixins/status";
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
    async __GET_PRODUCTS() {
      this.loading = true;
      this.products = await this.$store.dispatch("fetchProducts/getProducts", {
        ...this.$route.query,
      });
      this.totalPage = this.products.products?.total;
      this.loading = false;
      this.data = this.products.products.data.map((item) => {
        if (item.info.products[0].images.length > 0) {
          return {
            ...item,
            key: item.id,
            price: item.price,
            model: item.model,
            name: {
              name: item.name,
              category: item.category,
            },
            img: item.info.products[0].images[0].sm_img,
            status: item.status,
          };
        } else {
          return {
            ...item,
            name: {
              name: item.name,
              category: item.category,
            },
            key: item.id,
            price: item.price,
            model: item.model,
            img: null,
            status: item.status,
          };
        }
      });
      console.log(this.data);
    },
    deletePoduct(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchProducts/deleteProducts",
        "Продукт был успешно удален",
        "__GET_PRODUCTS"
      );
    },
    async changeStatus(val) {
      this.status = val;
      if (val) {
        await this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, status: val },
        });
      } else {
        let query = { ...this.$route.query };
        delete query["status"];
        await this.$router.replace({
          path: this.$route.path,
          query: { ...query },
        });
      }
      this.__GET_PRODUCTS();
    },
  },
  async mounted() {
    this.getFirstData("/catalog/products", "__GET_PRODUCTS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/catalog/products", "__GET_PRODUCTS");
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
