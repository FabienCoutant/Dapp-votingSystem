const { expectRevert, expectEvent,BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Voting = artifacts.require("./Voting.sol");

contract("Workflow", (accounts) => {
  const [owner, whitelist] = accounts;
  let votingContractInstance;

  beforeEach(async () => {
    votingContractInstance = await Voting.new({ from: owner }); //same as above but allow to choose the owner
  });
  context("--- Owner test part ---", async () => {
    it("should be able to owner to add move to ProposalsRegistrationStarted workflow status", async () => {
      const previousStatus = new BN(0);
      const expectedStatus = new BN(1);
      const receipt = await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      expectEvent(receipt, "ProposalsRegistrationStarted");
      expectEvent(receipt, "WorkflowStatusChange", {
        previousStatus: previousStatus,
        newStatus: expectedStatus,
      });

      const CurrentWorkflowStatus =
        await votingContractInstance.getCurrentStatus();
      expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(1));
    });
    it("should be able to owner to add move to ProposalsRegistrationEnded workflow status", async () => {
      const previousStatus = new BN(1);
      const expectedStatus = new BN(2);
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      const receipt = await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      expectEvent(receipt, "ProposalsRegistrationEnded");
      expectEvent(receipt, "WorkflowStatusChange", {
        previousStatus: previousStatus,
        newStatus: expectedStatus,
      });

      const CurrentWorkflowStatus =
        await votingContractInstance.getCurrentStatus();
      expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(2));
    });
    it("should be able to owner to add move to VotingSessionStarted workflow status", async () => {
      const previousStatus = new BN(2);
      const expectedStatus = new BN(3);
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      const receipt = await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      expectEvent(receipt, "VotingSessionStarted");
      expectEvent(receipt, "WorkflowStatusChange", {
        previousStatus: previousStatus,
        newStatus: expectedStatus,
      });

      const CurrentWorkflowStatus =
        await votingContractInstance.getCurrentStatus();
      expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(3));
    });
    it("should be able to owner to add move to VotingSessionEnded workflow status", async () => {
      const previousStatus = new BN(3);
      const expectedStatus = new BN(4);
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      const receipt = await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      expectEvent(receipt, "VotingSessionEnded");
      expectEvent(receipt, "WorkflowStatusChange", {
        previousStatus: previousStatus,
        newStatus: expectedStatus,
      });

      const CurrentWorkflowStatus =
        await votingContractInstance.getCurrentStatus();
      expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(4));
    });
    it("should revert after trying to move forward than VotingSessionEnded", async () => {
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      await votingContractInstance.nextWorkflowStatus({
        from: owner,
      });
      await expectRevert(
        votingContractInstance.nextWorkflowStatus({
          from: owner,
        }),
        "You can't go forwards"
      );
    });
  });
  context("--- NOT Owner test part ---", async () => {
    it("shoud revert if not owner", async () => {
      await expectRevert(
        votingContractInstance.nextWorkflowStatus({ from: whitelist }),
        "Ownable: caller is not the owner"
      );
    });
  });
});
