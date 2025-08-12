# ReputeDAO

**A decentralized reputation scoreboard system built on Solana**

ReputeDAO is a blockchain-based reputation management system that allows communities to track and reward member contributions through peer voting. Built with Anchor framework on Solana, it provides token-gated voting, leaderboard system, role-based permissions, and comprehensive reputation tracking.


## 🌟 Features

### **Core Functionality**
- **👤 User Profiles** - Create unique username-based profiles(Similar to Domain names)
- **💰 Token Staking** - Stake SPL tokens to gain voting rights
- **🗳️ Peer Voting** - Upvote/downvote community members with cooldown protection
- **🏆 Reputation Tracking** - Comprehensive scoring and leaderboard system
- **🎭 Role Progression** - Unlock privileges as reputation grows
- **🔄 Admin Controls** - Reset capabilities and system management

### **Security Features**
- **🛡️ Token-Gated Access** - Minimum stake requirements prevent spam
- **⏰ Cooldown System** - Role-based voting frequency limits
- **🚫 Anti-Abuse** - Self-vote prevention and sybil resistance
- **🔐 Admin Authority** - Secure administrative functions

### **Role System**
| Role | Reputation | Voting Power | Cooldown | Permissions |
|------|------------|--------------|----------|-------------|
| **Member** | 0-50 | 1x | 24h | Upvote only |
| **Bronze** | 51-100 | 1x | 24h | Can downvote |
| **Contributor** | 101-200 | 2x | 18h | Enhanced voting |
| **Guardian** | 201-400 | 2x | 12h | Moderator privileges |
| **Leader** | 400+ | 3x | No cooldown | Maximum influence |

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlphaR2/ReputeDao.git
   cd repute-dao
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the program**
   ```bash
   anchor build
   ```

4. **Run tests**
   ```bash
   anchor test
   ```

### Deployment

1. **Configure Solana CLI**
   ```bash
   solana config set --url https://api.devnet.solana.com
   solana-keygen new  # If you don't have a keypair
   ```

2. **Deploy to Devnet**
   ```bash
   anchor deploy --provider.cluster devnet
   ```

3. **Initialize the DAO**
   ```bash
   # Update the program ID in Anchor.toml and lib.rs
   anchor test --skip-local-validator
   ```

## 📖 Usage Guide

### **1. Initialize DAO Configuration**
```rust
// Set up the DAO with admin, token mint, and voting parameters
pub fn init_dao(
    ctx: Context<InitializeDaoProgram>,
    admin: Pubkey,           // Admin wallet address
    minimum_stake: u64,      // Minimum tokens required to vote
    token_mint: Pubkey,      // SPL token mint for governance
    vote_power: u8,          // Vote weight multiplier (1-20)
) -> Result<()>
```

### **2. Initialize Treasury**
```rust
// Create the token treasury for staking
pub fn initialize_treasury(ctx: Context<InitializeTreasury>) -> Result<()>
```

### **3. Create User Profile**
```rust
// Users create profiles with unique usernames
pub fn create_profile(
    ctx: Context<CreateProfile>,
    username: String,        // Unique username (3-31 chars)
) -> Result<()>
```

### **4. Stake Tokens**
```rust
// Stake tokens to gain voting rights
pub fn stake_tokens(
    ctx: Context<Stake>,
    amount: u64,            // Amount to stake (must meet minimum)
) -> Result<()>
```

### **5. Vote on Users**
```rust
// Upvote valuable community members
pub fn upvote(
    ctx: Context<Vote>,
    target_username: String, // Username to upvote
) -> Result<()>

// Downvote (requires Bronze+ role)
pub fn downvote(
    ctx: Context<Vote>,
    target_username: String, // Username to downvote
) -> Result<()>
```

### **6. Unstake Tokens**
```rust
// Withdraw staked tokens (reduces voting power)
pub fn unstake_tokens(
    ctx: Context<Unstake>,
    amount: u64,            // Amount to unstake
) -> Result<()>
```

### **7. Admin Functions**
```rust
// Reset user reputation (admin only)
pub fn reset_user_reputation(ctx: Context<ResetUserReputation>) -> Result<()>
```

## 🏗️ Architecture

### **Account Types**

#### **Global Accounts**
- **Config** - DAO settings (admin, token mint, vote power, etc.)
- **Treasury** - Token vault state (total staked, staker count)

#### **User Accounts**
- **UserProfile** - Individual reputation data and stats
- **UsernameRegistry** - Unique username management
- **VoteCooldown** - Prevents spam voting
- **VoteRecord** - Tracks individual votes for transparency


## 🧪 Testing
The project includes comprehensive tests covering all functionality:

```bash
# Run all tests with detailed logging
anchor test

# Run tests without rebuilding
anchor test --skip-build
```

### **Test Coverage**
- ✅ DAO initialization and configuration
- ✅ Treasury setup with token accounts
- ✅ User profile creation and validation
- ✅ Token staking and unstaking operations
- ✅ Voting system with role permissions
- ✅ Anti-abuse mechanisms (cooldowns, self-vote prevention)
- ✅ Admin functions and authorization
- ✅ Error handling and edge cases


### **Customizable Parameters**
- **Minimum Stake** - Required tokens to participate
- **Vote Power** - Reputation points multiplier (1-20)
- **Role Thresholds** - Reputation levels for role progression
- **Cooldown Periods** - Time between votes per role
