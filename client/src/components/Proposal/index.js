import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import AddProposal from "./AddProposal";
import {
  useFetchProposalsList,
  useFetchWinnerId,
} from "../../states/proposals/hooks";
import ProposalList from "./ProposalList";
import { addProposalVote } from "../../states/proposals/proposalSlice";
import { useContract } from "../../hooks/useContract";
import { addUserHasVote } from "../../states/contract/contractSlice";

const Proposal = () => {
  const dispatch = useDispatch();
  const contract = useContract();
  const workflowStatus = useSelector((state) => state.contract.status);
  const userData = useSelector((state) => state.contract.userVoterData);
  const proposalList = useSelector((state) => state.proposal.proposalList);
  const winnerId = useSelector((state) => state.proposal.winnerId);

  useFetchProposalsList();
  useFetchWinnerId();

  useEffect(() => {
    if (contract !== null) {
      contract.events.Voted().on("data", async ({ returnValues }) => {
        const { proposalId } = returnValues;
        dispatch(addProposalVote(proposalId));
        dispatch(addUserHasVote({ hasVoted: true, proposalId }));
      });
    }
  }, [contract]);

  const renderVoterData = () => {
    if (workflowStatus === 3 && userData.isRegistered) {
      return userData.hasVoted ? "You have already voted" : "You can vote";
    }
  };
  return (
    <Card>
      <Card.Header>
        Proposal part :{"  "} {renderVoterData()}{" "}
        {workflowStatus === 5 && winnerId && (
          <span className="fw-bold">
            The winner ({proposalList[winnerId].voteCount} vote(s)):{" "}
            {proposalList[winnerId].description}
          </span>
        )}
      </Card.Header>
      <Card.Body>
        {workflowStatus === 1 && userData.isRegistered && <AddProposal />}
        {workflowStatus === 0 ? (
          <Card.Title className="text-center">
            The voting campaign has not yet started. Come back late!
          </Card.Title>
        ) : (
          <ProposalList />
        )}
      </Card.Body>
    </Card>
  );
};

export default Proposal;
