import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Alert, ListGroup, Table } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../hooks/useContract";

const ProposalList = () => {
  const { account } = useWeb3React();
  const contract = useContract();
  const proposalList = useSelector((state) => state.proposal.proposalList);
  const winnerId = useSelector((state) => state.proposal.winnerId);
  const workflowStatus = useSelector((state) => state.contract.status);
  const userData = useSelector((state) => state.contract.userVoterData);
  const [error, setError] = useState("");

  const voteProposal = async (index) => {
    const getNbProposal = await contract.methods.getNumberOfProposals().call();
    if (!userData.hasVoted && getNbProposal >= index) {
      setError("");
      await contract.methods.addVote(index).send({ from: account });
    } else setError(`You already Voted`);
  };

  const renderProposalItem = () => {
    const buttonVariant =
      workflowStatus === 3 && !userData.hasVoted ? "info" : "secondary";
    return proposalList.map((proposal, index) => {
      return (
        <tr
          key={index}
          className={winnerId === index ? "bg-success text-white" : ""}
        >
          <td>
            {proposal.description}
            {winnerId === index && <span className="fw-bold"> - WINNER</span>}
          </td>
          <td>{proposal.voteCount}</td>
          {userData.isRegistered && workflowStatus === 3 && (
            <td>
              <Button
                onClick={() => voteProposal(index)}
                variant={buttonVariant}
                disabled={workflowStatus !== 3 || userData.hasVoted}
                size="sm"
              >
                {!userData.hasVoted ? "Vote" : "You already Voted"}
              </Button>
            </td>
          )}
        </tr>
      );
    });
  };
  return (
    <>
      {error !== "" && <Alert variant="danger">{error}</Alert>}
      <ListGroup variant="flush">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Description</th>
              <th>Number of vote</th>
              {workflowStatus === 3 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>{renderProposalItem()}</tbody>
        </Table>
      </ListGroup>
    </>
  );
};

export default ProposalList;
