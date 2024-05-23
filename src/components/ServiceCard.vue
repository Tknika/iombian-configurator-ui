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
      <v-card-actions v-if="installed">
        <v-btn class="mr-8" color="error" outlined @click="uninstallService()">Uninstall</v-btn>
      </v-card-actions>
      <v-card-actions v-else>
        <v-dialog v-model="showDialog" v-if="showDialog" >
          <InstallationDialog :envVars="envVars" :formValues="formValues" :installCallback="installServiceCallback" />
        </v-dialog>
        <v-btn class="mr-8" color="primary" @click="showDialog = true">Install</v-btn>
      </v-card-actions>
    </v-row>
  </v-card>
</template>

<script>
import InstallationDialog from "./InstallationDialog.vue"

export default {
  name: "ServiceCard",
  components: {
    InstallationDialog
  },
  data() {
    return {
      showDialog: false,
      formValues: {},
    }
  },
  props: {
    service: {
      type: Object
    },
    installed: {
      type: Boolean,
      defualt: false,
    }
  },
  created() {
  },
  computed: {
    envVars() {
      let envVars = {}
      Object.values(this.service).forEach(
        (value) => {
          if (typeof value === "object" && "envs" in value) {
            envVars = { ...envVars, ...value.envs }
          }
        }
      );
      return envVars
    }
  },
  methods: {
    uninstallService() {
      this.$store.dispatch("deviceServices/uninstallService", this.service.id)
    },
    installServiceCallback() {
      this.$store.dispatch("deviceServices/installService", {
        id: this.service.id,
        version: this.service.version,
        envs: this.formValues
      })
      this.showDialog = false;
    }
  }
}
</script>
