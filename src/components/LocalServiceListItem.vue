<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{ serviceName }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action
        ><v-btn icon small :href="serviceURL" target="_blank"
          ><v-icon>mdi-link</v-icon></v-btn
        >
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
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
    remoteConnectionStatus: {
      type: String,
      required: false,
      default: "online",
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
    remoteConnectionStatus: {
      handler: function (newStatus) {
        if (newStatus == "online") setTimeout(this.checkStatus, 1000);
        else if (newStatus != "online") setTimeout(this.checkStatus, 3000);
      },
    },
  },
  methods: {
    fetchWithTimeout(url, options = {}) {
      const { timeout = 1000, ...fetchOptions } = options;

      return Promise.race([
        fetch(url, fetchOptions).catch(() => {
          return;
        }),
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
        // Ugly workaround. Modern browsers do not load HTTP resources if the webpage is served
        // over HTTPS, so an HTTPS url must be used to check if the service is available.
        const https_url = "https://" + ip + ":" + this.servicePort;
        const http_url = "http://" + ip + ":" + this.servicePort;
        this.fetchWithTimeout(https_url, { timeout: 500, mode: "no-cors" })
          .then(() => {
            this.$set(this.candidateURLs, http_url, true);
          })
          .catch(() => {
            this.$set(this.candidateURLs, http_url, false);
          });
      });
    },
  },
};
</script>