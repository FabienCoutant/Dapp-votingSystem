import React from "react";
import { useContract } from "../../hooks/useContract";
import { useIsOwner } from "../../states/contract/hooks";
import { Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { updateWorkflowStatus } from "../../states/contract/contractSlice";
import AddWhitelist from "./AddWhitelist";
import ListWhitelist from "./ListWhitelist";
import { setWinnerProposalId } from "../../states/proposals/proposalSlice";

const Admin = () => {
  const contract = useContract();
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const isOwner = useIsOwner();
  const workflowStatus = useSelector((state) => state.contract.status);

  const handleOnClick = async () => {
    if (contract !== null && isOwner && workflowStatus < 4) {
      const res = await contract.methods
        .nextWorkflowStatus()
        .send({ from: account });
    }
    if (contract !== null && isOwner && workflowStatus === 4) {
      await contract.methods.results().send({ from: account });
    }
  };

  contract.events.WorkflowStatusChange().on("data", ({ returnValues }) => {
    dispatch(updateWorkflowStatus(parseInt(returnValues["newStatus"])));
  });

  contract.events.VotesTallied().on("data", async () => {
    const winnerId = await contract.methods.getWinningProposalId().call();
    dispatch(setWinnerProposalId({ winnerId }));
  });

  return (
    <Card className="mb-4">
      <Card.Header>
        Admin panel :{"  "}
        {workflowStatus !== 5 && (
          <Button
            className="btn btn-primary"
            onClick={handleOnClick}
            disabled={workflowStatus === 5}
            size="sm"
          >
            {workflowStatus < 4 ? "Next Workflow" : "Call Result"}
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {workflowStatus === 0 && <AddWhitelist />}
        <ListWhitelist />
      </Card.Body>
    </Card>
  );
};

export default Admin;
