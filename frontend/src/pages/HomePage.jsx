import { Box, Heading, Image, Text } from "@chakra-ui/react";
// import { Navbar } from "../components/Homepage/Nevbar";
import note from "../assets/note.png";

export default function Homepage() {
  return (
    <Box padding={8}>
      <Image position={"absolute"} right={0} w={500} src={note} />
      <Heading mt={16} textAlign={"start"} size={"4xl"}>
        Note App
      </Heading>
      <Text mt={8} maxW={"50%"} textAlign={"justify"}>
        A note application is a software program that allows users to create,
        organize, and manage their digital notes. It is an essential tool for
        anyone looking to streamline their daily tasks, increase productivity.
      </Text>
    </Box>
  );
}
