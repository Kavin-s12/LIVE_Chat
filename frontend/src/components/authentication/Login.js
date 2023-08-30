import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <VStack>
      <FormControl id='emailLogin' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          type='email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='passwordLogin' isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          placeholder='Enter your password'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      <Button
        width='100%'
        colorScheme='blue'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
