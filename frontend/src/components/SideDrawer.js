import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [loadingChat, setLoadingChat] = useState();
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const goButtonHandler = async () => {
    setLoading(true);

    if (!search) {
      toast({
        title: "Enter name or Email to search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
      return;
    }

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
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const accessChat = async (id) => {
    setLoadingChat(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId: id }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(chats);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chats!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        width='100%'
        display='flex'
        justifyContent='space-between'
        bg='white'
        alignItems='center'
        p='5px 10px'
        borderWidth='5px'
      >
        <Tooltip label='search user to chat' hasArrow placement='bottom-end'>
          <Button variant={"ghost"} ref={btnRef} onClick={onOpen}>
            <i className='fas fa-sharp fa-light fa-magnifying-glass fa-beat-fade'></i>
            <Text
              display={{ base: "none", md: "flex" }}
              px='4'
              fontFamily='Work Sans'
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work Sans'>
          Live Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p='1'>
              <BellIcon fontSize='2xl' m='1' />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                cursor='pointer'
                size='sm'
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Search User</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or Email'
                mr={1}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={goButtonHandler}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult &&
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleAccess={() => accessChat(user._id)}
                  />
                );
              })
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {loadingChat && <Spinner size='lg' color='blue' />}
    </>
  );
};

export default SideDrawer;
