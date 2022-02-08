import React, { useState } from "react";
import { Button, Table } from "semantic-ui-react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";
import Link from "next/link";
import Image from "next/image";
import arrow from "../../../../images/back.svg";

const Requests = ({
  campaignAddress,
  requests,
  requestCount,
  numContributors,
}) => {
  const router = useRouter();
  const { Header, HeaderCell, Row, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => (
      <RequestRow
        request={request}
        key={index}
        id={index}
        address={campaignAddress}
        numContributors={numContributors}
      />
    ));
  };
  return (
    <Layout>
      <Link href={`/campaigns/${campaignAddress}`}>
        <div className="back">
          <Image src={arrow} alt="Back" />
          <p>Back</p>
        </div>
      </Link>

      <div className="row">
        <h3>Requests</h3>
        <Button
          onClick={() =>
            router.push(`/campaigns/${campaignAddress}/requests/new`)
          }
          floated="right"
          className="custom-button"
        >
          Add Request
        </Button>
      </div>
      <Table celled selectable>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count </HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <p className="request-count"> Found {requestCount} requests</p>
    </Layout>
  );
};

Requests.getInitialProps = async (props) => {
  const campaignAddress = props.query.campaignAddress;
  const campaign = Campaign(props.query.campaignAddress);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const numContributors = await campaign.methods.numContributors().call();
  //we cannot get all requests in one
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill() //create an array item and fill it
      .map((element, index) => {
        //value of item
        return campaign.methods.requests(index).call();
      })
  );
  return { campaignAddress, requests, requestCount, numContributors };
};
export default Requests;
