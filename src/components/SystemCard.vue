<template>
  <v-card>
    <v-card-title>System</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            :value="sysParams.hostname"
            @change="(value) => (sysParams.hostname = value)"
            readonly
            hint="Can not be changed"
            persistent-hint
            label="Hostname"
            prepend-icon="mdi-identifier"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="sysParams.country"
            :items="countryOptions"
            label="Country"
            prepend-icon="mdi-flag-variant"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="sysParams.timezone"
            :items="timezoneOptions"
            label="Timezone"
            prepend-icon="mdi-map-clock"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="sysParams.lang"
            :items="languageOptions"
            label="Language"
            prepend-icon="mdi-web"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SystemCard",
  props: {
    deviceId: {
      type: String,
      required: true
    },
    sysParams: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    countryOptions: ["ES", "US", "GB", "FR", "IT", "DE"],
    timezoneOptions: ["Europe/Madrid"],
    languageOptions: [
      "es_ES.UTF-8",
      "en_US.UTF-8",
      "en_UK.UTF-8",
      "fr_fr.UTF-8",
      "it_IT.UTF-8",
      "de-DE.UTF-8",
    ],
  }),
  mounted() {
    this.sysParams.hostname = this.deviceId;
  },
};
</script>