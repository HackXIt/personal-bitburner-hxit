/** @type {NS} */
let ns = null;

let actions = ["check"]

/** Checks all hacking-related information on target server
 * 
 * @param {*} target 
 * @returns Object containing relevant hacking-information for worker
 */
export function checkTarget(target) {
    if (!ns.serverExists(target)) {
        return null
    }
    ns.printf(`\n\n--- Checking target ${target}: ---`);
    let data = {
        name: target,
        minSecurity: ns.getServerMinSecurityLevel(target),
        security: ns.getServerSecurityLevel(target),
        // reqLevel: ns.getServerRequiredHackingLevel(target),
        // reqPorts: ns.getServerNumPortsRequired(target),
        maxMoney: ns.getServerMaxMoney(target),
        money: ns.getServerMoneyAvailable(target),
        rooted: ns.hasRootAccess(target)
    };
    return data;
}

/** Checks all machine-related information on target server
 * 
 * @param {*} target 
 * @returns Object containing relevant machine-information for worker
 */
export function checkServer(target) {
    if (!ns.serverExists(target)) {
        return null;
    }
    let data = {
        usedRAM: ns.getServerUsedRam(target),
        maxRAM: ns.getServerMaxRam(target)
    };
    return data;
}

/**
* @param {NS} _ns
**/
export async function main(_ns) {
    ns = _ns;
    if (ns.args.length == 0) {
        ns.tprintf(`Script requires action. Possible actions are: ${actions}`);
    }
    if (ns.args.length == 1) {
        ns.tprintf(`Please provide argument to given action: ${ns.args[0]} <argument>`);
    }
    let argument = ns.args[1]
    if (ns.args[0] == "check" && typeof (ns.args[1]) == "string") {
        checkServer(argument);
    }
}