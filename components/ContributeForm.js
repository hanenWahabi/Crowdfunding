import React, { useState } from "react";
import { Form, Message, Input, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { useRouter } from "next/router";

const ContributeForm = ({ campaignAddress }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const campaign = Campaign(campaignAddress);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });
      router.replace(`/campaigns/${campaignAddress}`);
    } catch (error) {
      setErrorMessage(error.message);
      setValue("");
    }
    setLoading(false);
  };
  return (
    <Form onSubmit={onSubmit} error={errorMessage.length > 0}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          value={value}
          label="ether"
          labelPosition="right"
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button loading={loading} className="custom-button">
        Contribute!
      </Button>
    </Form>
  );
};

export default ContributeForm;
