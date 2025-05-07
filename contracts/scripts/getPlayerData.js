const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

    const [deployer] = await ethers.getSigners(); 
    const contract = await ethers.getContractAt("MemoryGameWithCoins", contractAddress, deployer);

    const playerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; 

   
    const playerCoins = await contract.playerCoins(playerAddress);
    console.log("Player's coin balance:", playerCoins.toString());

  
    const level = 0;
    const playerStats = await contract.stats(playerAddress, level);

  
    console.log("Player's stats for level", level === 0 ? "Easy" : level === 1 ? "Medium" : "Hard");
    console.log("Best Time:", playerStats.bestTime.toString());
    console.log("Least Moves:", playerStats.leastMoves.toString());
    console.log(
        "Last Played:",
        playerStats.lastPlayed > 0
          ? new Date(Number(playerStats.lastPlayed) * 1000).toLocaleString()
          : "Never played"
      );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
