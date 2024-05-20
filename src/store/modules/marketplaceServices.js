import { firestoreAction } from "vuexfire";
import { db } from "../../main";

const state = {
	services: [],
};

const actions = {
	bindServicesRef: firestoreAction((context) => {
		return context.bindFirestoreRef("services", db.collectionGroup("versions"));
	}),
	unbindServicesRef: firestoreAction((context) => {
		return context.unbindFirestoreRef("services");
	}),
};

export default {
	namespaced: true,
	state,
	actions,
};
