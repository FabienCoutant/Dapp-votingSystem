import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../hooks/useContract";
import { addWhitelistAddress } from "../../states/contract/contractSlice";

const AddWhitelist = () => {
  const { account } = useWeb3React();
  const contract = useContract();
  const dispatch = useDispatch();
  const whitelistedAddresses = useSelector(
    (state) => state.contract.whitelistedList
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (contract !== null) {
      contract.events.VoterRegistered().on("data", ({ returnValues }) => {
        const newWhitelist = returnValues["voterAddress"];
        if (!whitelistedAddresses.includes(newWhitelist)) {
          const isAlsoOwner = newWhitelist === account;
          dispatch(addWhitelistAddress({ newWhitelist, isAlsoOwner }));
        }
      });
    }
  }, [contract]);

  const addWhitelist = async (event) => {
    event.preventDefault();
    const address = event.target.address.value;
    if (!whitelistedAddresses.includes(address)) {
      setError("");
      await contract.methods.addNewVoter(address).send({ from: account });
    } else setError(`${address} is already whitelisted`);
  };

  return (
    <>
      {error !== "" && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={addWhitelist}>
        <Row>
          <Col>
            <Form.Control type="text" id="address" placeholder="@" />
          </Col>
          <Col>
            <Button type="submit" variant="success">
              Whitelist
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
    </>
  );
};
export default AddWhitelist;
