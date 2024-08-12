<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-show="updatableService" color="orange" v-on="on"
        @click="showDialog = true">mdi-arrow-up-bold-box</v-icon>
    </template>
    <span>
      Update to {{ updatableService?.version }} version
    </span>
    <v-dialog v-model="showDialog" v-if="showDialog">
      <EnvFormDialog :envs="updatableServiceEnvs" :initialValues="updatableServicesEnvsValues"
        @isValidForm="setUpdateEnabled" @formValues="setFormValues" :serviceName="service?.name">
        <v-btn color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
        <v-btn color="primary" class="mr-4" :disabled="isUpdateEnabled" @click="updateService()">Update</v-btn>
      </EnvFormDialog>
    </v-dialog>
  </v-tooltip>
</template>

<script>
  import EnvFormDialog from "./EnvFormDialog.vue"

  export default {
    name: "UpdatableServiceIndicator",
    components: {
      EnvFormDialog
    },
    props: {
      service: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        showDialog: false,
        formValues: {},
        validForm: false,
        isUpdateEnabled: false,
      }
    },
    computed: {
      /**
       * If the service is updatable, the service to be updated to.
       * This will be the same service but with another version.
       */
      updatableService() {
        return this.getUpdatableService();
      },
      /** The environment variables of the updatable service. */
      updatableServiceEnvs() {
        return this.sortEnvs(this.getEnvs(this.updatableService));
      },
      /** The environment variables values of the updatable service. */
      updatableServicesEnvsValues() {
        let envs = {};
        Object.keys(this.updatableServiceEnvs).forEach((envName) =>
          envs[envName] = this.updatableServiceEnvs[envName].default);
        return envs;
      },
    },
    methods: {
      /**
       * Given the service object, get the envs as {[env_name]: env_data}.
       *
       * The env data has the name, description, default value, and type properties.
       */
      getEnvs(service) {
        let envs = {}
        Object.values(service).forEach((value) => {
          if (typeof value === "object" && "envs" in value) {
            envs = { ...envs, ...value.envs }
          }
        }
        );
        return envs
      },
      /** Given the envs, sort them by the "order" property. */
      sortEnvs(envs) {
        // If the first env does not have the "order" property, return the envs as they are.
        if ("order" in (Object.values(envs)[0] ?? {}) === false) return envs;
        // Sort the envs by the "order" property.
        return Object.entries(envs)
          .sort((a, b) => parseInt(a[1].order) - parseInt(b[1].order))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      },
      /** Get the updatable service.
       *
       * The updatable service is the same service but with another version.
       * This is done because a service can have different labels in different versions.
       */
      getUpdatableService() {
        const updatable_services = this.$store.state.deviceServices.fields.updatable_services;
        if (updatable_services?.[this.service.id] === undefined) {
          return
        }
        const version = updatable_services[this.service.id]
        const service = this.$store.state.marketplaceServices.services.find(
          (service) => service.labels.id == this.service.id && service.labels.version == version
        ).labels;
        return service
      },
      /** Update this service to the updatable service. */
      updateService() {
        this.$store.dispatch("deviceServices/installService", {
          id: this.updatableService.id,
          version: this.updatableService.version,
          status: "to-be-updated",
          envs: this.formValues,
        })
        this.showDialog = false;
      },
      /** Set the 'Update' button from the updatable service envs form as enabled/disabled. */
      setUpdateEnabled(validForm) {
        this.isUpdateEnabled = !validForm
      },
      /** When the values of the service envs form change, this callback is called and updates the form values. */
      setFormValues(formValues) {
        this.formValues = formValues;
      },
    }
  }
</script>
