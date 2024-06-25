Boolean input for the environment variables form.

Takes the name of the variable, the description and the default value as props.

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
    /** When the value changes, notify to the parent by sending "true" of "false" depending on the value. */
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
