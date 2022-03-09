import * as React from "react";

import { Flex, Spacer, Text, Image, HStack, Center, Link } from "@chakra-ui/react";
import { imgs } from '../../assets'
// TODO media links
type FooterProps = {};

const Footer = (props: FooterProps) => {
  return (
    <Flex w='100%' h='97px' bgColor="black" color='white'>
      <Center minW='500px'>
        <Text>
          © 2022 Skyrim Finance
      </Text>
      </Center>
      <Spacer />
      <Center>
        <HStack minW='330px' p={8} w="120px" spacing="20px">
          <Link ml={6} href="https://skyrimfinance.medium.com/"><Image h="20px" src={imgs.medium} /></Link>
        </HStack>
      </Center>

    </Flex>
  );
};

export default Footer