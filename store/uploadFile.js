export const actions = {
  async uploadFile({}, data) {
    const res = this.$axios.$post(
      `https://api.e-shop.ndc.uz/api/admin/files/upload`,
      data
    );
    return res;
  },
};
