const $$ = document;
let random = parseInt(Math.random() * 100000000);
let IP = {
    get: (url, type) => fetch(url, { method: 'GET' })
        .then((resp) => {
            if (type === 'text')
                return Promise.all([resp.ok, resp.status, resp.text(), resp.headers]);
            else {
                return Promise.all([resp.ok, resp.status, resp.json(), resp.headers]);
            }
        })
        .then(([ok, status, data, headers]) => {
            if (ok) {
                let json = { ok, status, data, headers }
                return json;
            } else {
                throw new Error(JSON.stringify(json.error));
            }
        }).catch(error => {
            throw error;
        }),
    getJsonp: (url) => {
        var script = document.createElement('script');
        script.src = url
        document.head.appendChild(script);
    },
    parseIPInfoip: (ip, elID) => {
        IP.get(`https://ipinfo.io/${ip}?token=7d28bdc28f9dbc`, 'json')
            .then(resp => {
                $$.getElementById(elID).innerHTML = `${resp.data.country} ${resp.data.region} ${resp.data.city}<br> ${resp.data.org}`;
            })
    },
    parseIPIpapi: (ip, elID) => {
        IP.get(`https://ipapi.co/${ip}/json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById(elID).innerHTML = `${resp.data.country_name} ${resp.data.city}<br>${resp.data.org}`;
            })
    },
    getWebrtcIP: function() {
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
        var webrtc = new RTCPeerConnection({ iceServers: []}), i = function() {};
        webrtc.createDataChannel(""),
        webrtc.createOffer(webrtc.setLocalDescription.bind(webrtc), i),
        webrtc.onicecandidate = function(con) {
            try {
                if (con && con.candidate && con.candidate.candidate) {
                    var webctrip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
                        .exec(con.candidate.candidate)[1];
                    $$.getElementById("ip-webrtc").innerHTML = webctrip,
                    webrtc.onicecandidate = i;
                    $$.getElementById("ip-webrtc-geo").innerHTML = "WebRTC Leaked IP"
                } else {
                    $$.getElementById("ip-webrtc").innerHTML = "N/A";
                }
            } catch {
                $$.getElementById("ip-webrtc").innerHTML = "N/A";
            }
        }
    },
    getIpipnetIP: function() {
        IP.get("https://forge.speedtest.cn/api/location/info?z=" + random, "json").then(function(t) {
            var e = t.data,
            n = [e.country];
            e.province === e.city ? n.push(e.province) : (n.push(e.province), n.push(e.city)),
            n.push(e.distinct),
            n.push(e.isp);
            var i = n.filter(Boolean).join(" ");
            $$.getElementById("ip-ipipnet").innerHTML = "<p>" + e.ip + '</p><p class="sk-text-small">' + i + "</p>"
        })
    },
    getIpipnetIPSimple: () => {
        IP.get(`https://myip.ipip.net/?z=${random}`, 'text')
        .then((resp) => {
            let data = resp.data.replace('当前 IP：', '').split(' 来自于：');
            $$.getElementById('ip-ipipnet').innerHTML = `${data[0]} ${data[1]}`;
        });
    },
    getSohuIP: () => {
        var script = document.createElement('script');
        script.src = 'https://pv.sohu.com/cityjson?ie=utf-8'
        script.onload = () => {
            if (typeof returnCitySN === 'undefined') {
                console.log('Failed to load resource: pv.sohu.com')
            } else {
                $$.getElementById('ip-sohu').innerHTML = returnCitySN.cip;
                IP.parseIPInfoip(returnCitySN.cip, 'ip-sohu-geo');
            }
        }
        document.head.appendChild(script);
    },
    getIpsbIP: () => {
        IP.get(`https://api.ip.sb/geoip?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipsb').innerHTML = resp.data.ip;
                $$.getElementById('ip-ipsb-geo').innerHTML = `${resp.data.country} ${resp.data.city} ${resp.data.organization}`;
            })
    },
    getIpifyIP: () => {
        IP.get(`https://api.ipify.org/?format=json&z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipify').innerHTML = resp.data.ip;
                return resp.data.ip;
            })
            .then(ip => {
                IP.parseIPInfoip(ip, 'ip-ipify-geo');
            })
            .catch(e => {
                console.log('Failed to load resource: api.ipify.org')
            })
    },
    getIpapiIP: () => {
        IP.get(`https://ipapi.co/json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipapi').innerHTML = resp.data.ip;
                IP.parseIPIpapi(resp.data.ip, 'ip-ipapi-geo');
            })
            .catch(e => {
                console.log('Failed to load resource: ipapi.co')
            })
    }
};

let HTTP = {
    checker: (domain, cbElID) => {
        let img = new Image;
        let timeout = setTimeout(() => {
            img.onerror = img.onload = null;
            img.src = '';
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-error">连接超时</span>'
        }, 6000);

        img.onerror = () => {
            clearTimeout(timeout);
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-error">无法访问</span>'
        }

        img.onload = () => {
            clearTimeout(timeout);
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-success">连接正常</span>'
        }

        img.src = `https://${domain}/favicon.ico?${+(new Date)}`
    },
    runcheck: () => {
        HTTP.checker('www.baidu.com', 'http-baidu');
        HTTP.checker('s1.music.126.net/style', 'http-163');
        HTTP.checker('www.qq.com', 'http-qq');
        HTTP.checker('www.sina.com.cn', 'http-sina');
        HTTP.checker('www.google.com', 'http-google');
        HTTP.checker('www.pinterest.com', 'http-pinterest');
        HTTP.checker('github.com', 'http-github');
        HTTP.checker('www.youtube.com', 'http-youtube');
    }
};
