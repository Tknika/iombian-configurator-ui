Number input for the environment variables form.

Takes the name of the variable, the description, the type, the default value and "float" boolean as props.
The type is the type sting of the labels of the service (e.g. "integer:10;100").
The float boolean represents if the input is a float or a integer.
The input validation changes depending on the type.

<template>
  <v-text-field type="number" :label="name" :hint="description" persistent-hint v-model="value" :rules="rule()"
    required />
</template>

<script>
export default {
  name: "NumberInput",
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
    float: Boolean,
  },
  created() {
    this.value = Number(this.default)
  },
  methods: {
    /**
     * Rule that check if the number is valid.
     *
     * The input must follow the constraints of the type.
     * If the input is not a float, the input can't have a decimal point or comma.
     */
    rule() {
      const splittedType = this.type.split(":")
      let rules = [];

      if (splittedType.length != 1) {
        const [min, max] = splittedType[1].split(";").map(str => Number(str))
        rules = [
          this.value >= min || `Value must be bigger that ${min}`,
          this.value <= max || `Value must be smaller that ${max}`,
        ];
      }

      if (!this.float) {
        const integerRegex = new RegExp("^[0-9]+$")
        rules.push(integerRegex.test(this.value) || `Value must be an ingeter`);
      }

      return rules;
    },
  },
  watch: {
    /** When the value changes, notify to the parent by sending the value as a string. */
    value() {
      this.$emit("input", String(this.value));
    }
  }
}
</script>
