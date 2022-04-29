/** @type {NS} */
let ns = null;

let actions = ["update"]

async function updateWorkers(file) {
    if (file == null || typeof (file) != "string") {
        ns.alert("ERROR: Filename must be provided and be of type 'string'");
        return;
    }
    let workers = ns.getPurchasedServers();
    workers.forEach(worker => {
        await ns.scp(file, worker);
    });
}


/**
* @param {NS} _ns
**/
export async function main(_ns) {
    ns = _ns;
    if (ns.args.length == 0) {
        ns.alert("Script requires action. Possible actions are: " + actions);
    }
    switch (ns.args[0]) {
        case "update":
            updateWorkers(ns.args[1]);
            break;
    }
}