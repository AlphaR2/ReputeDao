import {
  AnchorProvider,
  BN,
  IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { ReputeDao } from "../../target/types/repute_dao";
import idl from "../../target/idl/repute_dao.json";
import * as pda from "./pda";

import { CslSplToken } from "../../target/types/csl_spl_token";
import idlCslSplToken from "../../target/idl/csl_spl_token.json";



let _program: Program<ReputeDao>;
let _programCslSplToken: Program<CslSplToken>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<ReputeDao>(
        idl as never,
        programId,
        anchorProvider,
    );

    _programCslSplToken = new Program<CslSplToken>(
        idlCslSplToken as never,
        new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        anchorProvider,
    );

};

export type InitializeTreasuryArgs = {
  admin: web3.PublicKey;
  treasury: web3.PublicKey;
  tokenMint: web3.PublicKey;
  treasuryTokenAccount: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Initialize the treasury and set the admin
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable, signer]` treasury: {@link Treasury} The treasury account
 * 2. `[]` token_mint: {@link Mint} The SPL token mint used for staking
 * 3. `[writable, signer]` treasury_token_account: {@link PublicKey} The token account that will hold staked tokens
 * 4. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 */
export const initializeTreasuryBuilder = (
	args: InitializeTreasuryArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<ReputeDao, never> => {


  return _program
    .methods
    .initializeTreasury(

    )
    .accountsStrict({
      admin: args.admin,
      treasury: args.treasury,
      tokenMint: args.tokenMint,
      treasuryTokenAccount: args.treasuryTokenAccount,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Initialize the treasury and set the admin
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable, signer]` treasury: {@link Treasury} The treasury account
 * 2. `[]` token_mint: {@link Mint} The SPL token mint used for staking
 * 3. `[writable, signer]` treasury_token_account: {@link PublicKey} The token account that will hold staked tokens
 * 4. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 */
export const initializeTreasury = (
	args: InitializeTreasuryArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    initializeTreasuryBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Initialize the treasury and set the admin
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable, signer]` treasury: {@link Treasury} The treasury account
 * 2. `[]` token_mint: {@link Mint} The SPL token mint used for staking
 * 3. `[writable, signer]` treasury_token_account: {@link PublicKey} The token account that will hold staked tokens
 * 4. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 */
export const initializeTreasurySendAndConfirm = async (
  args: Omit<InitializeTreasuryArgs, "admin" | "treasury" | "treasuryTokenAccount"> & {
    signers: {
      admin: web3.Signer,
      treasury: web3.Signer,
      treasuryTokenAccount: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return initializeTreasuryBuilder({
      ...args,
      admin: args.signers.admin.publicKey,
      treasury: args.signers.treasury.publicKey,
      treasuryTokenAccount: args.signers.treasuryTokenAccount.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.admin, args.signers.treasury, args.signers.treasuryTokenAccount])
    .rpc();
}

export type CreateProfileArgs = {
  owner: web3.PublicKey;
  userProfile: web3.PublicKey;
  treasury: web3.PublicKey;
  username: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a new user profile
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable, signer]` user_profile: {@link UserProfile} The user profile account
 * 2. `[]` treasury: {@link Treasury} The treasury account
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - username: {@link string} Unique username for the user
 */
