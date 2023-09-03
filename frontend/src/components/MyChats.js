import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./chat/ChatLoading";
import { getSenderName } from "../config/chatFunctions";
import GroupChatModal from "./chat/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error fetching the chats!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection='column'
      width={{ base: "100%", md: "33%" }}
      bg='white'
      alignItems='center'
      borderRadius='lg'
      borderWidth='1px'
      p={3}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        width='100%'
        alignItems='center'
        fontSize={{ base: "20px", md: "24px" }}
        fontFamily='Work Sans'
        pb={3}
        px={3}
      >
        My Chats
        <GroupChatModal>
          <Button
            display='flex'
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        width='100%'
        height='100%'
        overflowY='hidden'
        p={3}
        borderRadius='lg'
        bg='#F8F8F8'
      >
        {chats.length ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                px={3}
                py={2}
                cursor='pointer'
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
              >
                <Text>
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSenderName(loggedUser, chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
