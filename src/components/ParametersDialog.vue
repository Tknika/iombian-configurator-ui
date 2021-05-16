<template>
  <v-dialog
    v-model="show"
    ma="4"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card v-if="render">
      <v-overlay :value="bluetoothSynchingState">
        <v-progress-circular
          :active="bluetoothSynchingState"
          :value="bluetoothSynchingValue"
          :rotate="-90"
          :size="100"
          :width="7"
          color="white"
        >
        <strong>{{ Math.round(bluetoothSynchingValue) }}%</strong>
        </v-progress-circular>
      </v-overlay>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Configuration</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn v-if="serialAvailable && !$vuetify.breakpoint.xs" dark text @click="serialSync">Sync<v-icon right>mdi-usb-port</v-icon></v-btn>
          <v-btn v-if="serialAvailable && $vuetify.breakpoint.xs" icon @click="serialSync"><v-icon>mdi-usb-port</v-icon></v-btn>
          <v-btn v-if="bluetoothAvailable && !$vuetify.breakpoint.xs" dark text @click="bluetoothSync">Sync<v-icon right>mdi-bluetooth</v-icon></v-btn>
          <v-btn v-if="bluetoothAvailable && $vuetify.breakpoint.xs" icon @click="bluetoothSync"><v-icon>mdi-bluetooth</v-icon></v-btn>
          <v-btn v-if="pushEnabled && !$vuetify.breakpoint.xs" dark text @click="push">Push<v-icon right>mdi-cloud-upload</v-icon></v-btn>
          <v-btn v-if="pushEnabled && $vuetify.breakpoint.xs" icon @click="push"><v-icon>mdi-cloud-upload</v-icon></v-btn>
          <v-btn v-if="!$vuetify.breakpoint.xs" dark text @click="download">Download<v-icon right>mdi-download</v-icon></v-btn>
          <v-btn v-if="$vuetify.breakpoint.xs" icon @click="download"><v-icon>mdi-download</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-form>
          <v-row>
            <v-col cols="12">
              <SystemCard :deviceId="deviceId" :sysParams="parameters.system" />
            </v-col>
            <v-col cols="12">
              <UserCard :userParams="parameters.user" />
            </v-col>
            <v-col cols="12">
              <NetworkCard :networkParams="parameters.networking" />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-snackbar v-model="snackbarState" timeout="4000" :color="snackbarColor"
        >{{ snackbarText }}
      </v-snackbar>
    </v-card>
  </v-dialog>
</template>

<script>
import { apiKey, projectId } from "../main";
import default_parameters from "../assets/default_parameters";
import SystemCard from "./SystemCard";
import UserCard from "./UserCard";
import NetworkCard from "./NetworkCard";
import yamlHandler from "js-yaml";
import fileSaver from "file-saver";
import strftime from "strftime";

export default {
  name: "ParametersDialog",
  components: {
    SystemCard,
    UserCard,
    NetworkCard,
  },
  data: () => ({
    show: false,
    render: false,
    deviceId: null,
    parameters: {},
    pushEnabled: false,
    bluetoothAvailable: false,
    bluetoothSynchingState: false,
    bluetoothSynchingValue: 0,
    serialAvailable: false,
    snackbarState: false,
    snackbarText: "",
    snackbarColor: "success",
  }),
  watch: {
    show: function (val) {
      val
        ? (this.render = true)
        : setTimeout(() => {
            this.render = false;
          }, 350);
    },
  },
  methods: {
    setConfigDate() {
      const config_date = {
        config_date: strftime("%Y-%m-%dT%H:%M:%S"),
      };
      Object.assign(this.parameters, config_date);
    },
    open(deviceId, parameters, pushEnabled=false) {
      this.show = true;
      this.deviceId = deviceId;
      this.pushEnabled = pushEnabled;
      this.parameters = parameters
        ? JSON.parse(JSON.stringify(parameters))
        : JSON.parse(JSON.stringify(default_parameters));
      const remote_configurator = {
        remote_configurator: {
          device_id: this.deviceId,
          api_key: apiKey,
          project_id: projectId,
          refresh_token: this.$store.state.user.refreshToken,
        },
      };
      Object.assign(this.parameters, remote_configurator);
      this.bluetoothAvailable = "bluetooth" in navigator;
      this.serialAvailable = "serial" in navigator;
    },
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
        return new Promise(resolve => setTimeout(() => resolve(), duration));
      }

      this.setConfigDate();

      try {
        const device = await navigator.bluetooth.requestDevice({
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

        const writeSteps = Object.keys(this.parameters).length;
        await length_characteristic.writeValueWithResponse(
          new TextEncoder().encode(writeSteps)
        );

        var values_characteristic = await service.getCharacteristic(
          "0000ec0f-0000-1000-8000-00805f9b34fb"
        );

        var writtenStep = 0;

        for (const category in this.parameters) {
          var params = new TextEncoder().encode(
            JSON.stringify({ [category]: this.parameters[category] })
          );

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
            console.log(error);
            this.showSnackbar(
              "Configuration synchronization failed (try again)",
              "error"
            );
        }
        this.bluetoothSynchingState = false;
        this.bluetoothSynchingValue = 0;
      }
    },
    async serialSync() {
      const raspberryPi4filter = { usbVendorId: 0x0525, usbProductId: 0xa4a7 }

      this.setConfigDate();

      try {
        const port = await navigator.serial.requestPort({ filters: [raspberryPi4filter] });
        await port.open({ baudRate: 115200 });

        const writer = port.writable.getWriter();

        const encoded_parameters = new TextEncoder().encode(JSON.stringify(this.parameters));

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
            this.showSnackbar(
              "Failed to open serial port",
              "error"
            );
            console.log("Failed to open serial port");
            break;
          default:
            console.log(error);
        }
      }
    }
  },
};
</script>