<template>
  <v-card>
    <v-card-title>
      Network
      <v-spacer></v-spacer>
      <v-btn small class="mr-2" @click="addInterface('eth')"
        >New
        <v-icon dark class="ml-1">mdi-ethernet</v-icon>
      </v-btn>
      <v-btn small @click="addInterface('wlan')"
        >New
        <v-icon dark class="ml-1">mdi-wifi</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          v-for="(ifaceData, ifaceName, index) in sortedNetworkInterfaces"
          :key="index"
        >
          <InterfaceCard
            :ifaceName="ifaceName"
            :ifaceData="ifaceData"
            @onDeleteRequest="deleteInterface"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import InterfaceCard from "./InterfaceCard";
export default {
  name: "NetworkCard",
  components: {
    InterfaceCard,
  },
  props: {
    networkParams: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    sortedNetworkInterfaces() {
      return Object.keys(this.networkParams)
        .sort()
        .reduce((obj, key) => {
          obj[key] = this.networkParams[key];
          return obj;
        }, {});
    },
  },
  methods: {
    addInterface(type) {
      var newIfaceName = "";
      if (type.startsWith("eth")) {
        newIfaceName = `eth${this.numNamedInterfaces("eth")}`;
      } else if (type.startsWith("wlan")) {
        newIfaceName = `wlan${this.numNamedInterfaces("wlan")}`;
      }
      this.$set(this.networkParams, newIfaceName, { profile: "dhcp" });
    },
    deleteInterface(ifaceName) {
      this.$delete(this.networkParams, ifaceName);
    },
    numNamedInterfaces(name) {
      return Object.keys(this.networkParams).filter(ifaceName =>
        ifaceName.startsWith(name)
      ).length;
    },
  },
};
</script>