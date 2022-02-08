import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

const CampaignShow = ({
  campaignAddress,
  minContribution,
  balance,
  numRequests,
  numContributors,
  manager,
}) => {
  const router = useRouter();
  // const { campaignAddress } = router.query;
  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw this money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: `${minContribution} wei`,
        meta: "Minimum Contribution",
        description:
          "The minimum amount to contribute to this campaign in wei to become an approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: `${balance} wei = ${web3.utils.fromWei(balance, "ether")} eth`,
        meta: "Camapaign Balance",
        description: "How much money this campaign has left to spend",
        style: { overflowWrap: "break-word" },
      },
      {
        header: numRequests,
        meta: "Number of requests",
        description:
          "A request tries to withdraw money from the account. Requests must be approved by a minimum 50% of approvers",
        style: { overflowWrap: "break-word" },
      },
      {
        header: numContributors,
        meta: "Number of Approvers",
        description:
          "The number of approvers that have already contributed to this campaign",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} className="campain-details" />;
  };
  return (
    <Layout>
      <h3 style={{ margin: "0" }}>Campain Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} computer={12}>
            {renderCards()}
          </Grid.Column>
          <Grid.Column mobile={16} computer={4}>
            <ContributeForm campaignAddress={campaignAddress} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Button
        onClick={() => router.push(`/campaigns/${campaignAddress}/requests`)}
        className="custom-button"
      >
        View Requests
      </Button>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (props) => {
  const address = props.query.campaignAddress; //from url
  const campaign = Campaign(address);
  //getCampaignDetails in contract returns multi alues => we will receive i as an object
  const summary = await campaign.methods.getCampaignDetails().call();
  return {
    campaignAddress: address,
    minContribution: summary[0],
    balance: summary[1],
    numRequests: summary[2],
    numContributors: summary[3],
    manager: summary[4],
  };
};

export default CampaignShow;
