Component for displaying a not installed services information.

Requires a service object with the properties of the labels of the firestore services:
- id
- name
- version
- author
- description
- documentation_url
- changelog
- ${service-name}
  - envs
    - ...

<template>
  <v-card>
    <div class="d-flex flex-column">
      <div class="d-flex justify-space-between">
        <div>

          <v-card-title>
            <span class="subtitle-1 font-weight-medium">
              {{ service?.name ?? "Loading name..." }}
            </span>
          </v-card-title>
        </div>
        <v-card-actions class="pe-4">
          <v-btn v-if="$vuetify.breakpoint.xs" fab small @click="showDialog = true"><v-icon>mdi-download</v-icon></v-btn>
          <v-btn v-else @click="showDialog = true">Install<v-icon right>mdi-download</v-icon></v-btn>
          <v-dialog v-model="showDialog" v-if="showDialog">
            <EnvFormDialog :envs="envs" :initialValues="initialValues" @isValidForm="setInstallEnabled"
              @formValues="setFormValues" :serviceName="service?.name">
              <v-btn type="button" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
              <v-btn type="button" :disabled="disableInstall" class="mr-4" @click="installService()">Install</v-btn>
            </EnvFormDialog>
          </v-dialog>
        </v-card-actions>
      </div>

      <v-card-subtitle class="grey--text text--darken-2 px-4 pb-2 pt-0">
        <span>{{ service?.author + " • " ?? "" }}</span>
        <span>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <div class="d-inline" v-on="on">
                {{ service?.version ?? "" }}
              </div>
            </template>
            <span>
              {{ service?.changelog ?? "Loading changelog..." }}
            </span>
          </v-tooltip>
        </span>
      </v-card-subtitle>

      <div v-if="service?.documentation_url" class="ml-4 mt-3">
        <a :href="service?.documentation_url">
          Documentation
        </a>
      </div>

      <v-card-text style="max-width: 80ch;">
        {{ service?.description ?? "Loading description..." }}
      </v-card-text>
    </div>
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
    if ("order" in Object.values(this.envs)[0]) {
      this.envs = this.sortEnvs(this.envs);
    }
  },
  computed: {
    /** The initial values of the service envs form. */
    initialValues() {
      return this.getDefaultEnvs();
    }
  },
  methods: {
    /**
     * Get the envs of this service as {[env_name]: env_data}.
     *
     * The env data has the name, description, default value, and type properties.
     */
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
    /** Given the envs, sort them by the "order" property. */
    sortEnvs(envs) {
      return Object.entries(envs)
        .sort((a, b) => parseInt(a[1].order) - parseInt(b[1].order))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    },
    /** Get the default values of the service envs in {[env_name]: env_value} format. */
    getDefaultEnvs() {
      let envs = {};
      Object.keys(this.envs).forEach((envName) => {
        envs[envName] = this.envs[envName].default
      })
      return envs;
    },
    /** Install this service in the device. */
    installService() {
      this.$store.dispatch("deviceServices/installService", {
        id: this.service.id,
        version: this.service.version,
        envs: this.formValues,
      })
      this.showDialog = false;
    },
    /** Set the install button from the service envs form as enabled/disabled. */
    setInstallEnabled(validForm) {
      this.disableInstall = !validForm;
    },
    /** When the values of the service envs form change, this callback is called and updates the form values. */
    setFormValues(formValues) {
      this.formValues = formValues;
    }
  }
}
</script>
