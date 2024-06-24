Form for setting the environment variables of a service.

Takes the service name, the environment variables and the initial values of the form.

The environment variables object is a {[env_name]: env_data} object.
The env_data has the name, description, default value, and type properties.

The initial values of the form are in a {[env_name]: env_value} format.

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
            <NumberInput v-if="env.type.split(':')[0] == 'integer'" v-model="formValues[envName]" :name="env.name"
              :description="env.description" :type="env.type" :default="initialValues[envName]" integer />
            <NumberInput v-else-if="env.type.split(':')[0] == 'float'" v-model="formValues[envName]" :name="env.name"
              :description="env.description" :type="env.type" :default="initialValues[envName]" />
            <TextInput
              v-else-if="env.type == 'string' || (env.type.split(':')[0] == 'string' && (env.type.split(':')[1][0] == '0'))"
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
import NumberInput from "./EnvFromInputs/NumberInput.vue";
import TextInput from "./EnvFromInputs/TextInput.vue";
import PasswordInput from "./EnvFromInputs/PasswordInput.vue";
import BooleanInput from "./EnvFromInputs/BooleanInput.vue";
import SelectInput from "./EnvFromInputs/SelectInput.vue";

export default {
  components: {
    NumberInput,
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
    this.formValues = { ...this.initialValues };
  },
  watch: {
    /** When the form changes send a notification to the parent components `isValidForm` function with a boolean value representing if the form is valid or not. */
    isValidForm() {
      this.$emit("isValidForm", this.isValidForm);
    },
    /** When the value of a form input changes, send a notification to the parent components `formValues` function with the values of the form inputs. */
    formValues() {
      this.$emit("formValues", this.formValues);
    }
  }
}
</script>
