Text input for the environment variables form.

Takes the name of the variable, the description, the type and the default value as props.
The type is the type sting of the labels of the service (e.g. "string:0;").

<template>
  <v-text-field :label="name" :hint="description" persistent-hint v-model="value" required :rules="rule()"
    type="text" />
</template>

<script>
export default {
  name: "TextInput",
  data() {
    return {
      value: String,
    }
  },
  props: {
    name: String,
    description: String,
    type: String,
    default: String,
  },
  created() {
    this.value = this.default
  },
  methods: {
    /**
     * Rule that check if the password is valid.
     *
     * The input must follow the constraints of the type.
     */
    rule() {
      const splittedType = this.type.split(":")
      if (splittedType.length === 1) {
        return []
      }
      const regexString = splittedType[1].substr(2)
      const regexPattern = new RegExp(regexString)
      return [regexPattern.test(this.value) || `Value must follow the given regex: ${regexString}`]
    },
  },
  watch: {
    /** When the value changes, notify to the parent by sending the value. */
    value() {
      this.$emit("input", this.value);
    }
  }
}
</script>
