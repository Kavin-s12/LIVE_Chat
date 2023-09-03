import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems='center'
      flexDirection='column'
      width={{ base: "100%", md: "66%" }}
      background='white'
      borderRadius='lg'
      borderWidth='1px'
      p={3}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
