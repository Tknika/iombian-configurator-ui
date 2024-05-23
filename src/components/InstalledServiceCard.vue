<template>
  <v-card>
    <v-row>
      <v-col>
        <v-card-title>
          <div class="text-subtitle-1">
            {{ service?.name ?? "Loading name..." }}
          </div>
        </v-card-title>
      </v-col>
      <v-spacer />
      <v-card-actions>
        <v-btn color="secondary" plain @click="showDialog = true">Edit</v-btn>
        <v-dialog v-model="showDialog" v-if="showDialog">
          <EnvFormDialog :envVars="envVars" :formValues="formValues">
            <v-btn type="button" color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
            <v-btn type="button" color="primary" class="mr-4" @click="setEnvVars()">Save</v-btn>
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
      envVars: {},
    }
  },
  props: {
    service: Object,
  },
  created() {
    this.envVars = this.getEnvVars();
    this.formValues = this.getInstalledEnvVars();
  },
  methods: {
    getEnvVars() {
      let envVars = {}
      Object.values(this.service).forEach(
        (value) => {
          if (typeof value === "object" && "envs" in value) {
            envVars = { ...envVars, ...value.envs }
          }
        }
      );
      return envVars
    },
    getInstalledEnvVars() {
      let installedEnvVars = {};
      Object.keys(this.envVars).forEach((envName) => {
        installedEnvVars[envName] = this.$store.state.deviceServices.services.find(
          (service) => service.id == this.service.id).env[envName]
      })
      return installedEnvVars;
    },
    setEnvVars() {
      this.$store.dispatch("deviceServices/saveEnvVars", {
        id: this.service.id,
        version: this.service.version,
        envVars: this.formValues,
      });
      this.showDialog = false;
    },
    uninstallService() {
      this.$store.dispatch("deviceServices/uninstallService", this.service.id)
    },
  },
}
</script>
