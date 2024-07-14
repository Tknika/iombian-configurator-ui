const parameters = {
    system: {
        country: "ES",
        hostname: "iombian",
        lang: "es_ES.UTF-8",
        timezone: "Europe/Madrid",
        forceipv4: true,
        domain: "local",
    },
    user: {
        name: "iompi",
        password: "iompi",
    },
    networking: {
        eth0: {
            profile: "dhcp",
        },
        wlan0: {
            profile: "dhcp"
        },
    },
    sshd: {
        enabled: true,
    },
    avahi: {
        ifaces: "wlan0",
        publish: true,
        browserdomains: [],
        publishdns: ["8.8.8.8"],
    },
    config_date: ''
}


export default parameters;
