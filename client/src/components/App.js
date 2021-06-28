import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEagerConnect, useInactiveListener } from "../hooks/web3";
import {
  useFetchOwner,
  useFetchWhitelistedAddr,
  useFetchWorkflowStatus,
  useIsOwner,
  useUserData,
} from "../states/contract/hooks";
import { Container } from "react-bootstrap";

import Admin from "./Admin";
import Header from "./Header";
import Proposal from "./Proposal";

const App = () => {
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager);
  useFetchOwner();
  useFetchWhitelistedAddr();
  useFetchWorkflowStatus();
  useUserData();
  const isOwner = useIsOwner();
  return (
    <>
      <Header />
      <Container style={{ marginTop: "24px" }}>
        {isOwner && <Admin />}
        <Proposal />
      </Container>
    </>
  );
};
export default App;
