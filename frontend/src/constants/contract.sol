// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MemoryGameWithCoins {
    enum Level { Easy, Medium, Hard }
    
    struct GameStats {
        uint256 bestTime;
        uint256 leastMoves;
        uint256 lastPlayed;
    }

    // Player => Level => Stats
    mapping(address => mapping(Level => GameStats)) public stats;
    
    // Player => Coin balance
    mapping(address => uint256) public playerCoins;
    
    // Game replay protection
    // mapping(bytes32 => bool) private completedGames;

    event GameCompleted(
        address indexed player,
        Level level,
        uint256 timeTaken,
        uint256 wrongMoves,
        uint256 pairsMatched,
        int256 coinsChange 
    );

    // constructor() {
    //     // Initialize coins for deployer (for testing)
    //     playerCoins[msg.sender] = 100;
    // }

    /**
     * @dev Initialize new player with 100 coins
     */
    function initPlayer() external {
        require(playerCoins[msg.sender] == 0, "Already initialized");
        playerCoins[msg.sender] = 100;
    }

    /**
     * @dev Records game results with coin rewards/penalties
     */
    function recordResult(
        Level level,
        uint256 timeTaken,
        uint256 wrongMoves,
        uint256 pairsMatched
    ) external {
        // Anti-cheat checks
        // require(!completedGames[gameHash], "Duplicate submission");
        require(pairsMatched == uint256(level) + 2, "Invalid pair count");
        
        // completedGames[gameHash] = true;
        int256 coinsChange = 0;

        // Calculate coin changes
        if (pairsMatched == (uint256(level) + 2)) { // Player won
            coinsChange = int256(10); // +10 coins for winning
        } else {
            coinsChange = -int256(wrongMoves * 2); // -2 coins per wrong move
        }

        // Update coin balance (prevent underflow)
        if (coinsChange > 0) {
            playerCoins[msg.sender] += uint256(coinsChange);
        } else {
            uint256 deduction = uint256(-coinsChange);
            if (deduction > playerCoins[msg.sender]) {
                playerCoins[msg.sender] = 0; // Cap at 0
            } else {
                playerCoins[msg.sender] -= deduction;
            }
        }

        // Update stats
        GameStats storage s = stats[msg.sender][level];
        if (timeTaken < s.bestTime || s.bestTime == 0) {
            s.bestTime = timeTaken;
        }
        if (wrongMoves < s.leastMoves || s.leastMoves == 0) {
            s.leastMoves = wrongMoves;
        }
        s.lastPlayed = block.timestamp;

        emit GameCompleted(
            msg.sender,
            level,
            timeTaken,
            wrongMoves,
            pairsMatched,
            coinsChange
        );
    }
}