import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import "./loader.css";

export const Loader = ({ loadInformation }) => {
    return (<Flex flexDirection="column" width="100vw" height="100vh" position="absolute" top="0" left="0" p={0} m={0} bg="rgba(0,0,0,0.6)" justify="center" alignItems="center" gap="20px">
        <Heading textAlign={"center"}>{loadInformation}</Heading>
        <span className="loader"></span>
    </Flex>)
}