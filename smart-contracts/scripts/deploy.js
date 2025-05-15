const hre = require("hardhat");

async function main() {
    const MFA = await hre.ethers.getContractFactory("MFA");
    const mfa = await MFA.deploy();
    await mfa.deployed();
    console.log("MFA deployed to:", mfa.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});