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
    display: {
        enabled: true,
    },
    sshd: {
        enabled: true,
    },
    nodered: {
        port: 1880,
        auth: true,
    },
    mosquitto: {
        port: 1883,
        websockets: true,
        auth: true,
    },
    mqttclient: {
        port: 1888,
    },
    samba: {
        enabled: true,
    },
    wetty: {
        enabled: true,
        port: 3000
    },
    monit: {
        refresh: 10,
        port: 2812,
        alerts: {
            fs: "90% for 5 times within 15 cycles",
            system: {
                load1: 6,
                load5: 4,
                mem: "98% for 10 cycles",
                cpu: "95% for 10 cycles",
                swap: "1%",
            },
            services: {
                sshd: true,
                mosquitto: true,
                nodered: true,
                mail: true,
                avahi: true,
            },
        },
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