import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "../listing_User/UserListItem";
import UserBadge from "../listing_User/UserBadge";

const GroupChatModal = ({ children }) => {
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const searchHandler = async (query) => {
    setSearch(query);

    if (!query) {
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupName || !selectedUsers.length) {
      toast({
        title: "Please enter all details",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Created Group",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const addUser = (user) => {
    if (selectedUsers.includes(user)) {
      toast({
        title: "User already added!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
  };

  const deleteUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display='flex'
            justifyContent='center'
            fontSize='36px'
            fontFamily='Work Sans'
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDirection='column' alignItems='center'>
            <FormControl>
              <Input
                placeholder='Enter Group name'
                onChange={(e) => setGroupName(e.target.value)}
                mb={3}
              />
              <Input
                placeholder='Search users'
                onChange={(e) => searchHandler(e.target.value)}
                mb={1}
              />

              <Box display={"flex"} flexWrap={"wrap"}>
                {selectedUsers?.map((user) => (
                  <UserBadge
                    key={user._id}
                    user={user}
                    handleDelete={() => deleteUser(user)}
                  />
                ))}
              </Box>

              {loading ? (
                <Spinner size='lg' display='flex' alignItems='center' />
              ) : (
                searchResult?.slice(0, 4).map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleAccess={() => addUser(user)}
                    />
                  );
                })
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
