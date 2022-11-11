<template>
  <v-expansion-panel v-show="localConnectionStatus == 'online'">
    <v-expansion-panel-header class="px-4">
      <span>Available services: {{ numOnlineWebServices }}</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content dense flat>
      <v-list dense>
        <v-fade-transition group>
          <LocalServiceListItem
            :service="serviceParams"
            :ipList="candidateIps"
            :remoteConnectionStatus="remoteConnectionStatus"
            :key="index"
            @serviceStatusUpdated="onServiceStatusUpdated"
            v-for="(serviceParams, serviceName, index) in webServices"
          />
        </v-fade-transition>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import LocalServiceListItem from "./LocalServiceListItem";
export default {
  name: "LocalServicesExpansionPanel",
  props: {
    services: {
      type: Object,
      required: true,
    },
    systemInfo: {
      type: Object,
      required: true,
    },
    remoteConnectionStatus: {
      type: String,
      required: false,
      default: "online",
    },
  },
  components: {
    LocalServiceListItem,
  },
  data: () => ({
    webServicesStatusMapping: {},
  }),
  computed: {
    webServices() {
      return Object.keys(this.services)
        .filter((service) => this.services[service]["type"] == "web")
        .reduce((obj, service) => {
          return { ...obj, [service]: this.services[service] };
        }, {});
    },
    candidateIps() {
      if (
        Object.prototype.hasOwnProperty.call(this.systemInfo, "local_network")
      ) {
        const interfaces = this.systemInfo["local_network"]["interfaces"];
        const interfaces_ips = Object.values(interfaces);
        const ips = interfaces_ips.filter((ip) => ip !== "-");
        return ips;
      } else {
        return [];
      }
    },
    numWebServices() {
      return Object.keys(this.webServices).length;
    },
    numOnlineWebServices() {
      return Object.keys(this.webServicesStatusMapping).filter(
        (service) => this.webServicesStatusMapping[service] === "online"
      ).length;
    },
    numStatusDefinedWebServices() {
      return Object.keys(this.webServicesStatusMapping).length;
    },
    localConnectionStatus() {
      if (this.numWebServices == 0) return "unknown";
      if (this.numWebServices == this.numStatusDefinedWebServices) {
        return this.numWebServices == this.numOnlineWebServices
          ? "online"
          : "offline";
      } else {
        return "loading ";
      }
    },
  },
  watch: {
    localConnectionStatus: {
      deep: true,
      handler: function (newStatus, oldStatus) {
        if (newStatus != oldStatus)
          this.$emit("localConnectionStatusUpdated", newStatus);
      },
    },
  },
  methods: {
    onServiceStatusUpdated(info) {
      const servicePort = info.port;
      const serviceStatus = info.status;
      this.$set(this.webServicesStatusMapping, servicePort, serviceStatus);
    },
  },
};
</script>