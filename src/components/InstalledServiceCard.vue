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
        <v-btn color="secondary" plain @click="showDialog = true">Edit</v-btn>
        <v-dialog v-model="showDialog" v-if="showDialog">
          <EnvFormDialog :envs="envs" :formValues="formValues">
            <v-btn type="button" color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
            <v-btn type="button" color="primary" class="mr-4" @click="setEnvs()">Save</v-btn>
          </EnvFormDialog>
        </v-dialog>
        <v-btn class="mr-8" color="error" outlined @click="uninstallService()">Uninstall</v-btn>
      </v-card-actions>
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
      formValues: {},
      envs: {},
    }
  },
  props: {
    service: Object,
  },
  created() {
    this.envs = this.getEnvs();
    this.formValues = this.getInstalledEnvs();
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
    getInstalledEnvs() {
      let installedEnvs = {};
      Object.keys(this.envs).forEach((envName) => {
        installedEnvs[envName] = this.$store.state.deviceServices.services.find(
          (service) => service.id == this.service.id).envs[envName]
      })
      return installedEnvs;
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
  },
}
</script>
