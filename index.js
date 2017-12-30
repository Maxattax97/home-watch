var hue = require("node-hue-api");
var HueApi = hue.HueApi;
var LightState = hue.lightState;

var api, bridge, state, groupId;
var username = "O3P2ED-DYm1QT7qdIKP-IL4hpNUbxWsrHFMXcYhC";

function main() {
    console.log("Bridge:", bridge);

    api.config()
        .then(function(result) {
            console.log("API Config:", result);
        })
        .catch(console.error)
        .done();

    api.searchForNewLights().then(function() {
        return api.groups();
    }).then(function(groups) {
        for (var item in groups) {
            if (item.name === "home-watch") {
                groupId = item.id;
                break;
            }
        }

        // Make sure all the lights are in the group.
        if (groupId) {
            return api.getGroup(groupId);
        } else {
            return api.createGroup("home-watch", []).then(function(obj) {
                return api.getGroup(obj.id);
            });
        }
    }).then(function(group) {
        console.log("Group:", group);

        var lights = [];
        return api.lights().then(function(result) {
            for (var light in result.lights) {
                lights.push(light.id);
            }

            return api.updateGroup(group.id, "home-watch", lights);
        });
    })
        .catch(console.error)
        .done();

    // Select/create a group of lights.
    api.groups().then(function (groups) {
        for (var item in groups) {
            if (item.name === "home-watch") {
                groupId = item.id;
                break;
            }
        }

        // Make sure all the lights are in the group.
        if (groupId) {

        } else {
            return api.createGroup("home-watch");
        }

    })
        .catch(console.error)
        .done();
}

hue.nupnpSearch()
    .then(function(bridges) {
        if (bridges.length > 0 && bridges.length <= 1) {
            bridge = bridges[0];
        } else if (bridges.length > 1) {
            console.error("More than 1 bridge detected:", bridges);
            process.exit(1);
        }

        api = new HueApi(bridge.ipaddress, username);
        state = LightState.create();

        main();
    })
        .catch(console.error)
        .done();

