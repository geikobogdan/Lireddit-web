import { Box, Heading } from "@chakra-ui/layout";
import { NextPage } from "next";
import { withApollo } from "../../utils/withApollo";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post: NextPage<{}> = ({}) => {
  const { data, loading, error } = useGetPostFromUrl();
  if (loading) {
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
export default withApollo({ ssr: true })(Post);
