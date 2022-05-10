/** @type {NS} */
let ns = null;

/**
* @param {NS} ns
**/
export async function main(_ns) {
    ns = _ns;
    ns.run("mem", 1, "worker.js");
    //
}