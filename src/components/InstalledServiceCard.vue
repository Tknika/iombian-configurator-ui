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
  <v-card v-if="$vuetify.breakpoint.xs" :loading="isInstallationInProgress">
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <v-card-title class="subtitle-1 font-weight-medium">
          {{ service?.name ?? "Loading name..." }}
          <InstalledServiceStatusIcon :serviceStatus="serviceStatus"></InstalledServiceStatusIcon>
        </v-card-title>
        <v-spacer />
        <UpdatableServiceIndicator :service="service"></UpdatableServiceIndicator>
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
          <EnvFormDialog :envs="serviceEnvs" :initialValues="serviceEnvsValues" @isValidForm="setSaveEnabled"
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

  <v-card v-else :loading="isInstallationInProgress">
    <div class="d-flex flex-column">
      <div class="d-flex align-center">
        <v-card-title class="subtitle-1 font-weight-medium">
          {{ service?.name ?? "Loading name..." }}
          <InstalledServiceStatusIcon :serviceStatus="serviceStatus"></InstalledServiceStatusIcon>
        </v-card-title>
        <UpdatableServiceIndicator :service="service"></UpdatableServiceIndicator>
        <v-spacer />
        <v-btn v-if="isServiceEditable" color="secondary" plain @click="showDialog = true">
          Edit
          <v-icon right>mdi-pencil</v-icon>
        </v-btn>
        <v-dialog v-model="showDialog" v-if="showDialog">
          <EnvFormDialog :envs="serviceEnvs" :initialValues="serviceEnvsValues" @isValidForm="setSaveEnabled"
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
  import InstalledServiceStatusIcon from './InstalledServiceStatusIcon.vue'
  import UpdatableServiceIndicator from './UpdatableServiceIndicator.vue'
  import service_status_info_mapping from "../assets/service_status_info_mapping";

  export default {
    name: "InstalledServiceCard",
    components: {
      EnvFormDialog,
      InstalledServiceStatusIcon,
      UpdatableServiceIndicator,
    },
    data() {
      return {
        showDialog: false,
        formValues: {},
        validForm: false,
        disableSave: false,
        serviceStatusMap: service_status_info_mapping
      }
    },
    props: {
      service: Object,
    },
    computed: {
      /** The environment variables of the installed service. */
      serviceEnvs() {
        return this.sortEnvs(this.getEnvs(this.service));
      },
      /** The environment variables values of the installed service. */
      serviceEnvsValues() {
        return this.getServiceEnvsValues()
      },
      /** Check if the service is editable. */
      isServiceEditable() {
        // A service is editable if it has any env var.
        return Object.values(this.serviceEnvs).length > 0;
      },
      /** The status of the service. */
      serviceStatus() {
        return this.$store.state.deviceServices.services.find(
          (service) => service.id == this.service.id)?.status ?? "unknown";
      },
      /** 
       * Check if the installation of the service is in progress.
       * If it is, returns the color assigned to the status.
       * If it is not, returns false.
       */
      isInstallationInProgress() {
        return ["started", "unknown"].includes(this.serviceStatus) ?
          false :
          this.serviceStatusMap[this.serviceStatus]?.color ?? false;
      }
    },
    methods: {
      /** Uninstall this service. */
      uninstallService() {
        this.$store.dispatch("deviceServices/uninstallService", this.service.id)
      },
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
      /** Get the current values of the envs of the installed service. */
      getServiceEnvsValues() {
        let envs = {};
        Object.keys(this.serviceEnvs).forEach((envName) => {
          envs[envName] = this.$store.state.deviceServices.services.find(
            (service) => service.id == this.service.id).envs[envName]
        })
        return envs;
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
          status: "to-be-reconfigured",
          envs: formValuesStr,
        });
        this.showDialog = false;
      },
      /** Set the save button from the service envs form as enabled/disabled. */
      setSaveEnabled(validForm) {
        this.disableSave = !validForm
      },
      /** When the values of the service envs form change, this callback is called and updates the form values. */
      setFormValues(formValues) {
        this.formValues = formValues;
      },
    },
  }
</script>
