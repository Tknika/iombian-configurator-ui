const service_status_info_mapping = {
    started: {
        icon: "mdi-check-bold",
        color: "green",
        message: "The service is ready",
    },
    starting: {
        icon: "mdi-rocket-launch",
        color: "orange",
        message: "The service is being launched, wait...",
    },
    pulling: {
        icon: "mdi-cloud-arrow-down",
        color: "amber",
        message: "The service is being downloaded, wait...",
    },
    downloading: {
        icon: "mdi-file-document-refresh",
        color: "blue",
        message: "The service info is being downloaded, wait..",
    },
    downloaded: {
        icon: "mdi-file-document-check",
        color: "indigo",
        message: "The service info is downloaded",
    },
    "to-be-installed": {
        icon: "mdi-cloud-plus",
        color: "grey",
        message: "The service installation processes has started, wait...",
    },
    "to-be-uninstalled": {
        icon: "mdi-cloud-remove",
        color: "brown",
        message: "The service is being uninstalled, wait...",
    },
    "to-be-removed": {
        icon: "mdi-delete",
        color: "red",
        message: "The service is being removed, wait...",
    },
    unknown: {
        icon: "mdi-cloud-question",
        color: "red",
        message: "The service status is unknown",
    },
}

export default service_status_info_mapping;