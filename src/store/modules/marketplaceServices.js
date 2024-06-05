import { firestoreAction } from "vuexfire";
import { db } from "../../main";

const state = {
	services: [],
};

const actions = {
	/** Bind all the services of the marketplace to services in the state */
	bindMarketplaceServicesRef: firestoreAction((context) => {
		return context.bindFirestoreRef("services", db.collectionGroup("versions"));
	}),
	/** Unbind all the services of the marketplace to services in the state */
	unbindMarketplaceServicesRef: firestoreAction((context) => {
		return context.unbindFirestoreRef("services");
	}),
};

export default {
	namespaced: true,
	state,
	actions,
};
