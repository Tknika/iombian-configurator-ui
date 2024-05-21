import { firestoreAction } from "vuexfire";
import { db } from "../../main";

const state = {
	id: null,
	fields: null,
	services: [],
};

const mutations = {
	SET_DEVICE_ID: (state, deviceId) => {
		state.id = deviceId;
	},
	CLEAR_DEVICE_ID: (state) => {
		state.id = null;
	},
};

const actions = {
	setDeviceId(context, deviceId) {
		context.commit("SET_DEVICE_ID", deviceId);
	},
	bindFieldsRef: firestoreAction((context) => {
		const userId = context.rootState.user.id;
		return context.bindFirestoreRef(
			"fields",
			db
				.collection("users")
				.doc(userId)
				.collection("devices")
				.doc(context.state.id)
		);
	}),
	bindServicesRef: firestoreAction((context) => {
		const userId = context.rootState.user.id;
		return context.bindFirestoreRef(
			"services",
			db
				.collection("users")
				.doc(userId)
				.collection("devices")
				.doc(context.state.id)
				.collection("installed_services")
		);
	}),
	installService: firestoreAction((context, { id, version, envs }) => {
		const userId = context.rootState.user.id;
		db.collection("users")
			.doc(userId)
			.collection("devices")
			.doc(context.state.id)
			.collection("installed_services")
			.doc(id)
			.set({ version, env: envs });
	}),
	uninstallService: firestoreAction((context, id) => {
		const userId = context.rootState.user.id;
		db.collection("users")
			.doc(userId)
			.collection("devices")
			.doc(context.state.id)
			.collection("installed_services")
			.doc(id)
			.delete();
	}),
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
