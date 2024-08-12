const service_status_info_mapping = {
    started: {
        icon: "mdi-check-bold",
        color: "light-green",
        message: "The service is ready",
    },
    starting: {
        icon: "mdi-rocket-launch",
        color: "lime",
        message: "The service is being launched, wait...",
    },
    pulling: {
        icon: "mdi-cloud-arrow-down",
        color: "blue",
        message: "The service is being downloaded, wait...",
    },
    downloading: {
        icon: "mdi-file-document-refresh",
        color: "indigo",
        message: "The service info is being downloaded, wait..",
    },
    downloaded: {
        icon: "mdi-file-document-check",
        color: "indigo",
        message: "The service info is downloaded",
    },
    reconfigured: {
        icon: "mdi-file-document-check",
        color: "teal",
        message: "The service reconfiguration info is downloaded",
    },
    updated: {
        icon: "mdi-file-document-check",
        color: "amber",
        message: "The service update info is downloaded",
    },
    "to-be-installed": {
        icon: "mdi-cloud-plus",
        color: "indigo",
        message: "The service installation processes has started, wait...",
    },
    "to-be-reconfigured": {
        icon: "mdi-cloud-refresh",
        color: "teal",
        message: "The service reconfiguration process has started, wait...",
    },
    "to-be-updated": {
        icon: "mdi-cloud-arrow-up",
        color: "amber",
        message: "The service update process has started, wait...",
    },
    "to-be-uninstalled": {
        icon: "mdi-cloud-remove",
        color: "brown",
        message: "The service is being uninstalled, wait...",
    },
    "to-be-removed": {
        icon: "mdi-delete",
        color: "brown",
        message: "The service is being removed, wait...",
    },
    unknown: {
        icon: "mdi-cloud-question",
        color: "red",
        message: "The service status is unknown",
    },
}

export default service_status_info_mapping;