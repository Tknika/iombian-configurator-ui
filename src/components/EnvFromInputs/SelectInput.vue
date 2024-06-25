Select input for the environment variables form.

Takes the name of the variable, the description, the type and the default value as props.
The type is the type sting of the labels of the service (e.g. "enum:one,two,three").

<template>
  <v-select v-model="value" :label="name" :hint="description" persistent-hint :items="options" required />
</template>

<script>
export default {
  name: "SelectInput",
  data() {
    return {
      value: String,
      options: Array,
    }
  },
  props: {
    name: String,
    description: String,
    default: String,
    type: String,
  },
  created() {
    this.value = this.default
    this.options = this.type.split(':')[1].split(',')
  },
  methods: {
    /**
     * Rule that check if the password is valid.
     *
     * The input must be in the given options.
     */
    rule() {
      const splittedType = this.type.split(":");
      if (splittedType.length === 1) {
        return []
      }
      const options = splittedType[1].split(",")
      return [options.includes(this.value) || `Value ${this.value} not in given options`]
    }
  },
  watch: {
    /** When the value changes, notify to the parent by sending the value as a string. */
    value() {
      this.$emit("input", this.value);
    }
  }
}
</script>
