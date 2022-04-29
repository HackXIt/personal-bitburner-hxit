/** @type {NS} */
let ns = null;

let workers;
let targets = ['foodnstuff', 'sigma-cosmetics', 'joesguns', 'hong-fang-tea', 'harakiri-sushi'];
let actions = ["update"];

/** Checks all machine-related information on target server
 * 
 * @param {*} target 
 * @returns Object containing relevant machine-information for worker
 */
function checkServer(target) {
    if (!ns.serverExists(target)) {
        return null;
    }
    return {
        usedRAM: ns.getServerUsedRam(target),
        maxRAM: ns.getServerMaxRam(target)
    }
}

function updateWorkerList() {
    workers = ns.getPurchasedServers();
}

function updateTargetList(targetList) {
    if (targetList != null) {
        targets = targetList;
    }
}

async function updateWorkers(file) {
    if (file == null || typeof (file) != "string") {
        ns.alert("ERROR: Filename must be provided and be of type 'string'");
        return;
    }
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
    if (ns.args.length == 1) {
        ns.alert("Please provide argument to given action: " + ns.args[0] + " <argument>")
    }
    let argument = ns.args[1]
    if (ns.args[0] == "update" && typeof (ns.args[1]) == "string") {
        updateWorkerList();
        updateWorkers(argument);
    }
    if (ns.args[0] == "check" && typeof (ns.args[1]) == "string") {
        checkServer(argument);
    }
}