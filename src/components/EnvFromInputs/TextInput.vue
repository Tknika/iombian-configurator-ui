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
    value() {
      this.$emit("input", this.value);
    }
  }
}
</script>
