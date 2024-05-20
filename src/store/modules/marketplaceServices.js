import { firestoreAction } from "vuexfire";
import { db } from "../../main";

const state = {
	services: {},
};

const mutations = {
	DELETE_SERVICE: (state, serviceId) => {
		delete state.services[serviceId];
	},
};

const actions = {
	bindServicesRef: firestoreAction((context, { serviceId, version }) => {
		return context.bindFirestoreRef(
			`services.${serviceId}`,
			db
				.collection("services")
				.doc(serviceId)
				.collection("versions")
				.doc(version)
		);
	}),
	unbindServicesRef: firestoreAction((context, serviceId) => {
		return context.unbindFirestoreRef(`services.${serviceId}`);
	}),
	removeServiceFromServices({ commit }, serviceId) {
		commit("DELETE_SERVICE", serviceId);
	},
};

export default {
	namespaced: true,
	state,
	actions,
	mutations,
};
