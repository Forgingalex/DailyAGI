// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SENT Staking Contract
 * @notice ERC-20 staking contract for DAILYAGI premium features
 * @dev Users stake 0.01 SENT tokens per month for premium access
 */
contract SENTStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public sentToken;
    
    uint256 public constant MONTHLY_STAKE_AMOUNT = 0.01 ether; // 0.01 SENT
    uint256 public constant STAKING_DURATION = 30 days;
    
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 unlockTime;
        bool active;
    }
    
    mapping(address => Stake) public stakes;
    mapping(address => bool) public premiumUsers;
    
    event Staked(address indexed user, uint256 amount, uint256 unlockTime);
    event Unstaked(address indexed user, uint256 amount);
    event PremiumActivated(address indexed user);
    event PremiumDeactivated(address indexed user);
    
    constructor(address _sentToken) Ownable(msg.sender) {
        require(_sentToken != address(0), "Invalid token address");
        sentToken = IERC20(_sentToken);
    }
    
    /**
     * @notice Stake SENT tokens for premium access
     * @dev Requires approval of SENT tokens before staking
     */
    function stake() external nonReentrant {
        require(sentToken.balanceOf(msg.sender) >= MONTHLY_STAKE_AMOUNT, "Insufficient balance");
        require(!stakes[msg.sender].active, "Already staked");
        
        sentToken.safeTransferFrom(msg.sender, address(this), MONTHLY_STAKE_AMOUNT);
        
        uint256 unlockTime = block.timestamp + STAKING_DURATION;
        stakes[msg.sender] = Stake({
            amount: MONTHLY_STAKE_AMOUNT,
            startTime: block.timestamp,
            unlockTime: unlockTime,
            active: true
        });
        
        premiumUsers[msg.sender] = true;
        
        emit Staked(msg.sender, MONTHLY_STAKE_AMOUNT, unlockTime);
        emit PremiumActivated(msg.sender);
    }
    
    /**
     * @notice Unstake SENT tokens after lock period
     */
    function unstake() external nonReentrant {
        Stake memory userStake = stakes[msg.sender];
        require(userStake.active, "No active stake");
        require(block.timestamp >= userStake.unlockTime, "Still locked");
        
        uint256 amount = userStake.amount;
        delete stakes[msg.sender];
        premiumUsers[msg.sender] = false;
        
        sentToken.safeTransfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
        emit PremiumDeactivated(msg.sender);
    }
    
    /**
     * @notice Renew premium by staking again (must unstake first)
     */
    function renewPremium() external {
        if (stakes[msg.sender].active && block.timestamp >= stakes[msg.sender].unlockTime) {
            unstake();
        }
        stake();
    }
    
    /**
     * @notice Check if user has premium access
     */
    function hasPremium(address user) external view returns (bool) {
        Stake memory userStake = stakes[user];
        return userStake.active && 
               block.timestamp < userStake.unlockTime && 
               premiumUsers[user];
    }
    
    /**
     * @notice Get stake information for a user
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 unlockTime,
        bool active,
        bool hasPremium
    ) {
        Stake memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.unlockTime,
            userStake.active,
            premiumUsers[user] && userStake.active && block.timestamp < userStake.unlockTime
        );
    }
    
    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = sentToken.balanceOf(address(this));
        sentToken.safeTransfer(owner(), balance);
    }
}


