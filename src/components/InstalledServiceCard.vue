Component for displaying an installed services information.

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
  <v-card v-if="$vuetify.breakpoint.xs">
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <v-card-title class="subtitle-1 font-weight-medium">
          {{ service?.name ?? "Loading name..." }}
        </v-card-title>
        <v-spacer />
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-show="updatableService" class="mr-4" small fab v-on="on" @click="showUpdateDialog = true">
              <v-icon>mdi-update</v-icon>
            </v-btn>
          </template>
          <span>
            Update to {{ updatableService?.version }} version
          </span>
          <v-dialog v-model="showUpdateDialog" v-if="showUpdateDialog">
            <EnvFormDialog :envs="updatableEnvs" :initialValues="initialUpdatableValues" @isValidForm="setUpdateEnabled"
              @formValues="setUpdateFormValues" :serviceName="service?.name">
              <v-btn color="secondary" plain class="mr-4" @click="showUpdateDialog = false">Cancel</v-btn>
              <v-btn color="primary" class="mr-4" :disabled="disableUpdate" @click="updateService()">Update</v-btn>
            </EnvFormDialog>
          </v-dialog>
        </v-tooltip>
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

      <div class="d-flex justify-end gap-2 pe-4 py-4">
        <v-btn v-if="isServiceEditable" color="secondary" plain @click="showDialog = true">
          Edit
          <v-icon right>mdi-pencil</v-icon>
        </v-btn>
        <v-dialog v-model="showDialog" v-if="showDialog">
          <EnvFormDialog :envs="envs" :initialValues="initialValues" @isValidForm="setSaveEnabled"
            @formValues="setFormValues" :serviceName="service?.name">
            <v-btn type="button" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
            <v-btn type="button" :disabled="disableSave" class="mr-4" @click="setEnvs()">Save</v-btn>
          </EnvFormDialog>
        </v-dialog>

        <v-btn @click="uninstallService()">
          Uninstall
          <v-icon right>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>

  <v-card v-else>
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <v-card-title class="subtitle-1 font-weight-medium">
          {{ service?.name ?? "Loading name..." }}
        </v-card-title>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-show="updatableService" small fab v-on="on" @click="showUpdateDialog = true">
              <v-icon>mdi-update</v-icon>
            </v-btn>
          </template>
          <span>
            Update to {{ updatableService?.version }} version
          </span>
          <v-dialog v-model="showUpdateDialog" v-if="showUpdateDialog">
            <EnvFormDialog :envs="updatableEnvs" :initialValues="initialUpdatableValues" @isValidForm="setUpdateEnabled"
              @formValues="setUpdateFormValues" :serviceName="service?.name">
              <v-btn color="secondary" plain class="mr-4" @click="showUpdateDialog = false">Cancel</v-btn>
              <v-btn color="primary" class="mr-4" :disabled="disableUpdate" @click="updateService()">Update</v-btn>
            </EnvFormDialog>
          </v-dialog>
        </v-tooltip>
        <v-spacer />
        <v-btn v-if="isServiceEditable" color="secondary" plain @click="showDialog = true">
          Edit
          <v-icon right>mdi-pencil</v-icon>
        </v-btn>
        <v-dialog v-model="showDialog" v-if="showDialog">
          <EnvFormDialog :envs="envs" :initialValues="initialValues" @isValidForm="setSaveEnabled"
            @formValues="setFormValues" :serviceName="service?.name">
            <v-btn type="button" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
            <v-btn type="button" :disabled="disableSave" class="mr-4" @click="setEnvs()">Save</v-btn>
          </EnvFormDialog>
        </v-dialog>

        <v-btn class="mr-4" @click="uninstallService()">
          Uninstall
          <v-icon right>mdi-delete</v-icon>
        </v-btn>
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

      <v-card-text style="max-width: 80ch;">
        {{ service?.description ?? "Loading description..." }}
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import EnvFormDialog from "./EnvFormDialog.vue"

