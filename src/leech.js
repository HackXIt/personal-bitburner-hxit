/** @type {NS} */
let ns = null;

import { checkTarget } from './util.js';

/** This script is the main executor for workers to gather money
* @param {NS} _ns
**/
export async function main(_ns) {
    ns = _ns
    let target = checkTarget(ns.args[0]);
    let moneyThresh = target.maxMoney * 0.75;
    let securityThresh = target.minSecurity + 5;
    ns.print(`MoneyThreshold: ${ns.nFormat(moneyThresh, "$0.000a")}\nSecurityThreshold: ${securityThresh}`);
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