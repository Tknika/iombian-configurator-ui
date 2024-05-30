<template>
  <v-card>
    <v-row justify="space-between">
      <v-col cols="6">
        <v-card-title>
          <v-row class="ml-4" align="center">
            <span class="subtitle-1 font-weight-medium">
              {{ service?.name ?? "Loading name..." }}
            </span>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div class="subtitle-1 font-weight-regular ml-2 grey--text text--darken-2" v-on="on">
                  {{ service?.version ?? "" }}
                </div>
              </template>
              <span>
                {{ service?.changelog ?? "Loading changelog..." }}
              </span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn v-show="updatableService" color="primary" class="ml-4" v-on="on" @click="showUpdateDialog = true">
                  Update
                </v-btn>
              </template>
              <span>
                Update to {{ updatableService?.version }} version
              </span>
              <v-dialog v-model="showUpdateDialog" v-if="showUpdateDialog">
                <EnvFormDialog :envs="updatableEnvs" :formValues="updateFormValues">
                  <v-btn type="button" color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
                  <v-btn type="button" color="primary" class="mr-4" @click="updateService()">Update</v-btn>
                </EnvFormDialog>
              </v-dialog>
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
      <v-col cols="auto">
        <v-card-actions>
          <v-btn color="secondary" plain @click="showDialog = true">Edit</v-btn>
          <v-dialog v-model="showDialog" v-if="showDialog">
            <EnvFormDialog :envs="envs" :formValues="formValues">
              <v-btn type="button" color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
              <v-btn type="button" color="primary" class="mr-4" @click="setEnvs()">Save</v-btn>
            </EnvFormDialog>
          </v-dialog>
          <v-btn class="mr-8" color="error" outlined @click="uninstallService()">Uninstall</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
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
      showUpdateDialog: false,
      updatableEnvs: {},
      updateFormValues: {},
    }
  },
  props: {
    service: Object,
  },
  created() {
    this.envs = this.getEnvs(this.service);
    this.formValues = this.getInstalledEnvValues();
    if (this.updatableService) {
      this.updatableEnvs = this.getEnvs(this.updatableService);
      this.updateFormValues = this.getUpdatableDefaultEnvs();
    }
  },
  computed: {
    updatableService() {
      return this.getUpdatableService()
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
      this.$store.dispatch("deviceServices/saveEnvs", {
        id: this.service.id,
        version: this.service.version,
        envs: this.formValues,
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
    }
  },
}
</script>
