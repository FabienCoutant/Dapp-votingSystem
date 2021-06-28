import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../hooks/useContract";
import {
  serializeProposal,
  serializeProposalDescription,
} from "../../utils/formatProposal";
import { addProposal } from "../../states/proposals/proposalSlice";

const AddWhitelist = () => {
  const { account } = useWeb3React();
  const contract = useContract();
  const dispatch = useDispatch();
  const proposalList = useSelector((state) => state.proposal.proposalList);
  const userData = useSelector((state) => state.contract.proposalList);
  const [error, setError] = useState("");

  useEffect(() => {
    if (contract !== null) {
      contract.events
        .ProposalRegistered()
        .on("data", async ({ returnValues }) => {
          const newProposal = returnValues["proposalId"];
          if (
            !proposalList.some(
              (proposal) => proposal.description === newProposal
            )
          ) {
            const proposal = await contract.methods
              .getProposalById(newProposal)
              .call();
            dispatch(addProposal(serializeProposal(proposal)));
          }
        });
    }
  }, [contract]);

  const onSubmitProposal = async (event) => {
    event.preventDefault();
    const description = serializeProposalDescription(
      event.target.description.value
    );
    if (
      !proposalList.some((proposal) => proposal.description === description)
    ) {
      setError("");
      await contract.methods.addProposal(description).send({ from: account });
    } else setError(`${description} is already proposed`);
  };

  return (
    <>
      {error !== "" && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={onSubmitProposal}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              id="description"
              placeholder="Description of your proposal"
            />
          </Col>
          <Col>
            <Button type="submit" variant="success">
              New Proposal
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
    </>
  );
};
export default AddWhitelist;