export const createProfileBuilder = (
	args: CreateProfileArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<ReputeDao, never> => {


  return _program
    .methods
    .createProfile(
      args.username,
    )
    .accountsStrict({
      owner: args.owner,
      userProfile: args.userProfile,
      treasury: args.treasury,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a new user profile
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable, signer]` user_profile: {@link UserProfile} The user profile account
 * 2. `[]` treasury: {@link Treasury} The treasury account
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - username: {@link string} Unique username for the user
 */
export const createProfile = (
	args: CreateProfileArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createProfileBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a new user profile
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable, signer]` user_profile: {@link UserProfile} The user profile account
 * 2. `[]` treasury: {@link Treasury} The treasury account
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - username: {@link string} Unique username for the user
 */
export const createProfileSendAndConfirm = async (
  args: Omit<CreateProfileArgs, "owner" | "userProfile"> & {
    signers: {
      owner: web3.Signer,
      userProfile: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createProfileBuilder({
      ...args,
      owner: args.signers.owner.publicKey,
      userProfile: args.signers.userProfile.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.owner, args.signers.userProfile])
    .rpc();
}

export type StakeTokensArgs = {
  owner: web3.PublicKey;
  userProfile: web3.PublicKey;
  treasury: web3.PublicKey;
  userTokenAccount: web3.PublicKey;
  treasuryTokenAccount: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Stake tokens to gain voting rights
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable]` user_profile: {@link UserProfile} The user profile account
 * 2. `[writable]` treasury: {@link Treasury} The treasury account
 * 3. `[]` user_token_account: {@link PublicKey} The user's token account
 * 4. `[writable]` treasury_token_account: {@link PublicKey} The treasury's token account
 * 5. `[writable]` source: {@link PublicKey} The source account.
 * 6. `[writable]` destination: {@link PublicKey} The destination account.
 * 7. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 8. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - amount: {@link BigInt} Amount of tokens to stake
 */
export const stakeTokensBuilder = (
	args: StakeTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<ReputeDao, never> => {


  return _program
    .methods
    .stakeTokens(
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      owner: args.owner,
      userProfile: args.userProfile,
      treasury: args.treasury,
      userTokenAccount: args.userTokenAccount,
      treasuryTokenAccount: args.treasuryTokenAccount,
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Stake tokens to gain voting rights
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable]` user_profile: {@link UserProfile} The user profile account
 * 2. `[writable]` treasury: {@link Treasury} The treasury account
 * 3. `[]` user_token_account: {@link PublicKey} The user's token account
 * 4. `[writable]` treasury_token_account: {@link PublicKey} The treasury's token account
 * 5. `[writable]` source: {@link PublicKey} The source account.
 * 6. `[writable]` destination: {@link PublicKey} The destination account.
 * 7. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 8. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - amount: {@link BigInt} Amount of tokens to stake
 */
export const stakeTokens = (
	args: StakeTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    stakeTokensBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Stake tokens to gain voting rights
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable]` user_profile: {@link UserProfile} The user profile account
 * 2. `[writable]` treasury: {@link Treasury} The treasury account
 * 3. `[]` user_token_account: {@link PublicKey} The user's token account
 * 4. `[writable]` treasury_token_account: {@link PublicKey} The treasury's token account
 * 5. `[writable]` source: {@link PublicKey} The source account.
 * 6. `[writable]` destination: {@link PublicKey} The destination account.
 * 7. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 8. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - amount: {@link BigInt} Amount of tokens to stake
 */
export const stakeTokensSendAndConfirm = async (
  args: Omit<StakeTokensArgs, "owner" | "authority"> & {
    signers: {
      owner: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return stakeTokensBuilder({
      ...args,
      owner: args.signers.owner.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.owner, args.signers.authority])
    .rpc();
}

export type UnstakeTokensArgs = {
  owner: web3.PublicKey;
  userProfile: web3.PublicKey;
  treasury: web3.PublicKey;
  userTokenAccount: web3.PublicKey;
  treasuryTokenAccount: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  amount: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Unstake tokens and reduce voting power
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable]` user_profile: {@link UserProfile} The user profile account
 * 2. `[writable]` treasury: {@link Treasury} The treasury account
 * 3. `[writable]` user_token_account: {@link PublicKey} The user's token account
 * 4. `[writable]` treasury_token_account: {@link PublicKey} The treasury's token account
 * 5. `[writable]` source: {@link PublicKey} The source account.
 * 6. `[writable]` destination: {@link PublicKey} The destination account.
 * 7. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 8. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - amount: {@link BigInt} Amount of tokens to unstake
 */
export const unstakeTokensBuilder = (
	args: UnstakeTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<ReputeDao, never> => {


  return _program
    .methods
    .unstakeTokens(
      new BN(args.amount.toString()),
    )
    .accountsStrict({
      owner: args.owner,
      userProfile: args.userProfile,
      treasury: args.treasury,
      userTokenAccount: args.userTokenAccount,
      treasuryTokenAccount: args.treasuryTokenAccount,
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      cslSplTokenV000: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Unstake tokens and reduce voting power
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable]` user_profile: {@link UserProfile} The user profile account
 * 2. `[writable]` treasury: {@link Treasury} The treasury account
 * 3. `[writable]` user_token_account: {@link PublicKey} The user's token account
 * 4. `[writable]` treasury_token_account: {@link PublicKey} The treasury's token account
 * 5. `[writable]` source: {@link PublicKey} The source account.
 * 6. `[writable]` destination: {@link PublicKey} The destination account.
 * 7. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 8. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - amount: {@link BigInt} Amount of tokens to unstake
 */
export const unstakeTokens = (
	args: UnstakeTokensArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    unstakeTokensBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Unstake tokens and reduce voting power
 *
 * Accounts:
 * 0. `[signer]` owner: {@link PublicKey} 
 * 1. `[writable]` user_profile: {@link UserProfile} The user profile account
 * 2. `[writable]` treasury: {@link Treasury} The treasury account
 * 3. `[writable]` user_token_account: {@link PublicKey} The user's token account
 * 4. `[writable]` treasury_token_account: {@link PublicKey} The treasury's token account
 * 5. `[writable]` source: {@link PublicKey} The source account.
 * 6. `[writable]` destination: {@link PublicKey} The destination account.
 * 7. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 8. `[]` csl_spl_token_v0_0_0: {@link PublicKey} Auto-generated, CslSplTokenProgram v0.0.0
 *
 * Data:
 * - amount: {@link BigInt} Amount of tokens to unstake
 */
export const unstakeTokensSendAndConfirm = async (
  args: Omit<UnstakeTokensArgs, "owner" | "authority"> & {
    signers: {
      owner: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return unstakeTokensBuilder({
      ...args,
      owner: args.signers.owner.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.owner, args.signers.authority])
    .rpc();
}

export type VoteArgs = {
  voter: web3.PublicKey;
  voterProfile: web3.PublicKey;
  targetProfile: web3.PublicKey;
  voteRecord: web3.PublicKey;
  treasury: web3.PublicKey;
  target: web3.PublicKey;
  isUpvote: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Cast a vote for another user
 *
 * Accounts:
 * 0. `[signer]` voter: {@link PublicKey} 
 * 1. `[writable]` voter_profile: {@link UserProfile} The voter's profile account
 * 2. `[writable]` target_profile: {@link UserProfile} The target user's profile account
 * 3. `[writable, signer]` vote_record: {@link VoteRecord} The vote record account
 * 4. `[]` treasury: {@link Treasury} The treasury account
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - target: {@link PublicKey} The target user's wallet address
 * - is_upvote: {@link boolean} True for upvote, false for downvote
 */
export const voteBuilder = (
	args: VoteArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<ReputeDao, never> => {


  return _program
    .methods
    .vote(
      args.target,
      args.isUpvote,
    )
    .accountsStrict({
      voter: args.voter,
      voterProfile: args.voterProfile,
      targetProfile: args.targetProfile,
      voteRecord: args.voteRecord,
      treasury: args.treasury,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Cast a vote for another user
 *
 * Accounts:
 * 0. `[signer]` voter: {@link PublicKey} 
 * 1. `[writable]` voter_profile: {@link UserProfile} The voter's profile account
 * 2. `[writable]` target_profile: {@link UserProfile} The target user's profile account
 * 3. `[writable, signer]` vote_record: {@link VoteRecord} The vote record account
 * 4. `[]` treasury: {@link Treasury} The treasury account
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - target: {@link PublicKey} The target user's wallet address
 * - is_upvote: {@link boolean} True for upvote, false for downvote
 */
export const vote = (
	args: VoteArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    voteBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Cast a vote for another user
 *
 * Accounts:
 * 0. `[signer]` voter: {@link PublicKey} 
 * 1. `[writable]` voter_profile: {@link UserProfile} The voter's profile account
 * 2. `[writable]` target_profile: {@link UserProfile} The target user's profile account
 * 3. `[writable, signer]` vote_record: {@link VoteRecord} The vote record account
 * 4. `[]` treasury: {@link Treasury} The treasury account
 * 5. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - target: {@link PublicKey} The target user's wallet address
 * - is_upvote: {@link boolean} True for upvote, false for downvote
 */
export const voteSendAndConfirm = async (
  args: Omit<VoteArgs, "voter" | "voteRecord"> & {
    signers: {
      voter: web3.Signer,
      voteRecord: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return voteBuilder({
      ...args,
      voter: args.signers.voter.publicKey,
      voteRecord: args.signers.voteRecord.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.voter, args.signers.voteRecord])
    .rpc();
}

export type ResetSeasonArgs = {
  admin: web3.PublicKey;
  treasury: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Reset all reputation scores for a new season
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} The treasury account
 */
export const resetSeasonBuilder = (
	args: ResetSeasonArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<ReputeDao, never> => {


  return _program
    .methods
    .resetSeason(

    )
    .accountsStrict({
      admin: args.admin,
      treasury: args.treasury,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Reset all reputation scores for a new season
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} The treasury account
 */
export const resetSeason = (
	args: ResetSeasonArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    resetSeasonBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Reset all reputation scores for a new season
 *
 * Accounts:
 * 0. `[signer]` admin: {@link PublicKey} 
 * 1. `[writable]` treasury: {@link Treasury} The treasury account
 */
export const resetSeasonSendAndConfirm = async (
  args: Omit<ResetSeasonArgs, "admin"> & {
    signers: {
      admin: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return resetSeasonBuilder({
      ...args,
      admin: args.signers.admin.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.admin])
    .rpc();
}

// Getters

export const getUserProfile = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<ReputeDao>["userProfile"]> => _program.account.userProfile.fetch(publicKey, commitment);

export const getVoteRecord = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<ReputeDao>["voteRecord"]> => _program.account.voteRecord.fetch(publicKey, commitment);

export const getTreasury = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<ReputeDao>["treasury"]> => _program.account.treasury.fetch(publicKey, commitment);
export module CslSplTokenGetters {
    export const getMint = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["mint"]> => _programCslSplToken.account.mint.fetch(publicKey, commitment);
    
    export const getAccount = (
        publicKey: web3.PublicKey,
        commitment?: web3.Commitment
    ): Promise<IdlAccounts<CslSplToken>["account"]> => _programCslSplToken.account.account.fetch(publicKey, commitment);
}

