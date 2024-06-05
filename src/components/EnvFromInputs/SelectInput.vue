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
    value() {
      this.$emit("input", this.value);
    }
  }
}
</script>
