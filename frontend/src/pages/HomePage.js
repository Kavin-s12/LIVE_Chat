import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW='xl' centerContent>
      <Box
        display='flex'
        width='100%'
        bg={"white"}
        p={4}
        m='40px 0 15px 0'
        justifyContent='center'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text fontSize='4xl' fontFamily='Work Sans'>
          Live Chat
        </Text>
      </Box>
      <Box width='100%' bg={"white"} p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs isFitted variant='enclosed'>
          <TabList mb='1em'>
            <Tab>Login</Tab>
            <Tab>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
