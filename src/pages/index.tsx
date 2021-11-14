import { Link } from "@chakra-ui/layout";
import { Layout } from "../components/Layout";
import { PostsQuery, usePostsQuery } from "../generated/graphql";
import NextLink from "next/link";
import React from "react";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { UpdootSection } from "../components/UpdootSection";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 2, cursor: null },
    notifyOnNetworkStatusChange: true,
  });
  if (!loading && !data) {
    return <div>you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
      </Flex>
      <Stack spacing={8}>
        {!data && loading
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
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                // updateQuery: (
                //   previousValue,
                //   { fetchMoreResult }
                // ): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as PostsQuery;
                //   }
                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                //       posts: [
                //         ...previousValue.posts.posts,
                //         ...fetchMoreResult.posts.posts,
                //       ],
                //     },
                //   };
                // },
              });
            }}
            isLoading={loading}
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

export default withApollo({ ssr: true })(Index);
