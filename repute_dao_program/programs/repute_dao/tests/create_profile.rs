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
async fn create_profile_ix_success() {
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

	// DATA
	let username: String = Default::default();

	// KEYPAIR
	let owner_keypair = Keypair::new();
	let user_profile_keypair = Keypair::new();
	let treasury_keypair = Keypair::new();

	// PUBKEY
	let owner_pubkey = owner_keypair.pubkey();
	let user_profile_pubkey = user_profile_keypair.pubkey();
	let treasury_pubkey = treasury_keypair.pubkey();

	// EXECUTABLE PUBKEY
	let system_program_pubkey = Pubkey::from_str("11111111111111111111111111111111").unwrap();

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		user_profile_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		owner_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		user_profile_pubkey,
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

	let ix = repute_dao_ix_interface::create_profile_ix_setup(
		&owner_keypair,
		&user_profile_keypair,
		treasury_pubkey,
		system_program_pubkey,
		&username,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
