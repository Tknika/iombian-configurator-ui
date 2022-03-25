<template>
  <div>
    <v-list-item :key="serviceName">
      <v-list-item-content>
        <v-list-item-title>{{ serviceName }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action
        ><v-btn icon small :href="serviceURL" target="_blank"
          ><v-icon>mdi-link</v-icon></v-btn
        >
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
export default {
  name: "LocalServiceListItem",
  props: {
    service: {
      type: Object,
      required: true,
    },
    ipList: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    serviceStatus: "",
    statusCheckerIntervalMs: 30000,
    statusCheckerTimer: null,
    serviceURL: "",
    candidateURLs: {},
  }),
  computed: {
    servicePort() {
      return this.service["port"];
    },
    serviceName() {
      if (Object.prototype.hasOwnProperty.call(this.service, "name")) {
        return this.service["name"];
      } else {
        return this.service["port"];
      }
    },
  },
  created() {
    this.serviceStatus = "unknown";
    this.checkStatus();
    this.statusCheckerTimer = setInterval(
      this.checkStatus,
      this.statusCheckerIntervalMs
    );
  },
  destroyed() {
    clearInterval(this.statusCheckerTimer);
  },
  watch: {
    candidateURLs: {
      handler: function (value) {
        if (Object.keys(value).length == this.ipList.length) {
          const availableURL = Object.keys(value).find(
            (url) => value[url] === true
          );
          if (typeof availableURL !== "undefined") {
            this.serviceURL = availableURL;
            this.serviceStatus = "online";
          } else {
            this.serviceStatus = "offline";
          }
        }
      },
    },
    serviceStatus: {
      deep: true,
      handler: function (newStatus, oldStatus) {
        if (newStatus != oldStatus) {
          this.$emit("serviceStatusUpdated", {
            status: newStatus,
            port: this.servicePort,
            url: this.serviceURL,
          });
        }
      },
    },
  },
  methods: {
    fetchWithTimeout(url, options = {}) {
      const { timeout = 1000, ...fetchOptions } = options;

      return Promise.race([
        fetch(url, fetchOptions),
        new Promise((_, reject) => {
          setTimeout(() => {
            reject("timeout");
          }, timeout);
        }),
      ]);
    },
    checkStatus() {
      this.candidateURLs = {};
      this.ipList.forEach((ip) => {
        const url = "http://" + ip + ":" + this.servicePort;
        this.fetchWithTimeout(url, { timeout: 500, mode: "no-cors" })
          .then(() => {
            this.$set(this.candidateURLs, url, true);
          })
          .catch(() => {
            this.$set(this.candidateURLs, url, false);
          });
      });
    },
  },
};
</script>