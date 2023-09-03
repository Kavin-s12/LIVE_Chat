import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadge = ({ user, handleDelete }) => {
  return (
    <Box
      px={2}
      py={1}
      m={1}
      variant='solid'
      fontSize={12}
      borderRadius={"lg"}
      cursor='pointer'
      backgroundColor='purple'
      color='white'
      onClick={handleDelete}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadge;
