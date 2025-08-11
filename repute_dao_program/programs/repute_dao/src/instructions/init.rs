use anchor_lang::prelude::*;
use crate::state::*;
use crate::constants::*;

// context for initialization of the dao and setting of program configs 

#[derive(Accounts)]
#[instruction(admin: Pubkey)]
pub struct InitializeDao<'info> {
#[account(mut)]
pub signer: Signer<'info>, // we will not be passing the signer her as admin. 
// init config
#[account(
init,
payer = signer,
space = ANCHOR_DISCRIMINATOR + Config::INIT_SPACE,
seeds = [CONFIG, admin.key().as_ref()],
bump,
)]
pub config : Account<'info, Config>,
pub system_program : Program<'info, System>
}

// pass the admin as param

impl <'info> InitializeDao <'info> {
    pub fn initialize_dao(
    &mut self,
    minimum_stake: u64,
    admin: Pubkey,
    token_mint: Pubkey,
    vote_power: u8,
    bumps: InitializeDaoBumps
    ) -> Result<()> {
        self.config.set_inner(
        Config {
         admin: admin.key(),
         minimum_stake,
         token_mint,
         vote_power,
         is_paused: false,
         config_bump: bumps.config
        }
        );
        Ok(())
    }
}