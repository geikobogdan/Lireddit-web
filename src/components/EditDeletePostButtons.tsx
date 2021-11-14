import React from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}
export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();
  if (creatorId === meData?.me?.id) {
    return (
      <Box>
        <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
          <IconButton as={Link} aria-label="edit" icon={<EditIcon />} />
        </NextLink>
        <IconButton
          onClick={() => {
            deletePost({ id });
          }}
          color="red"
          aria-label="delete"
          icon={<DeleteIcon />}
        />
      </Box>
    );
  }
  return <></>;
};
