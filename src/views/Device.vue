<template>
  <div>
    <v-overlay :value="bluetoothSynchingState">
      <v-progress-circular :active="bluetoothSynchingState" :value="bluetoothSynchingValue" :rotate="-90" :size="100"
        :width="7" color="white">
        <strong>{{ Math.round(bluetoothSynchingValue) }}%</strong>
      </v-progress-circular>
    </v-overlay>

    <v-container style="position: relative">
      <div style="position: absolute; top: 0rem; right: 0rem;">
        <div style="position: fixed; z-index: 5; transform: translate(-100%, 0%);">
          <v-toolbar color="grey lighten-4" floating rounded class="ma-6 right-0">
            <v-toolbar-items>
              <v-btn v-if="serialAvailable && !$vuetify.breakpoint.xs" text @click="serialSync">Sync<v-icon
                  right>mdi-usb-port</v-icon></v-btn>
              <v-btn v-if="serialAvailable && $vuetify.breakpoint.xs" icon
                @click="serialSync"><v-icon>mdi-usb-port</v-icon></v-btn>
              <v-btn v-if="bluetoothAvailable && !$vuetify.breakpoint.xs" text @click="bluetoothSync">Sync<v-icon
                  right>mdi-bluetooth</v-icon></v-btn>
              <v-btn v-if="bluetoothAvailable && $vuetify.breakpoint.xs" icon
                @click="bluetoothSync"><v-icon>mdi-bluetooth</v-icon></v-btn>
              <v-btn v-if="pushEnabled && !$vuetify.breakpoint.xs" text @click="push">Push<v-icon
                  right>mdi-cloud-upload</v-icon></v-btn>
              <v-btn v-if="pushEnabled && $vuetify.breakpoint.xs" icon
                @click="push"><v-icon>mdi-cloud-upload</v-icon></v-btn>
              <v-btn v-if="!$vuetify.breakpoint.xs" text @click="download">Download<v-icon
                  right>mdi-download</v-icon></v-btn>
              <v-btn v-if="$vuetify.breakpoint.xs" icon @click="download"><v-icon>mdi-download</v-icon></v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </div>
      </div>

      <v-form>
        <v-row>
          <v-col cols="12">
            <SystemCard v-if="'system' in parameters" :deviceId="deviceId" :sysParams="parameters.system" />
          </v-col>
          <v-col cols="12">
            <UserCard v-if="'user' in parameters" :userParams="parameters.user" />
          </v-col>
          <v-col cols="12">
            <NetworkCard v-if="'networking' in parameters" :networkParams="parameters.networking" />
          </v-col>
          <v-col cols="12">
            <InstalledServicesCard :services="installedServices" />
          </v-col>
          <v-col cols="12">
            <MoreServicesCard :services="notInstalledServices" />
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <v-snackbar v-model="snackbarState" timeout="4000" :color="snackbarColor">{{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import { apiKey, projectId } from "../main";
import default_parameters from "../assets/default_parameters";
import SystemCard from "../components/SystemCard.vue";
import UserCard from "../components/UserCard.vue";
import NetworkCard from "../components/NetworkCard.vue";
import yamlHandler from "js-yaml";
import fileSaver from "file-saver";
import strftime from "strftime";
import * as fflate from "fflate";
import InstalledServicesCard from "../components/InstalledServicesCard.vue"
import MoreServicesCard from "../components/MoreServicesCard.vue"
import semver from "semver"

export default {
  name: "DevicView",
  components: {
    SystemCard,
    UserCard,
    NetworkCard,
    InstalledServicesCard,
    MoreServicesCard
  },
  data: () => ({
    deviceId: null,
    pushEnabled: true,
    // bluetoothAvailable: false,
    bluetoothSynchingState: false,
    bluetoothSynchingValue: 0,
    // serialAvailable: false,
    snackbarState: false,
    snackbarText: "",
    snackbarColor: "success",
  }),
  created() {
    this.$store.dispatch("marketplaceServices/bindMarketplaceServicesRef");
    this.deviceId = this.$route.params.id;
    this.$store.dispatch("deviceServices/setDeviceId", this.deviceId)
    this.$store.dispatch("deviceServices/bindFieldsRef");
    this.$store.dispatch("deviceServices/bindServicesRef");
    this.setConfigDate();
  },
  computed: {
    /** Parameters of the device in firestore */
    parameters() {
      const params = this.$store.state.deviceServices.fields?.parameters;
      if (!params) return {};
      const firstDate = Object.keys(params)[0]
      return params[firstDate];
    },
    /** Installed services of the device */
    installedServices() {
      return this.$store.state.deviceServices.services.map(({ id, version }) => (
        this.$store.state.marketplaceServices.services.find(
          (service) => (service.labels.version == version && service.labels.id == id))
      )).map(({ labels }) => labels)
    },
    /** The rest of the services that are not installed */
    notInstalledServices() {
      let allServices = this.$store.state.marketplaceServices.services
      const installedIds = this.installedServices.map(({ id }) => id);
      allServices = Object.groupBy(allServices, (({ labels }) => labels.id));
      delete allServices.undefined;
      installedIds.forEach((id) => delete allServices[id])
      const latestVersions = Object.values(allServices).map((versions) =>
        versions.reduce((max, current) =>
          semver.compare(current.labels.version, max.labels.version) > 0
            ? current
            : max
        ).labels
      );
      return latestVersions;
    },
    bluetoothAvailable() {
      return "bluetooth" in navigator;
    },
    serialAvailable() {
      return "serial" in navigator;
    }
  },
  methods: {
    setConfigDate() {
      const config_date = {
        config_date: strftime("%Y-%m-%dT%H:%M:%S"),
      };
      Object.assign(this.parameters, config_date);
    },
    // open(deviceId, parameters, pushEnabled = false) {
    //   this.show = true;
    //   this.deviceId = deviceId;
    //   this.pushEnabled = pushEnabled;
    //   this.parameters = parameters
    //     ? JSON.parse(JSON.stringify(parameters))
    //     : JSON.parse(JSON.stringify(default_parameters));
    //   const remote_configurator = {
    //     remote_configurator: {
    //       device_id: this.deviceId,
    //       api_key: apiKey,
    //       project_id: projectId,
    //       refresh_token: this.$store.state.user.refreshToken,
    //     },
    //   };
    //   if (this.$store.state.user.refreshToken != "") {
    //     Object.assign(this.parameters, remote_configurator);
    //   }
    //   this.bluetoothAvailable = "bluetooth" in navigator;
    //   this.serialAvailable = "serial" in navigator;
    // },
    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbarState = true;
    },
    push() {
      this.setConfigDate();
      this.$store.dispatch("user/addDeviceConfiguration", this.parameters);
      this.show = false;
    },
    download() {
      this.setConfigDate();
      const options = { lineWidth: 300 };
      const yamlString = yamlHandler.safeDump(this.parameters, options);
      var yamlBlob = new Blob([yamlString], {
        type: "text/plain;charset=utf-8",
      });
      fileSaver.saveAs(yamlBlob, "parameters.yml");
    },
    async bluetoothSync() {
      function sleepMs(duration) {
        return new Promise((resolve) => setTimeout(() => resolve(), duration));
      }

      this.setConfigDate();

      var device = null;
      try {
        device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ["0000ec00-0000-1000-8000-00805f9b34fb"] }],
        });

        this.bluetoothSynchingState = true;

        const server = await device.gatt.connect();

        const service = await server.getPrimaryService(
          "0000ec00-0000-1000-8000-00805f9b34fb"
        );

        const length_characteristic = await service.getCharacteristic(
          "0000ec0d-0000-1000-8000-00805f9b34fb"
        );

        var paramsChunks = [];
        for (const category in this.parameters) {
          const params_string = JSON.stringify({
            [category]: this.parameters[category],
          });
          const params_encoded = new TextEncoder().encode(params_string);
          const params = fflate.compressSync(params_encoded);

          if (params.length > 512) {
            for (const subcategory in this.parameters[category]) {
              const params_string = JSON.stringify({
                [category]: {
                  [subcategory]: this.parameters[category][subcategory],
                },
              });
              const params_encoded = new TextEncoder().encode(params_string);
              const params = fflate.compressSync(params_encoded);
              paramsChunks.push(params);
            }
          } else {
            paramsChunks.push(params);
          }
        }

        const writeSteps = paramsChunks.length;

        await length_characteristic.writeValueWithResponse(
          new TextEncoder().encode(writeSteps)
        );

        var values_characteristic = await service.getCharacteristic(
          "0000ec0f-0000-1000-8000-00805f9b34fb"
        );

        var writtenStep = 0;

        for (const params of paramsChunks) {
          await values_characteristic.writeValueWithResponse(params);
          writtenStep = writtenStep + 1;
          this.bluetoothSynchingValue = (writtenStep * 100) / writeSteps;
          await sleepMs(250);
        }

        await device.gatt.disconnect();

        this.bluetoothSynchingState = false;
        this.bluetoothSynchingValue = 0;
        this.showSnackbar("Configuration synchronization succeeded", "success");
        this.show = false;
      } catch (error) {
        switch (error.message) {
          case "User cancelled the requestDevice() chooser.":
            break;
          default:
            console.log(error.message);
            this.showSnackbar(
              "Configuration synchronization failed (try again)",
              "error"
            );
        }
        if (device && device.gatt.connected) {
          await device.gatt.disconnect();
        }
        this.bluetoothSynchingState = false;
        this.bluetoothSynchingValue = 0;
      }
    },
    async serialSync() {
      const raspberryPi4filter = { usbVendorId: 0x0525, usbProductId: 0xa4a7 };

      this.setConfigDate();

      try {
        const port = await navigator.serial.requestPort({
          filters: [raspberryPi4filter],
        });
        await port.open({ baudRate: 115200 });

        const writer = port.writable.getWriter();

        const encoded_parameters = new TextEncoder().encode(
          JSON.stringify(this.parameters)
        );

        await writer.write(encoded_parameters);

        writer.close();
        writer.releaseLock();
        await port.close();

        this.show = false;
      } catch (error) {
        switch (error.message) {
          case "No port selected by the user.":
            break;
          case "Failed to open serial port.":
            this.showSnackbar("Failed to open serial port", "error");
            break;
          default:
            this.showSnackbar("Configuration synchronization failed", "error");
            console.log(error.message);
        }
      }
    },
  },
};
</script>
