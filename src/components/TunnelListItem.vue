<template>
  <div>
    <v-list-item :key="tunnelPort">
      <v-list-item-content>
        <v-list-item-title
          >{{ tunnelName }}
          <TunnelStatusIcon :tunnelStatus="tunnelStatus" />
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          small
          v-if="tunnelStatus == 'online'"
          :href="tunnelFullURL"
          target="_blank"
          ><v-icon>mdi-link</v-icon></v-btn
        >
      </v-list-item-action>
      <v-list-item-action>
        <v-icon @click="deleteTunnel()">mdi-delete</v-icon>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>


<script>
import TunnelStatusIcon from "./TunnelStatusIcon.vue";
export default {
  name: "TunnelListItem",
  props: {
    deviceId: {
      type: String,
      required: true,
    },
    tunnelConfig: {
      type: Object,
      required: true,
    },
    tunnelPort: {
      type: String,
      required: true,
    },
  },
  components: {
    TunnelStatusIcon,
  },
  data: () => ({
    tunnelStatus: "loading",
    statusTimeoutPeriodMs: 4000,
  }),
  computed: {
    tunnelName() {
      return this.tunnelConfig["name"];
    },
    tunnelURL() {
      return this.tunnelConfig["url"];
    },
    tunnelFullURL() {
      return "https://" + this.tunnelURL;
    },
    tunnelCreationTime() {
      return this.tunnelConfig["creationTime"];
    },
  },
  created() {
    if (Date.now() - this.tunnelCreationTime < this.statusTimeoutPeriodMs)
      setTimeout(this.checkStatus, this.statusTimeoutPeriodMs);
    else this.checkStatus();
  },
  methods: {
    checkStatus() {
      this.tunnelStatus = this.tunnelURL != "" ? "online" : "offline";
    },
    deleteTunnel() {
      this.$store.dispatch("user/deleteDeviceTunnel", {
        deviceId: this.deviceId,
        tunnelPort: this.tunnelPort,
      });
    },
  },
};
</script>