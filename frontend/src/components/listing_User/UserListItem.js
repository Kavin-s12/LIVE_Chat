import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleAccess }) => {
  const { name, email, picture } = user;
  return (
    <Box
      display='flex'
      width='100%'
      alignItems='center'
      onClick={handleAccess}
      cursor='pointer'
      background='#E8E8E8'
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      px={3}
      py={2}
      mb={2}
      borderRadius='lg'
    >
      <Avatar mr={2} cursor='pointer' size='sm' name={name} src={picture} />
      <Box>
        <Text>{name}</Text>
        <Text fontSize='xs'>
          <b>Email : </b>
          {email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
