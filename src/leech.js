/** @type {NS} */
let ns = null;

/** Checks all hacking-related information on target server
 * 
 * @param {*} target 
 * @returns Object containing relevant hacking-information for worker
 */
function checkTarget(target) {
    if (!ns.serverExists(target)) {
        return null
    }
    ns.printf("\n\n--- Checking target %s: ---", target);
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

/** This script is the main executor for workers to gather money
* @param {NS} _ns
**/
export async function main(_ns) {
    ns = _ns
    let target = checkTarget(ns.args[0]);
    let moneyThresh = target.maxMoney * 0.75;
    let securityThresh = target.minSecurity + 5;
    ns.printf("MoneyThreshold: %.2f\nSecurityThreshold: %.3f", moneyThresh, securityThresh);
    if (!target.rooted) {
        ns.nuke(target.name);
    }
    do {
        if (target.security > securityThresh) {
            await ns.weaken(target.name);
        } else if (target.money < moneyThresh) {
            await ns.grow(target.name);
        } else {
            await ns.hack(target.name);
        }
        target = checkTarget(target.name);
    } while (true);
}