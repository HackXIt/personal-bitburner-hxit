/** @type {NS} */
let ns = null;

import { checkServer } from './util.js';
// Hello
let workerList = null;
let workers = {};
let actions = {
    "update": "<filename>",
    "buy": "<RAM>",
    "leech": "<target-hostname>"
};
let prefix = "hxit-";
let workerExe = "leech.js"
let workerFile = 'workerList.txt'

async function updateWorkerList() {
    await ns.write(workerFile, "", "w"); // Empty worker-file
    workerList = ns.getPurchasedServers();
    if (null == workerList) {
        ns.tprintf(`No workers available.`);
        ns.exit();
    }
    workerList.forEach(async (worker) => {
        /** @type {import('NetscriptDefinitions').Server} */
        let srv = ns.getServer(worker);
        workers[worker] = srv;
        // let data = checkServer(worker);
        // await ns.write(workerFile, `${srv.hostname} (${srv.ip}): ${srv.maxRam - srv.ramUsed} of ${srv.maxRam} RAM available.\n${srv}`, "a");
    });
}

async function updateWorkers(file) {
    if (typeof (file) != "string") {
        ns.tprintf("Action 'update' requires a filename (string).");
        ns.exit();
    } else if (!ns.fileExists(file)) {
        ns.tprintf(`'${file}' does not exist.`);
        ns.exit();
    }
    workerList.forEach(async worker => {
        await ns.scp(file, worker);
    });
}

async function purchaseWorkers(ram) {
    if (typeof (ram) != "number" || (ram % 2) != 0) {
        ns.tprint(`Action 'buy' requires a number to the power of 2`);
        ns.exit();
    }
    let limit = ns.getPurchasedServerLimit();
    let buypower = limit - workerList.length
    if (buypower == 0) {
        ns.tprintf(`Maximum amount of ${limit} servers reached.`);
        return;
    }
    let currentMoney = ns.getServerMoneyAvailable("home");
    let totalCost = ns.getPurchasedServerCost(ram) * buypower;
    if (currentMoney >= totalCost) {
        for (let i = 0; i < buypower; i++) {
            let server = ns.purchaseServer(prefix + i, ram);
            await ns.scp(workerExe, server);
            ns.tprint(`Purchased & finished setup: ${server}`)
        }
    } else {
        ns.tprint(`Not enough buypower to purchase all servers.\nRequired: ${ns.nFormat(totalCost, "$0.000a")}`);
    }
    await updateWorkerList();
}

function coordinateWorkers(target) {
    if (typeof (target) != "string") {
        ns.tprint(`Action 'leech' requires a hostname (string).`);
        ns.exit();
    } else if (!(ns.serverExists(target))) {
        ns.tprint(`Given target '${target}' does not exist.`);
        ns.exit();
    }
    let ramCost = ns.getScriptRam(workerExe);
    Object.keys(workers).forEach(worker => {
        ns.killall(worker);
        let threads = workers[worker].maxRam / ramCost;
        if (ns.exec(workerExe, worker, threads, target) == 0) {
            ns.tprint(`Execution failed on ${worker}.`);
        }
    });
}

function writeHelp() {
    ns.tprintf(`This script handles workerList. Possible actions are:\n`);
    // Possible actions are: ${actions}
    Object.keys(actions).forEach(key => {
        ns.tprintf(`${key} ${actions[key]}`);
    });
}

/**
* @param {NS} _ns
**/
export async function main(_ns) {
    ns = _ns;
    let action = null;
    let argument = null;
    if (ns.args.length == 0) {
        writeHelp();
        ns.exit();
    }
    action = ns.args[0];
    if (!(action in actions)) {
        ns.tprint(`Action '${action}' is not supported.`);
        ns.exit();
    } else if (ns.args.length == 1) {
        ns.tprintf(`Please provide argument to given action: ${action} ${actions[action]}`);
        ns.exit();
    }
    argument = ns.args[1];
    await updateWorkerList();
    switch (action) {
        case "update":
            await updateWorkers(argument);
            break;
        case "buy":
            await purchaseWorkers(argument);
            break;
        case "leech":
            coordinateWorkers(argument);
            break;
    }
}