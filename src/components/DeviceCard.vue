<template>
  <v-container class="px-0">
    <v-row dense>
      <v-col cols="12">
        <ParametersDialog ref="parametersDialog" />
        <v-card>
          <v-card-title class="headline">
            {{ deviceId }}
            <ConnectionStatusIcon :lastConnection="data.last_connection"/>
            <v-spacer></v-spacer>
            <v-btn v-if="!$vuetify.breakpoint.xs" small outlined text @click="showDeleteDeviceDialog=true">Delete<v-icon dark right>mdi-delete</v-icon></v-btn>
            <v-btn v-if="$vuetify.breakpoint.xs" small outlined text @click="showDeleteDeviceDialog=true"><v-icon dark>mdi-delete</v-icon></v-btn>
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
          <v-expansion-panels flat>
            <v-expansion-panel :readonly="!numConfigurations">
              <v-expansion-panel-header
                class="px-4"
                :hide-actions="!numConfigurations"
              >
                <span>
                  <span v-if="numConfigurations">Saved configurations: {{ numConfigurations }}</span>
                  <v-btn
                    v-if="!numConfigurations"
                    small
                    @click.native.stop="$refs.parametersDialog.open(deviceId, null, numConfigurations>0)"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    New configuration
                  </v-btn>
                  <v-btn
                    v-if="numConfigurations"
                    small
                    class="ml-2"
                    @click.native.stop="
                      $refs.parametersDialog.open(deviceId, lastConfiguration, numConfigurations>0)
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
                              $refs.parametersDialog.open(deviceId, config, numConfigurations>0)
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
import ParametersDialog from "./ParametersDialog";
import DeleteDeviceDialog from "./DeleteDeviceDialog";
import ConnectionStatusIcon from "./ConnectionStatusIcon";
export default {
  name: "DeviceCard",
  props: {
    data: {
      type: Object,
    },
  },
  components: {
    ParametersDialog,
    DeleteDeviceDialog,
    ConnectionStatusIcon,
  },
  data: () => ({
    showDeleteDeviceDialog: false,
    showParametersDialog: false,
  }),
  computed: {
    deviceId() {
      return this.data.id;
    },
    creationDate() {
      return this.data.creation_date.split("T")[0];
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
  },
  methods: {
    deleteDevice() {
      this.$store.dispatch("user/deleteDevice", this.deviceId);
    },
    deleteDeviceConfiguration(config) {
      this.$store.dispatch("user/deleteDeviceConfiguration", config);
    },
  },
};
</script>