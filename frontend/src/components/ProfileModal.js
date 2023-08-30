import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        ></IconButton>
      )}

      <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height='410px'>
          <ModalHeader
            fontSize='40px'
            display='flex'
            justifyContent='center'
            fontFamily='Work Sans'
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            flexDirection='column'
          >
            <Image
              borderRadius='full'
              boxSize='150px'
              src={user.picture}
              alt={user.name}
            ></Image>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily='Work Sans'
            >
              Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
