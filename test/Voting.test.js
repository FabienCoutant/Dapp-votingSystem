const { expectRevert, expectEvent,BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Voting = artifacts.require("./Voting.sol");

contract("Voting", (accounts) => {
  const [owner, whitelist1, whitelist2, anonymus] = accounts;
  let votingContractInstance;

  beforeEach(async () => {
    votingContractInstance = await Voting.new({ from: owner }); //same as above but allow to choose the owner
    await votingContractInstance.addNewVoter(whitelist1, {
      from: owner,
    });
    await votingContractInstance.addNewVoter(whitelist2, {
      from: owner,
    });
  });

  context("--- Add new Proposal part ---", async () => {
    context("----- Right workflow status -----", async () => {
      beforeEach(async () => {
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        const CurrentWorkflowStatus =
          await votingContractInstance.getCurrentStatus();
        expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(1));
      });

      it("should allow whitelisted user to add a new proposal", async () => {
        const receipt = await votingContractInstance.addProposal("Test", {
          from: whitelist1,
        });
        expectEvent(receipt, "ProposalRegistered", {
          proposalId: new BN(0),
        });

        const proposalsList = await votingContractInstance.getProposals();
        expect(proposalsList, "ProposalList should have 1 proposal")
          .to.be.an("array")
          .to.have.lengthOf(1);

        const proposal = await votingContractInstance.getProposalById(0);

        const expectedProposalResult = ["Test", "0"];
        expect(proposal, "Proposal doesn't have to right data")
          .to.be.an("array")
          .to.eql(expectedProposalResult);
      });

      it("should revert adding proposal that already exist", async () => {
        const receipt = await votingContractInstance.addProposal("Test", {
          from: whitelist1,
        });
        expectEvent(receipt, "ProposalRegistered", {
          proposalId: new BN(0),
        });

        const proposalsList = await votingContractInstance.getProposals();
        expect(proposalsList, "ProposalList should have 1 proposal")
          .to.be.an("array")
          .to.have.lengthOf(1);

        const proposal = await votingContractInstance.getProposalById(0);

        const expectedProposalResult = ["Test", "0"];
        expect(proposal, "Proposal doesn't have to right data")
          .to.be.an("array")
          .to.eql(expectedProposalResult);

        await expectRevert(
          votingContractInstance.addProposal("Test", {
            from: whitelist1,
          }),
          "This proposal already exist"
        );
      });
      it("should revert adding proposal for not whitelisted users", async () => {
        await expectRevert(
          votingContractInstance.addProposal("Test", {
            from: anonymus,
          }),
          "You are not whitelisted"
        );
      });
    });
    context("----- Wrong workflow status -----", async () => {
      it("should revert adding proposal if workflowstatus is before ProposalsRegistrationStarted", async () => {
        await expectRevert(
          votingContractInstance.addProposal("Test", {
            from: whitelist1,
          }),
          "Current workflow status not align with expectation"
        );
      });
      it("should revert adding proposal if workflowstatus is after ProposalsRegistrationStarted", async () => {
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        await expectRevert(
          votingContractInstance.addProposal("Test", {
            from: whitelist1,
          }),
          "Current workflow status not align with expectation"
        );
      });
    });
  });

  context("--- Voting Proposal part ---", async () => {
    beforeEach(async () => {
      await votingContractInstance.nextWorkflowStatus({ from: owner });
      await votingContractInstance.addProposal("Test", {
        from: whitelist1,
      });
      await votingContractInstance.addProposal("Test2", {
        from: whitelist1,
      });
      await votingContractInstance.nextWorkflowStatus({ from: owner });
      const CurrentWorkflowStatus =
        await votingContractInstance.getCurrentStatus();
      expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(2));
    });
    context("----- Right Workflow status -----", async () => {
      beforeEach(async () => {
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        const CurrentWorkflowStatus =
          await votingContractInstance.getCurrentStatus();
        expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(3));
      });

      it("should allow whitelisted users to vote for a proposal", async () => {
        const _proposalId = new BN(0);
        const InitialProposalInfo =
          await votingContractInstance.getProposalById(_proposalId);
        const expectedInitialProposalInfo = ["Test", "0"];
        expect(InitialProposalInfo, "Proposal doesn't have to right data")
          .to.be.an("array")
          .to.eql(expectedInitialProposalInfo);

        const receipt = await votingContractInstance.addVote(_proposalId, {
          from: whitelist1,
        });
        expectEvent(receipt, "Voted", {
          voter: whitelist1,
          proposalId: _proposalId,
        });

        const NewProposalInfo = await votingContractInstance.getProposalById(
          _proposalId
        );
        const expectedNewProposalInfo = ["Test", "1"];
        expect(NewProposalInfo, "Proposal vote hasn't be updated")
          .to.be.an("array")
          .to.eql(expectedNewProposalInfo);
      });
      it("should revert if user have already voted", async () => {
        await votingContractInstance.addVote(new BN(0), {
          from: whitelist1,
        });
        await expectRevert(
          votingContractInstance.addVote(new BN(1), {
            from: whitelist1,
          }),
          "You have already voted"
        );
      });
      it("should revert if proposalId doesn't exist", async () => {
        await expectRevert(
          votingContractInstance.addVote(new BN(3), {
            from: whitelist1,
          }),
          "The proposalId is out of the array"
        );
      });
      it("should revert if voter is not a whitelisted user", async () => {
        await expectRevert(
          votingContractInstance.addVote(new BN(0), {
            from: anonymus,
          }),
          "You are not whitelisted"
        );
      });
    });
    context("----- Wrong workflow status -----", async () => {
      it("should revert add vote to proposal if workflowstatus is before VotingSessionStarted", async () => {
        await expectRevert(
          votingContractInstance.addVote(new BN(0), {
            from: whitelist1,
          }),
          "Current workflow status not align with expectation"
        );
      });
      it("should revert add vote to proposal if workflowstatus is after VotingSessionStarted", async () => {
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        await expectRevert(
          votingContractInstance.addVote(new BN(0), {
            from: whitelist1,
          }),
          "Current workflow status not align with expectation"
        );
      });
    });
  });

  context("--- Voting Result part ---", async () => {
    context("----- Right workflow status -----", async () => {
      beforeEach(async () => {
        const votingProposalId = new BN(1);
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        await votingContractInstance.addProposal("Test", {
          from: whitelist1,
        });
        await votingContractInstance.addProposal("Test2", {
          from: whitelist1,
        });
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        await votingContractInstance.addVote(votingProposalId, {
          from: whitelist1,
        });
        await votingContractInstance.addVote(votingProposalId, {
          from: whitelist2,
        });
        await votingContractInstance.nextWorkflowStatus({ from: owner });
        const CurrentWorkflowStatus =
          await votingContractInstance.getCurrentStatus();
        expect(CurrentWorkflowStatus).to.be.bignumber.equal(new BN(4));
      });

      it("should allow owner to claim result", async () => {
        const winningId = new BN(1);
        const receipt = await votingContractInstance.results({
          from: owner,
        });
        expectEvent(receipt, "VotesTallied");
        const winningProposalId =
          await votingContractInstance.getWinningProposalId();

        expect(
          winningProposalId,
          "Winning proposal is not the good one"
        ).to.be.bignumber.equal(winningId);
      });
      it("should revert if not owner claim result", async () => {
        await expectRevert(
          votingContractInstance.results({
            from: whitelist1,
          }),
          "Ownable: caller is not the owner"
        );
      });
    });
    context("----- Wrong workflow status -----", async () => {
      it("should revert claim result if workflowstatus is before VotingSessionEnded", async () => {
        await expectRevert(
          votingContractInstance.results({
            from: owner,
          }),
          "Current workflow status not align with expectation"
        );
      });
      it("should revert getWinningProposalId if workflowstatus is equal to VotesTallied", async () => {
        await expectRevert(
          votingContractInstance.getWinningProposalId(),
          "Current workflow status not align with expectation"
        );
      });
    });
  });
});
