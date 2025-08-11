pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use error::*;
pub use instructions::*;
pub use state::*;

declare_id!("BGLQcC4NREAF5gJKuTZqkBNttqWmPVMzt8ukRJ5Lzs3S");


#[program]
pub mod repute_dao {
    use super::*;

    /// Initialize the DAO and set configuration parameters
    pub fn initialize_dao(
        ctx: Context<InitializeDao>,
        admin: Pubkey,
        minimum_stake: u64,
        token_mint: Pubkey,
        vote_power: u8,
    ) -> Result<()> {
        let bumps = ctx.bumps;
        ctx.accounts.initialize_dao(
            minimum_stake,
            admin,
            token_mint,
            vote_power,
            bumps,
        )
    }

    /// Initialize the treasury for token staking
    pub fn initialize_treasury(
        ctx: Context<InitializeTreasury>,
    ) -> Result<()> {
        instructions::initialize_treasury::handler(ctx)
    }

    /// Create a new user profile with a unique username
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
    ) -> Result<()> {
        let bumps = ctx.bumps;
        ctx.accounts.create_profile(username, bumps)
    }

    /// Stake tokens to gain voting rights
    pub fn stake_tokens(
        ctx: Context<StakeTokens>,
        amount: u64,
    ) -> Result<()> {
        // Validate amount
        require!(amount > 0, ReputeDaoError::InvalidStakeAmount);
		ctx.accounts.
        
        // Implement token transfer
        ctx.accounts.cpi_csl_spl_token_transfer(amount)?;
        
        // Update user profile and treasury
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.stake_amount = user_profile.stake_amount
            .checked_add(amount)
            .ok_or(ReputeDaoError::MathOverflow)?;
            
        let treasury = &mut ctx.accounts.treasury;
        treasury.total_staked = treasury.total_staked
            .checked_add(amount)
            .ok_or(ReputeDaoError::MathOverflow)?;
            
        // If this is a new staker, increment stakers count
        if user_profile.stake_amount == amount {
            treasury.stakers_count = treasury.stakers_count
                .checked_add(1)
                .ok_or(ReputeDaoError::MathOverflow)?;
        }
        
        Ok(())
    }

    /// Unstake tokens and reduce voting power
    pub fn unstake_tokens(
        ctx: Context<Unstake>,
        amount: u64,
    ) -> Result<()> {
        ctx.accounts.unstake_tokens(amount)
    }

    /// Cast an upvote for another user
    pub fn upvote(
        ctx: Context<Vote>,
        target_username: String,
    ) -> Result<()> {
        let bumps = ctx.bumps;
        ctx.accounts.upvote_user(target_username, bumps)
    }

    /// Cast a downvote for another user
    pub fn downvote(
        ctx: Context<Vote>,
        target_username: String,
    ) -> Result<()> {
        let bumps = ctx.bumps;
        ctx.accounts.downvote_user(target_username, bumps)
    }

    /// Reset a user's reputation (admin only)
    pub fn reset_user_reputation(
        ctx: Context<ResetUserReputation>,
    ) -> Result<()> {
        ctx.accounts.reset_user_reputation()
    }

}
