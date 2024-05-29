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
