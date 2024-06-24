import { firestoreAction } from "vuexfire";
import { db } from "../../main";

const state = {
	id: null,
	fields: null,
	services: [],
};

const mutations = {
	/** Set the id of the device in the store. */
	SET_DEVICE_ID: (state, deviceId) => {
		state.id = deviceId;
	},
	/** Clear the id of the device in the store. */
	CLEAR_DEVICE_ID: (state) => {
		state.id = null;
	},
};

const actions = {
	/** Set the id of the device in the store */
	setDeviceId(context, deviceId) {
		context.commit("SET_DEVICE_ID", deviceId);
	},
	/** Bind the fields of the device to devices in the state. */
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
	/** Bind the services of the device to services in the state. */
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
	/** Install a service given the service id, version and envs. */
	installService: firestoreAction((context, { id, version, envs }) => {
		const userId = context.rootState.user.id;
		db.collection("users")
			.doc(userId)
			.collection("devices")
			.doc(context.state.id)
			.collection("installed_services")
			.doc(id)
			.set({ version, envs });
	}),
	/** Uninstall a service given the service id. */
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
	/** Update a service envs given the service id, version and envs. */
	saveEnvs: firestoreAction((context, { id, version, envs }) => {
		const userId = context.rootState.user.id;
		db.collection("users")
			.doc(userId)
			.collection("devices")
			.doc(context.state.id)
			.collection("installed_services")
			.doc(id)
			.set({ version, envs });
	}),
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
