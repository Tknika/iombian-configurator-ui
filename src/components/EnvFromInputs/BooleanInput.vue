<template>
  <v-checkbox :label="name" :hint="description" persistent-hint v-model="value" />
</template>

<script>
export default {
  name: "BooleanInput",
  data() {
    return {
      value: Boolean,
    }
  },
  props: {
    name: String,
    description: String,
    default: String,
  },
  created() {
    this.value = this.default == "true";
  },
  watch: {
    value() {
      if (this.value) {
        this.$emit("input", "true");
      } else {
        this.$emit("input", "false");
      }
    }
  },
}
</script>
