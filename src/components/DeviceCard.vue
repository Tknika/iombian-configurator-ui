<template>
  <v-container class="px-0">
    <v-row dense>
      <v-col cols="12">
        <ParametersDialog ref="parametersDialog" />
        <v-card>
          <v-card-title class="headline">
            {{ deviceId }}
            <RemoteConnectionStatusIcon
              :lastConnection="lastConnection"
              :remotelyConnected="remotelyConnected"
              @remoteConnectionStatusUpdated="onRemoteConnectionStatusUpdated"
            />
            <LocalConnectionStatusIcon
              :localConnectionStatus="localConnectionStatus"
            />
            <v-spacer></v-spacer>
            <v-btn
              v-if="!$vuetify.breakpoint.xs"
              small
              outlined
              text
              @click="showDeleteDeviceDialog = true"
              >Delete<v-icon dark right>mdi-delete</v-icon></v-btn
            >
            <v-btn
              v-if="$vuetify.breakpoint.xs"
              small
              outlined
              text
              @click="showDeleteDeviceDialog = true"
              ><v-icon dark>mdi-delete</v-icon></v-btn
            >
            <DeleteDeviceDialog
              :show="showDeleteDeviceDialog"
              :deviceId="deviceId"
              @closed="showDeleteDeviceDialog = false"
            />
          </v-card-title>
          <v-card-subtitle class="my-2">
            Creation date: {{ creationDate }}
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-expansion-panels accordion focusable v-model="openedPanel">
            <LocalServicesExpansionPanel
              :services="services"
              :systemInfo="systemInfo"
              :remoteConnectionStatus="remoteConnectionStatus"
              @localConnectionStatusUpdated="onLocalConnectionStatusUpdated"
            />
            <v-expansion-panel
              v-if="numTunnels != -1 && remoteConnectionStatus == 'online'"
              :readonly="numTunnels == 0"
            >
              <v-expansion-panel-header
                class="px-4"
                :hide-actions="numTunnels == 0"
              >
                <span>
                  <span class="mr-2" v-if="numTunnels > 0">
                    Tunnels: {{ numTunnels }}
                  </span>

                  <v-btn small @click="showNewTunnelDialog = true"
                    ><v-icon left>mdi-plus</v-icon>New Tunnel</v-btn
                  >
                  <NewTunnelDialog
                    :show="showNewTunnelDialog"
                    :deviceId="deviceId"
                    :services="services"
                    @closed="showNewTunnelDialog = false"
                  />
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list dense>
                  <v-fade-transition group>
                    <TunnelListItem
                      :deviceId="deviceId"
                      :tunnelConfig="tunnelConfig"
                      :tunnelPort="tunnelPort"
                      :key="index"
                      v-for="(tunnelConfig, tunnelPort, index) in tunnels"
                    />
                  </v-fade-transition>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :readonly="!numConfigurations">
              <v-expansion-panel-header
                class="px-4"
                :hide-actions="!numConfigurations"
              >
                <span>
                  <span v-if="numConfigurations"
                    >Saved configurations: {{ numConfigurations }}</span
                  >
                  <v-btn
                    v-if="!numConfigurations"
                    small
                    @click.native.stop="
                      $refs.parametersDialog.open(
                        deviceId,
                        null,
                        numConfigurations > 0
                      )
                    "
                  >
                    <v-icon left>mdi-plus</v-icon>
                    New configuration
                  </v-btn>
                  <v-btn
                    v-if="numConfigurations"
                    small
                    class="ml-2"
                    @click.native.stop="
                      $refs.parametersDialog.open(
                        deviceId,
                        lastConfiguration,
                        numConfigurations > 0
                      )
                    "
                  >
                    <v-icon left>mdi-pencil</v-icon>
                    Latest
                  </v-btn>
                </span>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-subheader v-if="numConfigurations">History</v-subheader>
                <v-list dense>
                  <v-fade-transition group>
                    <template
                      v-for="(
                        config, configDate, index
                      ) in sortedConfigurations"
                    >
                      <v-list-item :key="configDate">
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="configDate.split('T').join(' ')"
                          ></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon
                            @click="
                              $refs.parametersDialog.open(
                                deviceId,
                                config,
                                numConfigurations > 0
                              )
                            "
                            >mdi-pencil</v-icon
                          >
                        </v-list-item-action>
                        <v-list-item-action>
                          <v-icon @click="deleteDeviceConfiguration(config)"
                            >mdi-delete</v-icon
                          >
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider :key="index"></v-divider>
                    </template>
                  </v-fade-transition>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ParametersDialog from "./ParametersDialog.vue";