export default {
  name: "InstalledServiceCard",
  components: {
    EnvFormDialog
  },
  data() {
    return {
      showDialog: false,
      envs: {},
      formValues: {},
      validForm: false,
      disableSave: false,
      showUpdateDialog: false,
      updatableEnvs: {},
      updateFormValues: {},
      validUpdateForm: false,
      disableUpdate: false,
    }
  },
  props: {
    service: Object,
  },
  created() {
    this.envs = this.getEnvs(this.service);
    const envs_values = Object.values(this.envs);
    if (envs_values.length && "order" in envs_values[0]) {
      this.envs = this.sortEnvs(this.envs);
    }

    if (this.updatableService) {
      this.updatableEnvs = this.getEnvs(this.updatableService);
      if ("order" in Object.values(this.updatableEnvs)[0]) {
        this.updatableEnvs = this.sortEnvs(this.updatableEnvs);
      }
    }
  },
  computed: {
    /**
     * If the service is updatable, the service to be updated to.
     * This will be the same service but with another version.
     *
     * This is done because a service can have different labels in different versions.
     */
    updatableService() {
      return this.getUpdatableService()
    },
    /** The initial values of the service envs form. */
    initialValues() {
      return this.getInstalledEnvValues()
    },
    /** The initial values of the updatable service envs form. */
    initialUpdatableValues() {
      return this.getUpdatableDefaultEnvs();
    },
    /** Check if the service is editable. */
    isServiceEditable() {
      // A service is editable if it has any env var.
      return Object.values(this.envs).length > 0;
    }
  },
  methods: {
    /**
     * Given the service object, get the envs as {[env_name]: env_data}.
     *
     * The env data has the name, description, default value, and type properties.
     */
    getEnvs(service) {
      let envs = {}
      Object.values(service).forEach(
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
    /** Get the current values of the envs of the installed service. */
    getInstalledEnvValues() {
      let installedEnvValues = {};
      Object.keys(this.envs).forEach((envName) => {
        installedEnvValues[envName] = this.$store.state.deviceServices.services.find(
          (service) => service.id == this.service.id).envs[envName]
      })
      return installedEnvValues;
    },
    /** Set the values of the envs from the result of the form values. */
    setEnvs() {
      const formValuesStr = {};
      Object.keys(this.formValues).forEach((key) => {
        formValuesStr[key] = this.formValues[key].toString();
      })
      this.$store.dispatch("deviceServices/saveEnvs", {
        id: this.service.id,
        version: this.service.version,
        envs: formValuesStr,
      });
      this.showDialog = false;
    },
    /** Uninstall this service. */
    uninstallService() {
      this.$store.dispatch("deviceServices/uninstallService", this.service.id)
    },
    /** Get the updatable service.
     *
     * The updatable service is the same service but with another version.
     * This is done because a service can have different labels in different versions.
     */
    getUpdatableService() {
      if (this.$store.state.deviceServices.fields.updatable_services === undefined) {
        return null
      }
      if (!(this.service.id in this.$store.state.deviceServices.fields.updatable_services)) {
        return null
      }

      const version = this.$store.state.deviceServices.fields.updatable_services[this.service.id]
      const service = this.$store.state.marketplaceServices.services.find(
        (service) => service.labels.id == this.service.id && service.labels.version == version
      ).labels;
      return service
    },
    /** Get the default values of the updatable service envs in {[env_name]: env_value} format. */
    getUpdatableDefaultEnvs() {
      let envs = {};
      Object.keys(this.updatableEnvs).forEach((envName) => {
        envs[envName] = this.updatableEnvs[envName].default
      })
      return envs;
    },
    /** Update this service to the updatable service. */
    updateService() {
      this.$store.dispatch("deviceServices/uninstallService", this.service.id).then(() => {
        this.$store.dispatch("deviceServices/installService", {
          id: this.updatableService.id,
          version: this.updatableService.version,
          envs: this.updateFormValues,
        })
        this.showUpdateDialog = false;
      })
    },
    /** Set the save button from the service envs form as enabled/disabled. */
    setSaveEnabled(validForm) {
      this.disableSave = !validForm
    },
    /** Set the update button from the updatable service envs form as enabled/disabled. */
    setUpdateEnabled(validForm) {
      this.disableUpdate = !validForm
    },
    /** When the values of the service envs form change, this callback is called and updates the form values. */
    setFormValues(formValues) {
      this.formValues = formValues;
    },
    /** When the values of the updatable service envs form change, this callback is called and updates the updatable form values. */
    setUpdateFormValues(formValues) {
      this.updateFormValues = formValues;
    },
  },
}
</script>
