import { firestoreAction } from "vuexfire";
import { db } from "../../main";

const state = {
	services: [],
};

const actions = {
	bindMarketplaceServicesRef: firestoreAction((context) => {
		return context.bindFirestoreRef("services", db.collectionGroup("versions"));
	}),
	unbindMarketplaceServicesRef: firestoreAction((context) => {
		return context.unbindFirestoreRef("services");
	}),
};

export default {
	namespaced: true,
	state,
	actions,
};
