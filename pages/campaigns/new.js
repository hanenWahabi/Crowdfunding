import React, { useState } from "react";
import { Button, Form, Input, Label, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";

const CampaignNew = () => {
  const [minimun, setMinimum] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimun).send({ from: accounts[0] }); //from current user account
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <h2 className="title">Create a Campaign</h2>
      <Form onSubmit={onSubmit} error={errorMessage.length > 0}>
        <Form.Field>
          <Label
            as="a"
            ribbon="left"
            style={{
              borderColor: "hsl(215, 32%, 35%) !important",
              backgroundColor: "rgb(31 51 79) !important",
              color: "#ffffff9c",
              fontWeight: "300",
            }}
          >
            Minimum Contribution
          </Label>
          <Input
            label="wei"
            labelPosition="right"
            labe
            value={minimun}
            onChange={(e) => {
              setMinimum(e.target.value);
            }}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button loading={loading} className="custom-button">
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
