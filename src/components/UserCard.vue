<template>
  <v-card>
    <v-card-title>User</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="userParams.name"
            label="User"
            prepend-icon="mdi-account"
            readonly
            hint="Can not be changed"
            persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="userParams.password"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showUserPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showUserPassword ? 'text' : 'password'"
            @click:append="showUserPassword = !showUserPassword"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    userParams: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
      showUserPassword: false
  }),
};
</script>