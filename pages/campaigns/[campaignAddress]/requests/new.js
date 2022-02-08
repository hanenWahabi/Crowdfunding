import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";
import Image from "next/image";
import arrow from "../../../../images/back.svg";

const newRequest = () => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { campaignAddress } = router.query;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    const campaign = Campaign(campaignAddress);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] });
      router.push(`/campaigns/${campaignAddress}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <Link href={`/campaigns/${campaignAddress}/requests`}>
        <div className="back">
          <Image src={arrow} alt="Back" />
          <p>Back</p>
        </div>
      </Link>
      <h3> Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label className="request-label">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label className="request-label">Value in Ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label className="request-label">Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
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

export default newRequest;
