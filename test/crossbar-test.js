const JsonSerializer = require('./../dist/serializers/JsonSerializer').JsonSerializer;
const Wampy = require('./../dist/wampy').Wampy;
const wampyCra = require('wampy-cra');
const w3cws = require('websocket').w3cwebsocket;

const client = new Wampy('ws://localhost:8888/auth', {
    debug: true,
    realm: 'realm1',
    serializer: new JsonSerializer(),
    ws: w3cws,
    authid: 'joe',
    authmethods: 'jwt',
    onChallenge: (method, info) => {
        console.log('Requested challenge with ', method, info);
        return wampyCra.sign('secret2', info.challenge);
    },
    onConnect: () => {
        console.log('Connected to router!');
        client.register('sayhello', {
            rpc: () => {
                return { argsList: 'hello' };
            },
            onSuccess: () => {
                console.log('Registered RPC!');
            }
        });
    },
    onError: (e) => {
        console.log('Error!', e);
    }
});

console.log(client.getOpStatus());
