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
        <v-btn class="mr-8" color="primary" @click="showDialog = true">Install</v-btn>
        <v-dialog v-model="showDialog" v-if="showDialog">
          <EnvFormDialog :envs="envs" :formValues="formValues">
            <v-btn type="button" color="secondary" plain class="mr-4" @click="showDialog = false">Cancel</v-btn>
            <v-btn type="button" color="primary" class="mr-4" @click="installService()">Install</v-btn>
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
    }
  },
  props: {
    service: Object,
  },
  created() {
    this.envs = this.getEnvs()
    this.formValues = this.getDefaultEnvs()
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
  }
}
</script>
