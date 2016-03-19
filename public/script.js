var client = new Keen({
    projectId: '56ec80522fd4b1443854f4fb',
    writeKey: 'dd31af93e787bcc35fc7e1675467de0e42527481601f188745825cc872a1e06b9d030770f2de8d88be0c6964036c1dfe029f2696f1d67188028d32e256cd1e485eda6b3787bcf3a2c6292904444bdfefe6a5bccc16856165c820156d6575d31a'
});

var sessionCookie = Keen.utils.cookie('takocat-cookie');
if (!sessionCookie.get('user_id')) {
    sessionCookie.set('user_id', Keen.helpers.getUniqueId());
}

var sessionTimer = Keen.utils.timer();
sessionTimer.start();

// THE BIG DATA MODEL!

client.extendEvents(function(){
    return {
        page: {
            title: document.title,
            url: document.location.href
            // info: {} (add-on)
        },
        referrer: {
            url: document.referrer
            // info: {} (add-on)
        },
        tech: {
            browser: Keen.helpers.getBrowserProfile(),
            // info: {} (add-on)
            ip: '${keen.ip}',
            ua: '${keen.user_agent}'
        },
        time: Keen.helpers.getDatetimeIndex(),
        visitor: {
            id: sessionCookie.get('user_id'),
            time_on_page: sessionTimer.value()
        },
        // geo: {} (add-on)
        keen: {
            timestamp: new Date().toISOString(),
            addons: [
                {
                    name: 'keen:ip_to_geo',
                    input: {
                        ip: 'tech.ip'
                    },
                    output: 'geo'
                },
                {
                    name: 'keen:ua_parser',
                    input: {
                        ua_string: 'tech.ua'
                    },
                    output: 'tech.info'
                },
                {
                    name: 'keen:url_parser',
                    input: {
                        url: 'page.url'
                    },
                    output: 'page.info'
                },
                {
                    name: 'keen:referrer_parser',
                    input: {
                        page_url: 'page.url',
                        referrer_url: 'referrer.url'
                    },
                    output: 'referrer.info'
                }
            ]
        }
    };
});

client.recordEvent('pageview');
