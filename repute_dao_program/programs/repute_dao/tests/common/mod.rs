use {
	repute_dao::{
			entry,
			ID as PROGRAM_ID,
	},
	solana_sdk::{
		entrypoint::{ProcessInstruction, ProgramResult},
		pubkey::Pubkey,
	},
	anchor_lang::prelude::AccountInfo,
	solana_program_test::*,
};

// Type alias for the entry function pointer used to convert the entry function into a ProcessInstruction function pointer.
pub type ProgramEntry = for<'info> fn(
	program_id: &Pubkey,
	accounts: &'info [AccountInfo<'info>],
	instruction_data: &[u8],
) -> ProgramResult;

// Macro to convert the entry function into a ProcessInstruction function pointer.
#[macro_export]
macro_rules! convert_entry {
	($entry:expr) => {
		// Use unsafe block to perform memory transmutation.
		unsafe { core::mem::transmute::<ProgramEntry, ProcessInstruction>($entry) }
	};
}

pub fn get_program_test() -> ProgramTest {
	let program_test = ProgramTest::new(
		"repute_dao",
		PROGRAM_ID,
		processor!(convert_entry!(entry)),
	);
	program_test
}
	
pub mod repute_dao_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		repute_dao::{
			ID as PROGRAM_ID,
			accounts as repute_dao_accounts,
			instruction as repute_dao_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	pub fn initialize_treasury_ix_setup(
		admin: &Keypair,
		treasury: &Keypair,
		token_mint: Pubkey,
		treasury_token_account: &Keypair,
		system_program: Pubkey,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = repute_dao_accounts::InitializeTreasury {
			admin: admin.pubkey(),
			treasury: treasury.pubkey(),
			token_mint: token_mint,
			treasury_token_account: treasury_token_account.pubkey(),
			system_program: system_program,
		};

		let data = repute_dao_instruction::InitializeTreasury;
		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&admin.pubkey()),
		);

		transaction.sign(&[
			&admin,
			&treasury,
			&treasury_token_account,
		], recent_blockhash);

		return transaction;
	}

	pub fn create_profile_ix_setup(
		owner: &Keypair,
		user_profile: &Keypair,
		treasury: Pubkey,
		system_program: Pubkey,
		username: &String,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = repute_dao_accounts::CreateProfile {
			owner: owner.pubkey(),
			user_profile: user_profile.pubkey(),
			treasury: treasury,
			system_program: system_program,
		};

		let data = 	repute_dao_instruction::CreateProfile {
				username: username.clone(),
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&owner.pubkey()),
		);

		transaction.sign(&[
			&owner,
			&user_profile,
		], recent_blockhash);

		return transaction;
	}

	pub fn stake_tokens_ix_setup(
		owner: &Keypair,
		user_profile: Pubkey,
		treasury: Pubkey,
		user_token_account: Pubkey,
		treasury_token_account: Pubkey,
		source: Pubkey,
		destination: Pubkey,
		authority: &Keypair,
		csl_spl_token_v0_0_0: Pubkey,
		amount: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = repute_dao_accounts::StakeTokens {
			owner: owner.pubkey(),
			user_profile: user_profile,
			treasury: treasury,
			user_token_account: user_token_account,
			treasury_token_account: treasury_token_account,
			source: source,
			destination: destination,
			authority: authority.pubkey(),
			csl_spl_token_v0_0_0: csl_spl_token_v0_0_0,
		};

		let data = 	repute_dao_instruction::StakeTokens {
				amount,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&owner.pubkey()),
		);

		transaction.sign(&[
			&owner,
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn unstake_tokens_ix_setup(
		owner: &Keypair,
		user_profile: Pubkey,
		treasury: Pubkey,
		user_token_account: Pubkey,
		treasury_token_account: Pubkey,
		source: Pubkey,
		destination: Pubkey,
		authority: &Keypair,
		csl_spl_token_v0_0_0: Pubkey,
		amount: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = repute_dao_accounts::UnstakeTokens {
			owner: owner.pubkey(),
			user_profile: user_profile,
			treasury: treasury,
			user_token_account: user_token_account,
			treasury_token_account: treasury_token_account,
			source: source,
			destination: destination,
			authority: authority.pubkey(),
			csl_spl_token_v0_0_0: csl_spl_token_v0_0_0,
		};

		let data = 	repute_dao_instruction::UnstakeTokens {
				amount,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&owner.pubkey()),
		);

		transaction.sign(&[
			&owner,
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn vote_ix_setup(
		voter: &Keypair,
		voter_profile: Pubkey,
		target_profile: Pubkey,
		vote_record: &Keypair,
		treasury: Pubkey,
		system_program: Pubkey,
		target: Pubkey,
		is_upvote: bool,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = repute_dao_accounts::Vote {
			voter: voter.pubkey(),
			voter_profile: voter_profile,
			target_profile: target_profile,
			vote_record: vote_record.pubkey(),
			treasury: treasury,
			system_program: system_program,
		};

		let data = 	repute_dao_instruction::Vote {
				target,
				is_upvote,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&voter.pubkey()),
		);

		transaction.sign(&[
			&voter,
			&vote_record,
		], recent_blockhash);

		return transaction;
	}

	pub fn reset_season_ix_setup(
		admin: &Keypair,
		treasury: Pubkey,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = repute_dao_accounts::ResetSeason {
			admin: admin.pubkey(),
			treasury: treasury,
		};

		let data = repute_dao_instruction::ResetSeason;
		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&admin.pubkey()),
		);

		transaction.sign(&[
			&admin,
		], recent_blockhash);

		return transaction;
	}

}

pub mod csl_spl_token_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		csl_spl_token::{
			ID as PROGRAM_ID,
			accounts as csl_spl_token_accounts,
			instruction as csl_spl_token_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	declare_id!("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

}
