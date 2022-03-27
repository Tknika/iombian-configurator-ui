<template>
  <v-dialog
    persistent
    v-model="show"
    @keydown.esc="close(false)"
    max-width="500px"
  >
    <v-card>
      <v-card-title>New Tunnel</v-card-title>
      <v-card-text>
        <v-form ref="tunnelform">
          <v-select
            v-model="selectedTunnelPort"
            :items="webServices"
            item-value="port"
            item-text="name"
            label="Service"
            prepend-icon="mdi-download-network"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close(false)">Cancel</v-btn>
        <v-btn
          :disabled="!selectedTunnelPort"
          color="primary"
          @click="close(true)"
          >Add</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NewTunnelDialog",
  props: {
    show: Boolean,
    deviceId: String,
    services: Object,
  },
  data: () => ({
    selectedTunnelPort: "",
  }),
  computed: {
    webServices() {
      return Object.values(this.services).filter(
        (service) => service["type"] == "web"
      );
    },
    tunnelService() {
      return this.webServices.find(
        (service) => service.port === this.selectedTunnelPort
      );
    },
  },
  methods: {
    close(create) {
      if (create) {
        const tunnelPort = this.tunnelService["port"];
        const tunnelConfig = {
          type: this.tunnelService["name"].replace(" ", "-").toLowerCase(),
          name: this.tunnelService["name"],
          protocol: "http",
          creationTime: Date.now(),
          url: "",
        };
        this.$store.dispatch("user/addDeviceTunnel", {
          deviceId: this.deviceId,
          tunnelPort: tunnelPort,
          tunnelConfig: tunnelConfig,
        });
      }
      this.$refs.tunnelform.reset();
      this.$emit("closed");
    },
  },
};
</script>