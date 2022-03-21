import { firestoreAction } from 'vuexfire';
import { db } from '../../main';
import strftime from "strftime";

const namespaced = true

const state = {
    id: null,
    name: null,
    email: null,
    refreshToken: null,
    devices: []
}

const mutations = {
    SET_USER_DATA: (state, payload) => {
        state.id = payload.id;
        state.name = payload.name;
        state.email = payload.email;
        state.refreshToken = payload.refreshToken;
    },
    CLEAR_USER_DATA: (state) => {
        state.id = null;
        state.name = null;
        state.email = null;
        state.refreshToken = null;
    }
}

const actions = {
    setUserData(context, userData) {
        context.commit('SET_USER_DATA', userData);
    },
    clearUserData(context) {
        context.commit('CLEAR_USER_DATA');
    },
    bindDevicesRef: firestoreAction(context => {
        return context.bindFirestoreRef("devices", db.collection('users').doc(context.state.id).collection("devices"));
    }),
    addDevice: firestoreAction((context, deviceId) => {
        db.collection("users").doc(context.state.id).collection("devices").doc(deviceId).set({
            creation_date: strftime("%Y-%m-%dT%H:%M:%S"),
            last_connection: 0,
            parameters: {},
            tunnels: {}
        });
    }),
    deleteDevice: firestoreAction((context, deviceId) => {
        db.collection("users").doc(context.state.id).collection("devices").doc(deviceId).delete();
    }),
    addDeviceConfiguration: firestoreAction((context, configuration) => {
        const configDate = configuration.config_date;
        const deviceId = configuration.remote_configurator.device_id;
        var deviceObject = context.state.devices.find(e => e.id == deviceId);
        deviceObject["parameters"][configDate] = configuration;
        db.collection("users").doc(context.state.id).collection("devices").doc(deviceId).update(deviceObject);
    }),
    deleteDeviceConfiguration: firestoreAction((context, configuration) => {
        const configDate = configuration.config_date;
        const deviceId = configuration.remote_configurator.device_id;
        var deviceObject = context.state.devices.find(e => e.id == deviceId);
        delete deviceObject["parameters"][configDate];
        db.collection("users").doc(context.state.id).collection("devices").doc(deviceId).update(deviceObject);
    }),
    deleteUserData: firestoreAction(async (context) => {
        const devices = await db.collection('users').doc(context.state.id).collection("devices").get();
        devices.forEach(device => {
            db.collection("users").doc(context.state.id).collection("devices").doc(device.id).delete();
        });
        db.collection("users").doc(context.state.id).delete();
    }),
    addDeviceTunnel: firestoreAction((context, { deviceId, tunnelPort, tunnelConfig }) => {
        var deviceObject = context.state.devices.find(e => e.id == deviceId);
        deviceObject["tunnels"][tunnelPort] = tunnelConfig;
        db.collection("users").doc(context.state.id).collection("devices").doc(deviceId).update(deviceObject);
    }),
    deleteDeviceTunnel: firestoreAction((context, { deviceId, tunnelPort }) => {
        var deviceObject = context.state.devices.find(e => e.id == deviceId);
        delete deviceObject["tunnels"][tunnelPort];
        db.collection("users").doc(context.state.id).collection("devices").doc(deviceId).update(deviceObject);
    })
}

const getters = {}

export default {
    namespaced,
    state,
    mutations,
    actions,
    getters
}