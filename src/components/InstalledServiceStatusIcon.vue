<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon class="ml-4" :color="serviceStatusColor" v-bind="attrs" v-on="on">
        {{ serviceStatusIcon }}
      </v-icon>
    </template>
    <span>{{ serviceStatusMessage }}</span>
  </v-tooltip>
</template>

<script>
import service_status_info_mapping from "../assets/service_status_info_mapping";

export default {
  name: "InstalledServiceStatusIcon",
  props: {
    /** The status of the service. */
    serviceStatus: {
      type: String,
      default: "unknown",
      required: true,
    },
  },
  data: () => ({
    /** Mapping about the service information. */
    statusMap: service_status_info_mapping
  }),
  computed: {
    /** The icon assigned to the status of the service. */
    serviceStatusIcon() {
      return this.statusMap[this.serviceStatus]?.icon ?? "mdi-cloud-question";
    },
    /** The color assigned to the status of the service. */
    serviceStatusColor() {
      return this.statusMap[this.serviceStatus]?.color ?? "red";
    },
    /** The message assigned to the status of the service. */
    serviceStatusMessage() {
      return this.statusMap[this.serviceStatus]?.message ?? "Unknown service status: " + this.serviceStatus;
    },
  },
  created() {},
  destroyed() {},
  methods: {},
};
</script>