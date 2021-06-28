import React from "react";
import { Navbar } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import truncateWalletAddress from "../../utils/truncateWalletAddress";
import { useIsOwner } from "../../states/contract/hooks";
import { useSelector } from "react-redux";
import { WorflowStatusName } from "../../constants";

export default function Header() {
  const { account } = useWeb3React();
  const isWhitelisted = useSelector(
    (state) => state.contract.userVoterData.isRegistered
  );
  const isOwner = useIsOwner();
  const workflowStatus = useSelector((state) => state.contract.status);

  const renderRole = () => {
    if (isOwner && isWhitelisted) {
      return `Admin & Whitelisted`;
    } else if (isOwner) {
      return `Admin`;
    } else if (isWhitelisted) {
      return `Whitelisted`;
    }
    return `Nobody`;
  };
  const renderAddress = () => {
    if (account !== undefined) {
      return `Address : ${truncateWalletAddress(account)}`;
    }
    return `Address : Loading...`;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand style={{ paddingLeft: "48px" }}>Voting System - Only on Ropsten network</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          Your Role is : {renderRole()} | Current Workflow Status :{" "}
          {WorflowStatusName[workflowStatus]}
        </Navbar.Text>
      </Navbar.Collapse>
      <Navbar.Collapse
        className="justify-content-end"
        style={{ paddingRight: "48px" }}
      >
        <Navbar.Text>{renderAddress()}</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}
