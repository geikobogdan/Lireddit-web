import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toErrorMap } from "../../utils/toErrorMap";
import { Wrapper } from "../../components/Wrapper";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/button";
import { InputField } from "../../components/InputField";
import { MeDocument, MeQuery, useChangePasswordMutation } from "../../generated/graphql";
import { Box, Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage<{}> = ({}) => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokkenError, setTokkenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              ...values,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokkenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New password"
              type="password"
            />
            {tokkenError && (
              <Flex>
                <Box mr="2" style={{ color: "red" }}>
                  {tokkenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            )}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
