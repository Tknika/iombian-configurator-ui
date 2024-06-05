<template>
  <v-card>
    <v-row>
      <v-col cols="6">
        <v-card-title>
          <v-row class="ml-4">
            <span class="subtitle-1 font-weight-medium">
              {{ service?.name ?? "Loading name..." }}
            </span>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <div class="subtitle-1 font-weight-regular ml-2 grey--text text--darken-2" v-on="on">
                  {{ service?.version ?? "" }}
                </div>
              </template>
              <span>
                {{ service?.changelog ?? "Loading changelog..." }}
              </span>
            </v-tooltip>
          </v-row>
        </v-card-title>
        <v-card-subtitle>
          <v-row class="ml-4 mt-3">
            <span class="grey--text text--darken-2">
              {{ service?.author ?? "" }}
            </span>
          </v-row>
          <v-row v-if="service?.documentation_url" class="ml-4 mt-3">
            <a :href="service?.documentation_url">
              Documentation
            </a>
          </v-row>
        </v-card-subtitle>
        <v-card-text class="mt-3">
          {{ service?.description ?? "Loading description..." }}
        </v-card-text>
      </v-col>
      <v-spacer />
      <v-card-actions>
        <v-btn class="mr-8" color="primary" @click="showDialog = true">Install</v-btn>
        <v-dialog v-model="showDialog" v-if="showDialog">
          <EnvFormDialog :envs="envs" :initialValues="initialValues" @isValidForm="setInstallEnabled"
            @formValues="setFormValues" :serviceName="service?.name">
            <v-btn type="button" color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
            <v-btn type="button" color="primary" :disabled="disableInstall" class="mr-4" @click="installService()">Install</v-btn>
          </EnvFormDialog>
        </v-dialog>
      </v-card-actions>
    </v-row>
  </v-card>
</template>

<script>
import EnvFormDialog from "./EnvFormDialog.vue"

export default {
  name: "ServiceCard",
  components: {
    EnvFormDialog
  },
  data() {
    return {
      showDialog: false,
      envs: {},
      formValues: {},
      disableInstall: false,
    }
  },
  props: {
    service: Object,
  },
  created() {
    this.envs = this.getEnvs()
    console.log(this.envs)
  },
  computed: {
    initialValues() {
      return this.getDefaultEnvs();
    }
  },
  methods: {
    getEnvs() {
      let envs = {}
      Object.values(this.service).forEach(
        (value) => {
          if (typeof value === "object" && "envs" in value) {
            envs = { ...envs, ...value.envs }
          }
        }
      );
      return envs
    },
    getDefaultEnvs() {
      let envs = {};
      Object.keys(this.envs).forEach((envName) => {
        envs[envName] = this.envs[envName].default
      })
      return envs;
    },
    installService() {
      this.$store.dispatch("deviceServices/installService", {
        id: this.service.id,
        version: this.service.version,
        envs: this.formValues,
      })
      this.showDialog = false;
    },
    setInstallEnabled(validForm) {
      this.disableInstall = !validForm;
    },
    setFormValues(formValues) {
      this.formValues = formValues;
    }
  }
}
</script>
