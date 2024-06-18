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
    integer: Boolean,
  },
  created() {
    this.value = Number(this.default)
  },
  methods: {
    rule() {
      const splittedType = this.type.split(":")
      let rules = [];

      if(splittedType.length != 1) {
        const [min, max] = splittedType[1].split(";").map(str => Number(str))
        rules = [
          this.value >= min || `Value must be bigger that ${min}`,
          this.value <= max || `Value must be smaller that ${max}`,
        ];
      }

      if (this.integer) {
        const integerRegex = new RegExp("^[0-9]+$")
        rules.push(integerRegex.test(this.value) || `Value must be an ingeter`);
      }

      return rules;
    },
  },
  watch: {
    value() {
      this.$emit("input", this.value);
    }
  }
}
</script>
