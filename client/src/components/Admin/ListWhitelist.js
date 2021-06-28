import React from "react";
import { useSelector } from "react-redux";
import { ListGroup, Table } from "react-bootstrap";

const ListWhitelist = () => {
  const whitelistedAddresses = useSelector(
    (state) => state.contract.whitelistedList
  );

  const renderWhitelisted = () => {
    return whitelistedAddresses.map((address) => {
      return (
        <tr key={address}>
          <td>{address}</td>
        </tr>
      );
    });
  };
  return (
    <ListGroup variant="flush">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              Addresses already whitelisted : {whitelistedAddresses.length}
            </th>
          </tr>
        </thead>
        <tbody>{renderWhitelisted()}</tbody>
      </Table>
    </ListGroup>
  );
};

export default ListWhitelist;
