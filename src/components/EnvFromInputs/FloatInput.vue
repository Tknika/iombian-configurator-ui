<template>
  <v-text-field type="number" :label="name" :hint="description" persistent-hint v-model="value" :rules="rule()"
    required />
</template>

<script>
export default {
  name: "IntegerInput",
  data() {
    return {
      value: Number,
    }
  },
  props: {
    name: String,
    description: String,
    type: String,
    default: String,
  },
  created() {
    this.value = parseInt(this.default)
  },
  methods: {
    rule() {
      const splittedType = this.type.split(":")
      if (splittedType.length == 1) {
        return []
      } else {
        const [min, max] = splittedType[1].split(";").map(str => parseInt(str))
        return [
          this.value > min || `Value must be bigger that ${min}`,
          this.value < max || `Value must be smaller that ${max}`,
          holeNumberRegex.test(this.value) || `Value must be an ingeter`,
        ]
      }
    },
  },
  watch: {
    value() {
      this.$emit("input", this.value);
    }
  }
}
</script>
