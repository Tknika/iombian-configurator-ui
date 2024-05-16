import { firestoreAction } from "vuexfire";
import { db } from "../../main";

const state = {
	services: null,
};

const actions = {
	bindServicesRef: firestoreAction((context, {deviceId, version}) => {
		console.log("Bind")
		console.log(deviceId)
		console.log(version)
		return context.bindFirestoreRef(
			`services.${deviceId}`,
			db
				.collection("services")
				.doc(deviceId)
				.collection("versions")
				.doc(version)
		);
	}),
};

export default {
	namespaced: true,
	state,
	actions,
};
