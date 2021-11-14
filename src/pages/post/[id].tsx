import { Box, Heading } from "@chakra-ui/layout";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post: NextPage<{}> = ({}) => {
  const [{ data, fetching, error }] = useGetPostFromUrl();
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }
  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }
  return (
    <Layout>
      <Box mb={5}>
        <Heading mb={4}> {data.post.title}</Heading>
        {data.post.text}
      </Box>
      <EditDeletePostButtons
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
