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
import { ChatState } from "../../context/ChatProvider";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please enter details in all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    setLoading(false);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, picture },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);

      toast({
        title: "Registration successful",
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
  };

  const postPic = async (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (
      pic.type === "image/png" ||
      pic.type === "image/jpeg" ||
      pic.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "live-chat");
      data.append("cloud_name", "dfbvgtdcz");
      await fetch("https://api.cloudinary.com/v1_1/dfbvgtdcz/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          console.log("picture", data.url.toString());
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image from proper fromat.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    setLoading(false);
  };
  console.log(picture);

  return (
    <VStack spacing='5px'>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter your name'
          type='text'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          type='email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <Input
          placeholder='Enter your password'
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id='confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          placeholder='Re-Enter your password'
          type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id='picture' isRequired>
        <FormLabel>Profile Picture</FormLabel>
        <Input
          placeholder='Upload your picture'
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postPic(e.target.files[0])}
        />

        <Button
          width='100%'
          colorScheme='blue'
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </FormControl>
    </VStack>
  );
};

export default SignUp;
