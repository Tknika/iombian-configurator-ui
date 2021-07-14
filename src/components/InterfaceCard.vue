<template>
  <v-card>
    <v-card-title>
      {{ ifaceName }}
      <v-icon v-if="isWired()" class="ma-2">mdi-ethernet</v-icon>
      <v-icon v-if="isWireless()" class="ma-2">mdi-wifi</v-icon>
      <v-spacer></v-spacer>
      <v-btn fab x-small @click="deleteInterface">
        <v-icon dark>mdi-delete</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-select
        v-if="ifaceData.hasOwnProperty('profile')"
        label="Profile"
        :items="profileItems"
        prepend-icon="mdi-network"
        v-model="ifaceData.profile"
      ></v-select>
      <v-text-field
        v-if="ifaceData.hasOwnProperty('ip') && ifaceData.profile == 'static'"
        label="IP Address"
        v-model="ifaceData.ip"
        hint="Example: 192.168.1.2/24"
        persistent-hint
        prepend-icon="mdi-ip"
        append-outer-icon="mdi-delete"
        @click:append-outer="deleteInterfaceField('ip')"
      ></v-text-field>
      <v-text-field
        v-if="ifaceData.hasOwnProperty('gw') && ifaceData.profile == 'static'"
        label="Gateway"
        v-model="ifaceData.gw"
        prepend-icon="mdi-router-network"
        append-outer-icon="mdi-delete"
        @click:append-outer="deleteInterfaceField('gw')"
      ></v-text-field>
      <v-combobox
        v-if="ifaceData.hasOwnProperty('dns') && ifaceData.profile == 'static'"
        label="DNS"
        multiple
        small-chips
        deletable-chips
        v-model="ifaceData.dns"
        :items="dnsItems"
        :error="ifaceData.dns.length > 2"
        hide-actions
        prepend-icon="mdi-dns"
        append-outer-icon="mdi-delete"
        @click:append-outer="deleteInterfaceField('dns')"
      ></v-combobox>
    </v-card-text>
    <v-card-actions v-if="ifaceData.profile == 'static'">
      <v-btn
        rounded
        small
        v-if="!ifaceData.hasOwnProperty('ip')"
        @click="addInterfaceField('ip')"
        >+ IP</v-btn
      >
      <v-btn
        rounded
        small
        v-if="!ifaceData.hasOwnProperty('gw')"
        @click="addInterfaceField('gw')"
        >+ Gateway</v-btn
      >
      <v-btn
        rounded
        small
        v-if="!ifaceData.hasOwnProperty('dns')"
        @click="addInterfaceField('dns')"
        >+ DNS</v-btn
      >
    </v-card-actions>
    <div v-if="isWireless()">
      <v-divider class="mx-4"></v-divider>
      <v-card-subtitle>
        WiFi Credentials
        <v-btn
          rounded
          x-small
          class="ml-2"
          @click="addWirelessCredentials"
        >
          <v-icon small>mdi-plus</v-icon>
        </v-btn>
      </v-card-subtitle>
      <v-container>
        <v-row
          align="center"
          justify="center"
          v-for="(creds, credsName, index) in getWirelessCredentials()"
          :key="index"
        >
          <v-col>
            <v-text-field
              dense
              single-line
              label="SSID"
              v-model="creds.ssid"
              prepend-icon="mdi-wifi"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              dense
              single-line
              label="Password"
              :type="wirelessCredentialsVisibility[credsName] ? 'text' : 'password'"
              @change="onWirelessPasswordChange($event, creds)"
              :append-icon="wirelessCredentialsVisibility[credsName] ? 'mdi-eye-off' : 'mdi-eye'"
              append-outer-icon="mdi-delete"
              @click:append="toogleWirelessCredentialsVisibility(credsName)"
              @click:append-outer="
                deleteWirelessCredentials(credsName)
              "
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "InterfaceCard",
  props: {
    ifaceName: {
      type: String,
      required: true,
    },
    ifaceData: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    profileItems: ["static", "dhcp"],
    dnsItems: ["8.8.8.8", "8.8.4.4", "1.1.1.1"],
    wirelessCredentialsVisibility: {},
  }),
  computed: {},
  methods: {
    isWired() {
      return this.ifaceName.startsWith("eth");
    },
    isWireless() {
      return this.ifaceName.startsWith("wlan");
    },
    deleteInterface() {
      this.$emit("onDeleteRequest", this.ifaceName);
    },
    addInterfaceField(field) {
      this.$set(this.ifaceData, field, "");
    },
    deleteInterfaceField(field) {
      this.$delete(this.ifaceData, field);
    },
    getWirelessCredentials() {
      const creds = Object.keys(this.ifaceData)
        .filter((credsName) => credsName.startsWith("wlan"))
        .reduce((obj, credsName) => {
          if (!Object.prototype.hasOwnProperty.call(this.wirelessCredentialsVisibility, credsName)) {
            this.$set(this.wirelessCredentialsVisibility, credsName, false);
          }
          obj[credsName] = this.ifaceData[credsName];
          return obj;
        }, {});
      return creds;
    },
    getNumberWirelessCredentials() {
      return Object.keys(this.getWirelessCredentials()).length;
    },
    addWirelessCredentials() {
      var credsName = "wlan";
      var credsNum = this.getNumberWirelessCredentials();
      if (credsNum != 0) {
        credsName += credsNum + 1;
      }
      this.$set(this.ifaceData, credsName, {
        ssid: "",
        key_mgmt: "NONE"
      });
      this.$set(this.wirelessCredentialsVisibility, credsName, false);
    },
    deleteWirelessCredentials(credsName) {
      this.$delete(this.ifaceData, credsName);
      this.$delete(this.wirelessCredentialsVisibility, credsName);
      this.reorderWirelessCredentials();      
    },
    reorderWirelessCredentials() {
      var ifaceDataCopy = { ...this.ifaceData };
      const wirelessCredentialsNames = Object.keys(this.ifaceData).filter((credsName) => credsName.startsWith("wlan"));
      wirelessCredentialsNames.forEach(name => this.$delete(this.ifaceData, name));
      Object.keys(ifaceDataCopy).filter(credsName => credsName.startsWith("wlan"))
        .forEach((oldName, index) => {
          const newName = index>0 ? "wlan" + (index+1) : "wlan";
          this.$set(this.ifaceData, newName, ifaceDataCopy[oldName]);
        });
    },
    toogleWirelessCredentialsVisibility(credsName) {
      var new_state = !this.wirelessCredentialsVisibility[credsName];     
      this.$set(this.wirelessCredentialsVisibility, credsName, new_state);
    },
    onWirelessPasswordChange(newPassword, creds) {
      if (!newPassword) {
        this.$delete(creds, "psk");
        this.$set(creds, "key_mgmt", "NONE");
      } else {
        this.$set(creds, "psk", newPassword);
        this.$set(creds, "key_mgmt", "WPA-PSK");
      }
    },
  },
};
</script>