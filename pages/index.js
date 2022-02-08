import React from "react";
import { Button, Grid } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.png";

const CampaignIndex = ({ campaigns }) => {
  const router = useRouter();
  const renderCampaigns = () => {
    return (
      <Grid columns="equal">
        {campaigns.map((address, index) => {
          return (
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <div className="card">
                <Image
                  src={index % 2 == 0 ? img1 : img2}
                  alt=""
                  className="card-image"
                />
                <h2 className="card-title">Campaign #{index + 1}</h2>
                <p className="card-address">{address}</p>
                <a className="card-link" href={`/campaigns/${address}`}>
                  View Campaign
                </a>
              </div>
            </Grid.Column>
          );
        })}
      </Grid>
    );
  };
  return (
    <Layout>
      <div className="row">
        <h3>Open Campains</h3>
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          onClick={() => router.push("/campaigns/new")}
          className="custom-button"
        />
      </div>
      {renderCampaigns()}
    </Layout>
  );
};

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getAllDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;
