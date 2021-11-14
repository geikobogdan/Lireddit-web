import { Link } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import React, { useState } from "react";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { UpdootSection } from "../components/UpdootSection";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
      </Flex>
      <Stack spacing={8}>
        {!data && fetching
          ? "...loading"
          : data!.posts.posts.map(
              (p) =>
                p && (
                  <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                    <UpdootSection post={p} />
                    <Box flex={1}>
                      <NextLink href="post/[id]" as={`post/${p.id}`}>
                        <Link>
                          <Heading fontSize="xl">{p.title}</Heading>
                        </Link>
                      </NextLink>
                      <Text>posted by {p.creator.username}</Text>
                      <Flex
                        flex={1}
                        align="center"
                        justifyContent="space-between"
                      >
                        <Text>{p.textSnippet}</Text>
                        <Box ml="auto">
                          <EditDeletePostButtons
                            id={p.id}
                            creatorId={p.creatorId}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                )
            )}
      </Stack>
      {data && data.posts.hasMore && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                ...variables,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
