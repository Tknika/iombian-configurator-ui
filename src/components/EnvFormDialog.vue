<template>
  <v-card>
    <v-card-title>
      Set service variables
    </v-card-title>
    <v-card-subtitle>
      It is recommended to maintain the default values
    </v-card-subtitle>
    <v-form v-model="form" class="pa-4" lazy-validation>
      <v-container>
        <v-row v-for="(env, envName, index) in envVars" :key="index">
          <v-col>
            <v-text-field v-if="env.type.split(':')[0] == 'integer'" type="number" :label="env.name"
              :hint="env.description" persistent-hint v-model="formValues[envName]"
              :rules="rules(formValues[envName], env.type)" required />
            <v-text-field v-else-if="env.type.split(':')[0] == 'string'" :label="env.name" :hint="env.description"
              persistent-hint v-model="formValues[envName]" required />
            <v-select v-else-if="env.type.split(':')[0] == 'enum'" :label="env.name" :hint="env.description"
              persistent-hint :items="env.type.split(':')[1].split(',')" v-model="formValues[envName]" required />
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
export default {
  name: "InstallationDialog",
  props: {
    envVars: {},
    formValues: Object,
  },
  data() {
    return {
      form: null,
    }
  },
  methods: {
    rules(value, type) {
      const ruleType = type.split(":")[0]
      switch (ruleType) {
        case "integer":
          return this.integerRule(value, type)
        case "string":
          return []
        // return this.stringRule(value, type)
        case "enum":
          return []
        // return this.enumRule(value, type)
      }
    },
    integerRule(value, type) {
      const splittedType = type.split(":")
      if (splittedType.lenth === 1) {
        return []
      } else {
        const [min, max] = splittedType[1].split(";").map(str => parseInt(str))
        return [
          value > min || `Value must be bigger that ${min}`,
          value < max || `Value must be smaller that ${max}`
        ]
      }
    },
    // stringRule(value, type) {
    //   const splittedType = type.split(":")
    //   if (splittedType.lenth === 1) {
    //     return []
    //   } else {
    //     const regexPattern = splitted
    //   }
    // }
  }
}
</script>
