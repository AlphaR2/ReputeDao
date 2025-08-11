pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		repute_dao_ix_interface,
		csl_spl_token_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn unstake_tokens_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	program_test.add_program(
		"csl_spl_token",
		Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
		None,
	);

	// DATA
	let amount: u64 = Default::default();

	// KEYPAIR
	let owner_keypair = Keypair::new();
	let authority_keypair = Keypair::new();
	let user_profile_keypair = Keypair::new();
	let treasury_keypair = Keypair::new();

	// PUBKEY
	let owner_pubkey = owner_keypair.pubkey();
	let authority_pubkey = authority_keypair.pubkey();
	let user_profile_pubkey = user_profile_keypair.pubkey();
	let treasury_pubkey = treasury_keypair.pubkey();
	let user_token_account_pubkey = Pubkey::new_unique();
	let treasury_token_account_pubkey = Pubkey::new_unique();
	let source_pubkey = Pubkey::new_unique();
	let destination_pubkey = Pubkey::new_unique();

	// EXECUTABLE PUBKEY
	let csl_spl_token_v0_0_0_pubkey = Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap();

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		owner_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		authority_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = repute_dao_ix_interface::unstake_tokens_ix_setup(
		&owner_keypair,
		user_profile_pubkey,
		treasury_pubkey,
		user_token_account_pubkey,
		treasury_token_account_pubkey,
		source_pubkey,
		destination_pubkey,
		&authority_keypair,
		csl_spl_token_v0_0_0_pubkey,
		amount,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
