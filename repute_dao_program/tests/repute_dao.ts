import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ReputeDao } from "../target/types/repute_dao";
import { 
  PublicKey, 
  Keypair, 
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { expect } from "chai";

describe("repute_dao", () => {
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ReputeDao as Program<ReputeDao>;
  
  // Test accounts
  let admin: Keypair;
  let user1: Keypair;
  let user2: Keypair;
  let tokenMint: PublicKey;
  let adminTokenAccount: PublicKey;
  let user1TokenAccount: PublicKey;
  let user2TokenAccount: PublicKey;

  // PDAs
  let configPda: PublicKey;
  let treasuryPda: PublicKey;
  let treasuryAuthPda: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let user1ProfilePda: PublicKey;
  let user2ProfilePda: PublicKey;
  let user1RegistryPda: PublicKey;
  let user2RegistryPda: PublicKey;

  // Test constants -- Remember to change username per test else it will fail
  const MINIMUM_STAKE = new anchor.BN(100);
  const VOTE_POWER = 3;
  const STAKE_AMOUNT = new anchor.BN(1000);
  const USERNAME1 = "danielss_builder";
  const USERNAME2 = "perryzz_helper";

  before(async () => {
    console.log("🚀 Setting up test environment...");
    
    // Generate keypairs
    admin = Keypair.generate();
    user1 = Keypair.generate();
    user2 = Keypair.generate();

    console.log("📋 Test Accounts:");
    console.log("  Admin:", admin.publicKey.toString());
    console.log("  User1:", user1.publicKey.toString());
    console.log("  User2:", user2.publicKey.toString());
    console.log("  Program ID:", program.programId.toString());

    // Airdrop SOL to accounts
    console.log("💰 Airdropping SOL...");
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(admin.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user1.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user2.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    );

    // Create token mint
    console.log("🪙 Creating token mint...");
    tokenMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      6 // 6 decimals
    );
    console.log("  Token Mint:", tokenMint.toString());

    // Create token accounts
    console.log("🏦 Creating token accounts...");
    adminTokenAccount = await createAccount(
      provider.connection,
      admin,
      tokenMint,
      admin.publicKey
    );

    user1TokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      user1.publicKey
    );

    user2TokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      user2.publicKey
    );

    console.log("  Admin Token Account:", adminTokenAccount.toString());
    console.log("  User1 Token Account:", user1TokenAccount.toString());
    console.log("  User2 Token Account:", user2TokenAccount.toString());

    // Mint tokens to admin
    console.log("🖨️ Minting tokens to admin...");
    await mintTo(
      provider.connection,
      admin,
      tokenMint,
      adminTokenAccount,
      admin,
      1000000 * 1e6 // 1M tokens
    );

    
    console.log("🔑 Deriving PDAs...");
    
  
    [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config"), admin.publicKey.toBuffer()],
      program.programId
    );
    console.log("  Config PDA:", configPda.toString());

    [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury"), admin.publicKey.toBuffer()],
      program.programId
    );
    console.log("  Treasury PDA:", treasuryPda.toString());

    [treasuryAuthPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury_auth"), configPda.toBuffer(), admin.publicKey.toBuffer()],
      program.programId
    );
    console.log("  Treasury Auth PDA:", treasuryAuthPda.toString());

    treasuryTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      treasuryAuthPda,
      true
    );
    console.log("  Treasury Token Account:", treasuryTokenAccount.toString());

    
    [user1ProfilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user1.publicKey.toBuffer()],
      program.programId
    );
    console.log("  User1 Profile PDA:", user1ProfilePda.toString());

    [user2ProfilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_profile"), user2.publicKey.toBuffer()],
      program.programId
    );
    console.log("  User2 Profile PDA:", user2ProfilePda.toString());


    [user1RegistryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_registry"), Buffer.from(USERNAME1)],
      program.programId
    );
    console.log("  User1 Registry PDA:", user1RegistryPda.toString());

    [user2RegistryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_registry"), Buffer.from(USERNAME2)],
      program.programId
    );
    console.log("  User2 Registry PDA:", user2RegistryPda.toString());

    console.log("✅ Setup complete!\n");
  });

  describe("Initialization", () => {
    it("Should initialize DAO configuration", async () => {
      console.log("🏗️ Initializing DAO configuration...");
      
      try {
        await program.methods
          .initDao(
            admin.publicKey,
            MINIMUM_STAKE,
            tokenMint,
            VOTE_POWER
          )
          .accountsPartial({
            signer: admin.publicKey,
            config: configPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([admin])
          .rpc();

        console.log("✅ DAO configuration initialized successfully");

        // Verify config was created correctly
        const config = await program.account.config.fetch(configPda);
        console.log("📊 Config verification:");
        console.log("  Admin:", config.admin.toString());
        console.log("  Minimum Stake:", config.minimumStake.toString());
        console.log("  Token Mint:", config.tokenMint.toString());
        console.log("  Vote Power:", config.votePower);
        console.log("  Is Paused:", config.isPaused);

        expect(config.admin.toString()).to.equal(admin.publicKey.toString());
        expect(config.minimumStake.toString()).to.equal(MINIMUM_STAKE.toString());
        expect(config.tokenMint.toString()).to.equal(tokenMint.toString());
        expect(config.votePower).to.equal(VOTE_POWER);
        expect(config.isPaused).to.be.false;
      } catch (error) {
        console.error("❌ Failed to initialize DAO:", error);
        throw error;
      }
    });

    it("Should initialize treasury", async () => {
      console.log("🏦 Initializing treasury...");
      
      try {
        await program.methods
          .initializeTreasury()
          .accountsPartial({
            signer: admin.publicKey,
            admin: admin.publicKey,
            config: configPda,
            treasury: treasuryPda,
            treasuryAuthority: treasuryAuthPda,
            tokenMintAccount: tokenMint,
            treasuryTokenAccount: treasuryTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([admin])
          .rpc();

        console.log("✅ Treasury initialized successfully");

        // Verify treasury was created correctly
        const treasury = await program.account.treasury.fetch(treasuryPda);
        console.log("📊 Treasury verification:");
        console.log("  Admin:", treasury.admin.toString());
        console.log("  Total Staked:", treasury.totalStaked.toString());
        console.log("  Stakers Count:", treasury.stakersCount.toString());
        console.log("  Treasury Token Account:", treasury.treasuryTokenAccount.toString());

        expect(treasury.admin.toString()).to.equal(admin.publicKey.toString());
        expect(treasury.totalStaked.toString()).to.equal("0");
        expect(treasury.stakersCount.toString()).to.equal("0");
        expect(treasury.treasuryTokenAccount.toString()).to.equal(treasuryTokenAccount.toString());
      } catch (error) {
        console.error("❌ Failed to initialize treasury:", error);
        throw error;
      }
    });
  });

  describe("Profile Management", () => {
    it("Should create user profiles", async () => {
      console.log("👤 Creating user profiles...");
      
      try {
        // Create user1 profile
        console.log("  Creating profile for user1:", USERNAME1);
        await program.methods
          .createProfile(USERNAME1)
          .accountsPartial({
            user: user1.publicKey,
            userRegistry: user1RegistryPda,
            userProfile: user1ProfilePda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();

        console.log("✅ User1 profile created");

        // Create user2 profile
        console.log("  Creating profile for user2:", USERNAME2);
        await program.methods
          .createProfile(USERNAME2)
          .accountsPartial({
            user: user2.publicKey,
            userRegistry: user2RegistryPda,
            userProfile: user2ProfilePda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user2])
          .rpc();

        console.log("✅ User2 profile created");

        // Verify profiles were created correctly
        const user1Profile = await program.account.userProfile.fetch(user1ProfilePda);
        const user2Profile = await program.account.userProfile.fetch(user2ProfilePda);

        console.log("📊 Profile verification:");
        console.log("  User1 - Username:", user1Profile.username, "Owner:", user1Profile.owner.toString());
        console.log("  User2 - Username:", user2Profile.username, "Owner:", user2Profile.owner.toString());

        expect(user1Profile.username).to.equal(USERNAME1);
        expect(user1Profile.owner.toString()).to.equal(user1.publicKey.toString());
        expect(user1Profile.reputationPoints.toString()).to.equal("0");
        expect(user1Profile.stakeAmount.toString()).to.equal("0");

        expect(user2Profile.username).to.equal(USERNAME2);
        expect(user2Profile.owner.toString()).to.equal(user2.publicKey.toString());
      } catch (error) {
        console.error("❌ Failed to create user profiles:", error);
        throw error;
      }
    });

    it("Should fail to create duplicate username", async () => {
      console.log("🚫 Testing duplicate username prevention...");
      
      try {
        // Create a new profile PDA for this test
        const [newProfilePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("user_profile"), user2.publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .createProfile(USERNAME1)
          .accountsPartial({
            user: user2.publicKey,
            userRegistry: user1RegistryPda,
            userProfile: newProfilePda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user2])
          .rpc();
        
        console.log("❌ Should have failed with duplicate username");
        expect.fail("Should have failed with duplicate username");
      } catch (error) {
        console.log("✅ Correctly failed with duplicate username");
        console.log("  Error:", error.message);
        expect(error.message).to.include("already in use");
      }
    });
  });

  describe("Token Staking", () => {
    before(async () => {
      console.log("🪙 Setting up token accounts for staking...");
      
      // Create user token accounts and mint tokens
      await createAccount(
        provider.connection,
        user1,
        tokenMint,
        user1.publicKey
      );

      await createAccount(
        provider.connection,
        user2,
        tokenMint,
        user2.publicKey
      );

      // Transfer tokens from admin to users
      await mintTo(
        provider.connection,
        admin,
        tokenMint,
        user1TokenAccount,
        admin,
        10000 * 1e6 // 10k tokens
      );

      await mintTo(
        provider.connection,
        admin,
        tokenMint,
        user2TokenAccount,
        admin,
        10000 * 1e6 // 10k tokens
      );

      console.log("✅ Token accounts setup complete");
    });

    it("Should stake tokens successfully", async () => {
      console.log("💰 Testing successful token staking...");
      
      try {
        await program.methods
          .stakeTokens(STAKE_AMOUNT)
          .accountsPartial({
            user: user1.publicKey,
            admin: admin.publicKey,
            config: configPda,
            treasury: treasuryPda,
            userProfile: user1ProfilePda,
            tokenMintAccount: tokenMint,
            userTokenAccount: user1TokenAccount,
            treasuryTokenAccount: treasuryTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();

        console.log("✅ Tokens staked successfully");

        // Verify stake was recorded
        const user1Profile = await program.account.userProfile.fetch(user1ProfilePda);
        const treasury = await program.account.treasury.fetch(treasuryPda);

        console.log("📊 Staking verification:");
        console.log("  User1 Stake Amount:", user1Profile.stakeAmount.toString());
        console.log("  Treasury Total Staked:", treasury.totalStaked.toString());
        console.log("  Treasury Stakers Count:", treasury.stakersCount.toString());

        expect(user1Profile.stakeAmount.toString()).to.equal(STAKE_AMOUNT.toString());
        expect(treasury.totalStaked.toString()).to.equal(STAKE_AMOUNT.toString());
        expect(treasury.stakersCount.toString()).to.equal("1");
      } catch (error) {
        console.error("❌ Failed to stake tokens:", error);
        throw error;
      }
    });

    it("Should fail to stake below minimum", async () => {
      console.log("🚫 Testing minimum stake requirement...");
      
      try {
        await program.methods
          .stakeTokens(new anchor.BN(50)) // Below minimum of 100
          .accountsPartial({
            user: user2.publicKey,
            admin: admin.publicKey,
            config: configPda,
            treasury: treasuryPda,
            userProfile: user2ProfilePda,
            tokenMintAccount: tokenMint,
            userTokenAccount: user2TokenAccount,
            treasuryTokenAccount: treasuryTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user2])
          .rpc();
        
        console.log("❌ Should have failed with minimum stake requirement");
        expect.fail("Should have failed with minimum stake requirement");
      } catch (error) {
        console.log("✅ Correctly failed with minimum stake requirement");
        console.log("  Error:", error.message);
        expect(error.message).to.include("MinimumStakeRequired");
      }
    });
  });

  describe("Voting System", () => {
    let voteCooldownPda: PublicKey;
    let voteRecordPda: PublicKey;

    before(async () => {
      console.log("🗳️ Setting up voting system...");
      
      // Stake tokens for user2 so they can vote
      await program.methods
        .stakeTokens(STAKE_AMOUNT)
        .accountsPartial({
          user: user2.publicKey,
          admin: admin.publicKey,
          config: configPda,
          treasury: treasuryPda,
          userProfile: user2ProfilePda,
          tokenMintAccount: tokenMint,
          userTokenAccount: user2TokenAccount,
          treasuryTokenAccount: treasuryTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();

      // Derive vote PDAs
      [voteCooldownPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("cooldown"), user2.publicKey.toBuffer()],
        program.programId
      );

      [voteRecordPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vote_record"),
          user2.publicKey.toBuffer(),
          Buffer.from(USERNAME1)
        ],
        program.programId
      );

      console.log("📋 Vote PDAs:");
      console.log("  Vote Cooldown PDA:", voteCooldownPda.toString());
      console.log("  Vote Record PDA:", voteRecordPda.toString());
      console.log("✅ Voting setup complete");
    });

    it("Should upvote another user", async () => {
      console.log("👍 Testing upvote functionality...");
      
      try {
        await program.methods
          .upvote(USERNAME1)
          .accountsPartial({
            voter: user2.publicKey,
            admin: admin.publicKey,
            config: configPda,
            voterProfile: user2ProfilePda,
            targetUserRegistry: user1RegistryPda,
            targetUserProfile: user1ProfilePda,
            voteCooldown: voteCooldownPda,
            voteRecord: voteRecordPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user2])
          .rpc();

        console.log("✅ Upvote cast successfully");

        // Verify reputation was updated
        const user1Profile = await program.account.userProfile.fetch(user1ProfilePda);
        const user2Profile = await program.account.userProfile.fetch(user2ProfilePda);

        const expectedReputation = 1 * VOTE_POWER;
        
        console.log("📊 Vote verification:");
        console.log("  User1 Reputation Points:", user1Profile.reputationPoints.toString());
        console.log("  User1 Upvotes Received:", user1Profile.upvotesReceived.toString());
        console.log("  User2 Total Votes Cast:", user2Profile.totalVotesCast.toString());
        console.log("  Expected Reputation:", expectedReputation);

        expect(user1Profile.reputationPoints.toString()).to.equal(expectedReputation.toString());
        expect(user1Profile.upvotesReceived.toString()).to.equal("1");
        expect(user2Profile.totalVotesCast.toString()).to.equal("1");
      } catch (error) {
        console.error("❌ Failed to upvote:", error);
        throw error;
      }
    });

    it("Should fail to vote for self", async () => {
      console.log("🚫 Testing self-vote prevention...");
      
      try {
        const [selfVoteRecordPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("vote_record"),
            user2.publicKey.toBuffer(),
            Buffer.from(USERNAME2)
          ],
          program.programId
        );

        await program.methods
          .upvote(USERNAME2) // user2 trying to vote for themselves
          .accountsPartial({
            voter: user2.publicKey,
            admin: admin.publicKey,
            config: configPda,
            voterProfile: user2ProfilePda,
            targetUserRegistry: user2RegistryPda,
            targetUserProfile: user2ProfilePda,
            voteCooldown: voteCooldownPda,
            voteRecord: selfVoteRecordPda,
            systemProgram: SystemProgram.programId,
          })
          .signers([user2])
          .rpc();
        
        console.log("❌ Should have failed with cannot vote for self");
        expect.fail("Should have failed with cannot vote for self");
      } catch (error) {
        console.log("✅ Correctly failed with self-vote prevention");
        console.log("  Error:", error.message);
        expect(error.message).to.include("CannotVoteForSelf");
      }
    });

    // it("Should fail to downvote as Member role", async () => {
    //   console.log("🚫 Testing downvote permission (Member role)...");
      
    //   try {
    //     const [downvoteRecordPda] = PublicKey.findProgramAddressSync(
    //       [
    //         Buffer.from("vote_record"),
    //         user2.publicKey.toBuffer(),
    //         Buffer.from(USERNAME1),
    //       ],
    //       program.programId
    //     );

    //     await program.methods
    //       .downvote(USERNAME1)
    //       .accountsPartial({
    //         voter: user2.publicKey,
    //         admin: admin.publicKey,
    //         config: configPda,
    //         voterProfile: user2ProfilePda,
    //         targetUserRegistry: user1RegistryPda,
    //         targetUserProfile: user1ProfilePda,
    //         voteCooldown: voteCooldownPda,
    //         voteRecord: downvoteRecordPda,
    //         systemProgram: SystemProgram.programId,
    //       })
    //       .signers([user2])
    //       .rpc();
        
    //     console.log("❌ Should have failed with cannot downvote");
    //     expect.fail("Should have failed with cannot downvote");
    //   } catch (error) {
    //     console.log("✅ Correctly failed with downvote permission");
    //     console.log("  Error:", error.message);
    //     expect(error.message).to.include("CannotDownvote");
    //   }
    // });
  });

  describe("Unstaking", () => {
    it("Should unstake tokens successfully", async () => {
      console.log("💸 Testing successful token unstaking...");
      
      try {
        const unstakeAmount = new anchor.BN(500);

        await program.methods
          .unstakeTokens(unstakeAmount)
          .accountsPartial({
            user: user1.publicKey,
            admin: admin.publicKey,
            config: configPda,
            treasury: treasuryPda,
            treasuryAuthority: treasuryAuthPda,
            userProfile: user1ProfilePda,
            tokenMintAccount: tokenMint,
            userTokenAccount: user1TokenAccount,
            treasuryTokenAccount: treasuryTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();

        console.log("✅ Tokens unstaked successfully");

        // Verify stake was reduced
        const user1Profile = await program.account.userProfile.fetch(user1ProfilePda);
        const treasury = await program.account.treasury.fetch(treasuryPda);

        const expectedStake = STAKE_AMOUNT.sub(unstakeAmount);
        const expectedTotalStaked = STAKE_AMOUNT.add(STAKE_AMOUNT).sub(unstakeAmount);

        console.log("📊 Unstaking verification:");
        console.log("  User1 Remaining Stake:", user1Profile.stakeAmount.toString());
        console.log("  Treasury Total Staked:", treasury.totalStaked.toString());
        console.log("  Expected User1 Stake:", expectedStake.toString());
        console.log("  Expected Total Staked:", expectedTotalStaked.toString());

        expect(user1Profile.stakeAmount.toString()).to.equal(expectedStake.toString());
        expect(treasury.totalStaked.toString()).to.equal(expectedTotalStaked.toString());
      } catch (error) {
        console.error("❌ Failed to unstake tokens:", error);
        throw error;
      }
    });

    it("Should fail to unstake more than staked", async () => {
      console.log("🚫 Testing unstake amount validation...");
      
      try {
        await program.methods
          .unstakeTokens(new anchor.BN(10000)) // More than they have staked
          .accountsPartial({
            user: user1.publicKey,
            admin: admin.publicKey,
            config: configPda,
            treasury: treasuryPda,
            treasuryAuthority: treasuryAuthPda,
            userProfile: user1ProfilePda,
            tokenMintAccount: tokenMint,
            userTokenAccount: user1TokenAccount,
            treasuryTokenAccount: treasuryTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .signers([user1])
          .rpc();
        
        console.log("❌ Should have failed with insufficient stake");
        expect.fail("Should have failed with insufficient stake");
      } catch (error) {
        console.log("✅ Correctly failed with insufficient stake");
        console.log("  Error:", error.message);
        expect(error.message).to.include("InsufficientStake");
      }
    });
  });

  describe("Admin Functions", () => {
    it("Should reset user reputation", async () => {
      console.log("🔄 Testing user reputation reset...");
      
      try {
        // The reset function takes a user parameter
        await program.methods
          .resetUserReputation(user1.publicKey)
          .accountsPartial({
            admin: admin.publicKey,
            config: configPda,
            userProfile: user1ProfilePda,
          })
          .signers([admin])
          .rpc();

        console.log("✅ User reputation reset successfully");

        // Verify reputation was reset
        const user1Profile = await program.account.userProfile.fetch(user1ProfilePda);

        console.log("📊 Reset verification:");
        console.log("  Reputation Points:", user1Profile.reputationPoints.toString());
        console.log("  Upvotes Received:", user1Profile.upvotesReceived.toString());
        console.log("  Downvotes Received:", user1Profile.downvotesReceived.toString());
        console.log("  Stake Amount (should be preserved):", user1Profile.stakeAmount.toString());

        expect(user1Profile.reputationPoints.toString()).to.equal("0");
        expect(user1Profile.upvotesReceived.toString()).to.equal("0");
        expect(user1Profile.downvotesReceived.toString()).to.equal("0");
        // Note: stake_amount should be preserved
        expect(user1Profile.stakeAmount.toString()).to.not.equal("0");
      } catch (error) {
        console.error("❌ Failed to reset user reputation:", error);
        throw error;
      }
    });

    it("Should fail reset with non-admin", async () => {
      console.log("🚫 Testing admin-only reset function...");
      
      try {
        // Try to derive config with user1 as admin (should fail)
        const [fakeConfigPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("config"), user1.publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .resetUserReputation(user2.publicKey)
          .accountsPartial({
            admin: user1.publicKey, // Non-admin trying to reset
            config: fakeConfigPda, // This won't exist
            userProfile: user2ProfilePda,
          })
          .signers([user1])
          .rpc();
        
        console.log("❌ Should have failed with unauthorized admin");
        expect.fail("Should have failed with unauthorized admin");
      } catch (error) {
        console.log("✅ Correctly failed with unauthorized admin");
        console.log("  Error:", error.message);
        expect(error.message).to.include("AccountNotInitialized");
      }
    });
  });
});