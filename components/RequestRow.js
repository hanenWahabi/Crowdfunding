import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

const RequestRow = ({ request, key, id, address, numContributors }) => {
  const { Row, Cell } = Table;
  const readyToFinalize = request.approvalCount > numContributors / 2;

  const onApprove = async () => {
    const campaign = new Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({ from: accounts[0] });
  };
  const onFinalize = async () => {
    const campaign = new Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
  };
  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
      // style={{ background: "#e0eaf4 !important", color: "#14253d !important" }}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell className="address-cell">{request.recipient}</Cell>
      <Cell>
        {request.approvalCount} / {numContributors}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button
            className="approve-button"
            style={{
              boxShadow: "0 0 0 1px rgb(4 219 212) inset !important",
              color: "rgb(4 219 212) !important",
            }}
            basic
            onClick={onApprove}
          >
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button color="red" basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};
export default RequestRow;
