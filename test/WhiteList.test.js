const { BN } = require("@openzeppelin/test-helpers");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Voting = artifacts.require("./Voting.sol");

contract("Whitelist", (accounts) => {
  const [owner, whitelist1, whitelist2] = accounts;
  let votingContractInstance;

  beforeEach(async () => {
    votingContractInstance = await Voting.new({ from: owner }); //same as above but allow to choose the owner
  });
  context("--- Owner test part ---", async () => {
    it("should be able to owner to add a new whitelist", async () => {
      const whitelistBeforeAdded =
        await votingContractInstance.getVoterInfoByAddress(whitelist1);
      expect(
        whitelistBeforeAdded.isRegistered,
        "Whitelist account shouldn't be registered"
      ).to.be.false;

      const receipt = await votingContractInstance.addNewVoter(whitelist1, {
        from: owner,
      });
      expectEvent(receipt, "VoterRegistered", {
        voterAddress: whitelist1,
      });

      const whitelistAfterAdded =
        await votingContractInstance.getVoterInfoByAddress(whitelist1);
      expect(
        whitelistAfterAdded.isRegistered,
        "Whitelist account should be registered"
      ).to.be.true;
    });
    it("should revert when owner try to add an existing whitelist", async () => {
      const whitelistBeforeAdded =
        await votingContractInstance.getVoterInfoByAddress(whitelist1);
      expect(
        whitelistBeforeAdded.isRegistered,
        "Whitelist account shouldn't be registered"
      ).to.be.false;

      const receipt = await votingContractInstance.addNewVoter(whitelist1, {
        from: owner,
      });
      expectEvent(receipt, "VoterRegistered", {
        voterAddress: whitelist1,
      });

      const whitelistAfterAdded =
        await votingContractInstance.getVoterInfoByAddress(whitelist1);

      expect(
        whitelistAfterAdded.isRegistered,
        "Whitelist account should be registered"
      ).to.be.true;
      await expectRevert(
        votingContractInstance.addNewVoter(whitelist1, {
          from: owner,
        }),
        "Voter already register"
      );
    });
    it("should revert if workflow isn't at RegisteringVoters", async () => {
      const initialWorkflowStatus =
        await votingContractInstance.getCurrentStatus();
      expect(initialWorkflowStatus).to.be.bignumber.equal(new BN(0)); //Check we are at initial workflow
      await votingContractInstance.nextWorkflowStatus({ from: owner });
      const nextWorkflowStatus =
        await votingContractInstance.getCurrentStatus();
      expect(nextWorkflowStatus).to.be.bignumber.equal(new BN(1)); //Check we move the workflow status to 1

      await expectRevert(
        votingContractInstance.addNewVoter(whitelist1, {
          from: owner,
        }),
        "Current workflow status not align with expectation"
      );
    });
  });
  context("--- Commun test part ---", async () => {
    it("should revert when not owner try to add whitelist", async () => {
      await expectRevert(
        votingContractInstance.addNewVoter(whitelist2, {
          from: whitelist1,
        }),
        "Ownable: caller is not the owner"
      );
    });

    it("should allow to get data for a specific whitelisted", async () => {
      const whitelistBeforeAdded =
        await votingContractInstance.getVoterInfoByAddress(whitelist1);
      expect(
        whitelistBeforeAdded.isRegistered,
        "Whitelist account shouldn't be registered"
      ).to.be.false;

      const receipt = await votingContractInstance.addNewVoter(whitelist1, {
        from: owner,
      });
      expectEvent(receipt, "VoterRegistered", {
        voterAddress: whitelist1,
      });

      const whitelistAfterAdded =
        await votingContractInstance.getVoterInfoByAddress(whitelist1);

      expect(whitelistAfterAdded, "Whitelist account should be correctly set")
        .to.be.an("array")
        .to.eql([true, false, "0"]);
    });

    it("should allow to get all addresses whitelisted", async () => {
      await votingContractInstance.addNewVoter(whitelist1, {
        from: owner,
      });
      await votingContractInstance.addNewVoter(whitelist2, {
        from: owner,
      });
      const addressListed = await votingContractInstance.getListOfWhitelist();
      const expectedWhitelisted = [whitelist1, whitelist2];
      expect(addressListed).to.be.an("array").to.eql(expectedWhitelisted);
    });
  });
});
