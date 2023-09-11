<template lang="html">
  <div>
    <el-form
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormDiCoin"
      label-width="120px"
      class="demo-ruleForm"
    >
      <TitleBlock
        title="Di Coin и Барабан"
        :breadbrumb="['настройки']"
        lastLink="Di Coin и Барабан"
      >
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
          </span>
          <div
            v-if="checkAccess('translations', 'PUT')"
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="submitForm('ruleFormDiCoin')"
          >
            <span class="svg-icon"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                version="1.1"
              >
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <polygon points="0 0 24 0 24 24 0 24"></polygon>
                  <path
                    d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z"
                    fill="#000000"
                    fill-rule="nonzero"
                    opacity="0.3"
                  ></path>
                  <path
                    d="M11,14 L9,14 C8.44771525,14 8,13.5522847 8,13 C8,12.4477153 8.44771525,12 9,12 L11,12 L11,10 C11,9.44771525 11.4477153,9 12,9 C12.5522847,9 13,9.44771525 13,10 L13,12 L15,12 C15.5522847,12 16,12.4477153 16,13 C16,13.5522847 15.5522847,14 15,14 L13,14 L13,16 C13,16.5522847 12.5522847,17 12,17 C11.4477153,17 11,16.5522847 11,16 L11,14 Z"
                    fill="#000000"
                  ></path>
                </g></svg
            ></span>
            Сохранять
          </div>
        </div>
      </TitleBlock>
      <div class="container_xl">
        <div class="card_block-form py-5">
          <div class="form-container">
            <FormTitle title="Di Coin" />
            <div class="products-input-grid-3">
              <div class="form-block align-items-start d-flex">
                <label for="">
                  Di coin для регистрации
                  <a-popover placement="top">
                    <template slot="content">
                      <span>Продукт дня</span>
                    </template>
                    <span class="nav-info">?</span>
                  </a-popover>
                </label>
                <el-form-item class="form-block" prop="dicoin_to_reg">
                  <el-input
                    v-model="ruleForm.dicoin_to_reg"
                    placeholder="Di coin для регистрации..."
                  ></el-input>
                </el-form-item>
              </div>
              <div class="form-block align-items-start d-flex">
                <label for="">
                  Эквивалент покупки Di Coin
                  <a-popover placement="top">
                    <template slot="content">
                      <span>Продукт дня</span>
                    </template>
                    <span class="nav-info">?</span>
                  </a-popover>
                </label>
                <el-form-item class="form-block align-items-start" prop="sum_to_dicoin">
                  <el-input
                    v-model="ruleForm.sum_to_dicoin"
                    placeholder="Эквивалент покупки Di Coin..."
                  ></el-input>
                </el-form-item>
              </div>
              <div class="form-block align-items-start d-flex">
                <label for="">
                  Di Coin использовать цену валюты
                  <a-popover placement="top">
                    <template slot="content">
                      <span>Продукт дня</span>
                    </template>
                    <span class="nav-info">?</span>
                  </a-popover>
                </label>
                <el-form-item class="form-block align-items-start" prop="dicoin_to_sum">
                  <el-input
                    v-model="ruleForm.dicoin_to_sum"
                    placeholder="Di Coin использовать цену валюты..."
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="card_block-form py-5">
          <div class="form-container">
            <FormTitle title="Барабан" />
            <div class="baraban-grid">
              <div v-for="(item, index) in ruleForm?.items" :key="index">
                <el-form-item
                  class="form-block mb-0 align-items-start"
                  label="Барабанная пьеса"
                >
                  <el-input
                    v-model="item.count"
                    type="number"
                    placeholder="Барабанная пьеса..."
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import LayoutHeaderBtn from "../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import Title from "../../components/Title.vue";
import authAccess from "@/mixins/authAccess";

export default {
  layout: "toolbar",
  mixins: [authAccess],
  data() {
    return {
      activeName: "Русский",

      options: [
        {
          value: "HTML",
          label: "HTML",
        },
        {
          value: "CSS",
          label: "CSS",
        },
        {
          value: "JavaScript",
          label: "JavaScript",
        },
      ],
      value: [],
      rules: {
        dicoin_to_sum: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
        sum_to_dicoin: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
        dicoin_to_reg: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
      },
      ruleForm: {
        sum_to_dicoin: "",
        dicoin_to_sum: "",
        dicoin_to_reg: "",
        items: [
          {
            position: 1,
            count: 1,
          },
          {
            position: 2,
            count: 2,
          },
          {
            position: 3,
            count: 3,
          },
          {
            position: 4,
            count: 4,
          },
          {
            position: 5,
            count: 5,
          },
          {
            position: 6,
            count: 6,
          },
          {
            position: 7,
            count: 7,
          },
          {
            position: 8,
            count: 8,
          },
          {
            position: 9,
            count: 9,
          },
          {
            position: 10,
            count: 10,
          },
          {
            position: 11,
            count: 11,
          },
          {
            position: 12,
            count: 12,
          },
        ],
      },
    };
  },
  mounted() {
    this.__GET_DICOIN();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        valid ? this.__POST_DICOIN(this.ruleForm) : false;
      });
    },
    async __GET_DICOIN() {
      const data = await this.$store.dispatch("fetchDiCoin/showDiCoin");
      this.ruleForm = {
        sum_to_dicoin: data?.dicoin?.sum_to_dicoin,
        dicoin_to_sum: data?.dicoin?.dicoin_to_sum,
        dicoin_to_reg: data?.dicoin?.dicoin_to_reg,
      };
      this.ruleForm = {
        ...this.ruleForm,
        items: [...data?.items],
      };
    },
    async __POST_DICOIN(formData) {
      try {
        const data = await this.$store.dispatch("fetchDiCoin/postDiCoin", formData);
        await this.$notify({
          title: "Success",
          message: "Упешно изменен",
          type: "success",
        });
      } catch (e) {
        console.log(e);
      }
    },
    toBack() {
      this.$router.push("/catalog/characteristic");
    },
  },
  components: {
    Title,
    TitleBlock,
    FormTitle,
    LayoutHeaderBtn,
  },
};
</script>
<style lang="css">
.baraban-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;
}
</style>