import NewTunnelDialog from "./NewTunnelDialog.vue";
import DeleteDeviceDialog from "./DeleteDeviceDialog.vue";
import RemoteConnectionStatusIcon from "./RemoteConnectionStatusIcon.vue";
import LocalServicesExpansionPanel from "./LocalServicesExpansionPanel.vue";
import LocalConnectionStatusIcon from "./LocalConnectionStatusIcon.vue";
import TunnelListItem from "./TunnelListItem.vue";

export default {
  name: "DeviceCard",
  props: {
    data: {
      type: Object,
    },
  },
  components: {
    ParametersDialog,
    NewTunnelDialog,
    DeleteDeviceDialog,
    RemoteConnectionStatusIcon,
    LocalServicesExpansionPanel,
    LocalConnectionStatusIcon,
    TunnelListItem,
  },
  data: () => ({
    remoteConnectionStatus: "unknown",
    showDeleteDeviceDialog: false,
    showParametersDialog: false,
    localConnectionStatus: "unknown",
    showNewTunnelDialog: false,
    openedPanel: [],
  }),
  created() {
    this.openedPanel = 0;
    setTimeout(this.closeAllPanels, 10);
  },
  computed: {
    deviceId() {
      return this.data.id;
    },
    creationDate() {
      return this.data.creation_date.split("T")[0];
    },
    lastConnection() {
      if (Object.prototype.hasOwnProperty.call(this.data, "last_connection")) {
        return this.data.last_connection;
      } else {
        return -1;
      }
    },
    sortedConfigurations() {
      return Object.keys(this.data.parameters)
        .sort()
        .reverse()
        .reduce((obj, key) => {
          obj[key] = this.data.parameters[key];
          return obj;
        }, {});
    },
    numConfigurations() {
      return Object.keys(this.data.parameters).length;
    },
    lastConfiguration() {
      const lastKey = Object.keys(this.data.parameters).sort().reverse()[0];
      return this.data.parameters[lastKey];
    },
    remotelyConnected() {
      if (Object.prototype.hasOwnProperty.call(this.data, "connected")) {
        return this.data.connected;
      } else {
        return true;
      }
    },
    numTunnels() {
      if (Object.prototype.hasOwnProperty.call(this.data, "tunnels")) {
        return Object.keys(this.data.tunnels).length;
      } else {
        return -1;
      }
    },
    services() {
      if (Object.prototype.hasOwnProperty.call(this.data, "services")) {
        return this.data["services"];
      } else {
        return {};
      }
    },
    systemInfo() {
      if (Object.prototype.hasOwnProperty.call(this.data, "system_info")) {
        return this.data["system_info"];
      } else {
        return {};
      }
    },
    tunnels() {
      if (Object.prototype.hasOwnProperty.call(this.data, "tunnels")) {
        return this.data.tunnels;
      } else {
        return [];
      }
    },
  },
  methods: {
    deleteDevice() {
      this.$store.dispatch("user/deleteDevice", this.deviceId);
    },
    deleteDeviceConfiguration(config) {
      this.$store.dispatch("user/deleteDeviceConfiguration", config);
    },
    deleteDeviceTunnel(tunnelPort) {
      this.$store.dispatch("user/deleteDeviceTunnel", {
        deviceId: this.deviceId,
        tunnelPort: tunnelPort,
      });
    },
    onRemoteConnectionStatusUpdated(remoteConnectionstatus) {
      this.remoteConnectionStatus = remoteConnectionstatus;
    },
    onLocalConnectionStatusUpdated(localConnectionStatus) {
      this.localConnectionStatus = localConnectionStatus;
    },
    closeAllPanels() {
      this.openedPanel = null;
    },
  },
  watch: {
    numTunnels: {
      deep: true,
      handler: function (newValue) {
        if (newValue == 0) this.openedPanel = null;
        if (newValue > 0) this.openedPanel = 2;
      },
    },
  },
};
</script>