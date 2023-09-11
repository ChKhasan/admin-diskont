<template>
  <div>
    <a-select
      ref="select"
      :options="options"
      showSearch
      v-model="selectedValue"
      placeholder="Type to search"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: "",
      options: ["Option 1", "Option 2", "Option 3"],
    };
  },
  methods: {
    handleInput(value) {
      // Your custom logic to determine whether to automatically select the value
      // const shouldAutoSelect = value.length > 2;

      if (shouldAutoSelect) {
        // Programmatically set the selected value
        this.setSelectedValue(value);
      }
    },
    setSelectedValue(value) {
      const selectComponent = this.$refs.select;

      // Find the option with the matching value
      const option = selectComponent.options.find((opt) => opt.value === value);

      if (option) {
        // Update the selected value
        this.selectedValue = option.value;

        // Close the dropdown and clear the search input
        selectComponent.blur();
      }
    },
    handleBlur() {
      // Clear the selected value if the user leaves the Select component
      if (!this.selectedValue) {
        this.selectedValue = "";
      }
    },
  },
};
</script>
