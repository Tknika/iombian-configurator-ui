<template>
  <v-card>
    <v-card-title>
      Set {{ serviceName }} variables
    </v-card-title>
    <v-card-subtitle class="pb-0">
      It is recommended to maintain the default values
    </v-card-subtitle>
    <v-form v-model="isValidForm" class="pa-4" lazy-validation>
      <v-container>
        <v-row v-for="(env, envName, index) in envs" :key="index">
          <v-col>
            <IntegerInput v-if="env.type.split(':')[0] == 'integer'" v-model="formValues[envName]" :name="env.name"
              :description="env.description" :type="env.type" :default="initialValues[envName]" integer />
            <IntegerInput v-else-if="env.type.split(':')[0] == 'float'" v-model="formValues[envName]" :name="env.name"
              :description="env.description" :type="env.type" :default="initialValues[envName]" />
            <TextInput v-else-if="env.type.split(':')[0] == 'string' && env.type.split(':')[1][0] == '0'"
              v-model="formValues[envName]" :name="env.name" :description="env.description" :type="env.type"
              :default="initialValues[envName]" />
            <PasswordInput v-else-if="env.type.split(':')[0] == 'string' && env.type.split(':')[1][0] == '1'"
              v-model="formValues[envName]" :name="env.name" :description="env.description" :type="env.type"
              :default="initialValues[envName]" />
            <SelectInput v-else-if="env.type.split(':')[0] == 'enum'" v-model="formValues[envName]" :name="env.name"
              :description="env.description" :type="env.type" :default="initialValues[envName]" />
            <BooleanInput v-else-if="env.type == 'boolean'" v-model="formValues[envName]" :name="env.name"
              :description="env.description" :default="initialValues[envName]" />
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <slot></slot>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import IntegerInput from "./EnvFromInputs/IntegerInput.vue";
import TextInput from "./EnvFromInputs/TextInput.vue";
import PasswordInput from "./EnvFromInputs/PasswordInput.vue";
import BooleanInput from "./EnvFromInputs/BooleanInput.vue";
import SelectInput from "./EnvFromInputs/SelectInput.vue";

export default {
  components: {
    IntegerInput,
    TextInput,
    PasswordInput,
    BooleanInput,
    SelectInput,
  },
  name: "EnvFormDialog",
  data() {
    return {
      formValues: {},
      isValidForm: false,
    }
  },
  props: {
    envs: {},
    initialValues: Object,
    serviceName: String,
  },
  created() {
    console.log(this.initialValues)
    this.formValues = { ...this.initialValues };
  },
  watch: {
    isValidForm() {
      this.$emit("isValidForm", this.isValidForm);
    },
    formValues() {
      this.$emit("formValues", this.formValues);
    }
  }
}
</script>
