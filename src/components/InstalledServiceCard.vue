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
              <v-btn color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
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
        <v-btn color="secondary" plain @click="showDialog = true">
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
              <v-btn color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
              <v-btn color="primary" class="mr-4" :disabled="disableUpdate" @click="updateService()">Update</v-btn>
            </EnvFormDialog>
          </v-dialog>
        </v-tooltip>
        <v-spacer />
        <v-btn color="secondary" plain @click="showDialog = true">
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
    if (this.updatableService) {
      this.updatableEnvs = this.getEnvs(this.updatableService);
    }
  },
  computed: {
    updatableService() {
      return this.getUpdatableService()
    },
    initialValues() {
      return this.getInstalledEnvValues()
    },
    initialUpdatableValues() {
      return this.getUpdatableDefaultEnvs();
    },
  },
  methods: {
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
    getInstalledEnvValues() {
      let installedEnvValues = {};
      Object.keys(this.envs).forEach((envName) => {
        installedEnvValues[envName] = this.$store.state.deviceServices.services.find(
          (service) => service.id == this.service.id).envs[envName]
      })
      return installedEnvValues;
    },
    setEnvs() {
      const formValuseStr = {};
      Object.keys(this.formValues).forEach((key) => {
        formValuseStr[key] = this.formValues[key].toString();
      })
      this.$store.dispatch("deviceServices/saveEnvs", {
        id: this.service.id,
        version: this.service.version,
        envs: formValuseStr,
      });
      this.showDialog = false;
    },
    uninstallService() {
      this.$store.dispatch("deviceServices/uninstallService", this.service.id)
    },
    getUpdatableService() {
      if (!(this.service.id in this.$store.state.deviceServices.fields.updatable_services)) {
        return null
      }

      const version = this.$store.state.deviceServices.fields.updatable_services[this.service.id]
      const service = this.$store.state.marketplaceServices.services.find(
        (service) => service.labels.id == this.service.id && service.labels.version == version
      ).labels;
      return service
    },
    getUpdatableDefaultEnvs() {
      let envs = {};
      Object.keys(this.updatableEnvs).forEach((envName) => {
        envs[envName] = this.updatableEnvs[envName].default
      })
      return envs;
    },
    updateService() {
      this.$store.dispatch("deviceServices/uninstallService", this.service.id).then(() => {
        this.$store.dispatch("deviceServices/installService", {
          id: this.updatableService.id,
          version: this.updatableService.version,
          envs: this.updateFormValues,
        })
        this.showDialog = false;
      })
    },
    setSaveEnabled(validForm) {
      this.disableSave = !validForm
    },
    setUpdateEnabled(validForm) {
      this.disableUpdate = !validForm
    },
    setFormValues(formValues) {
      this.formValues = formValues;
    },
    setUpdateFormValues(formValues) {
      this.updateFormValues = formValues;
    },
  },
}
</script>
