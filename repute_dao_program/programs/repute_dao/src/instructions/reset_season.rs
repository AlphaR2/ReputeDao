use crate::*;
use crate::error::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ResetUserReputation<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    /// Verify admin authority
    #[account(
        seeds = [CONFIG, admin.key().as_ref()],
        bump,
        has_one = admin @ ReputeDaoError::UnauthorizedAdmin
    )]
    pub config: Account<'info, Config>,

    /// User profile to reset
    #[account(mut)]
    pub user_profile: Account<'info, UserProfile>,
}

impl<'info> ResetUserReputation<'info> {
    pub fn reset_user_reputation(&mut self) -> Result<()> {
        require!(!self.config.is_paused, ReputeDaoError::SystemPaused);

        let user_profile = &mut self.user_profile;
        
        // Reset only reputation-related fields
        user_profile.reputation_points = 0;
        user_profile.upvotes_received = 0;
        user_profile.downvotes_received = 0;
        user_profile.role_level = MemberRanks::Member;

        msg!("Reset reputation for user: {} ({})", 
             user_profile.username, 
             user_profile.owner);

        Ok(())
    }
}