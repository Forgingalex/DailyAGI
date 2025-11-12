const hre = require("hardhat");

async function main() {
  // Deploy SENT token first (or use existing address)
  const SENT_TOKEN_ADDRESS = process.env.SENT_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000";
  
  console.log("Deploying SENT Staking Contract...");
  
  const SENTStaking = await hre.ethers.getContractFactory("SENTStaking");
  const staking = await SENTStaking.deploy(SENT_TOKEN_ADDRESS);
  
  await staking.waitForDeployment();
  
  const address = await staking.getAddress();
  console.log("SENT Staking deployed to:", address);
  
  // Verify on Etherscan (if configured)
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await staking.deploymentTransaction().wait(5);
    
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [SENT_TOKEN_ADDRESS],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


