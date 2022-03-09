import * as React from "react";
import { Box, HStack, Center, Link, VStack } from "@chakra-ui/react";
import { Link as routerLink , useHistory} from 'react-router-dom'

type AppPage = {
  children: React.ReactNode
};

const AppPage = ({ children }:AppPage) => {
  const history = useHistory()
  const {location} = history
  console.log(location, '==== history')
  return (
    <HStack >
      <Box position='relative' w='175px' boxShadow='2xl'>
        {/* MenuItems are not rendered unless Menu is open */}
        <VStack spacing="12px" p={8}>
          <Center fontSize={14}>
            <Link as={routerLink} to="/app/trade">
              DEPOSIT/WITHDRAW
              </Link>
          </Center>
          <Center >
            <Link as={routerLink} to="/app/invest">
              INVEST
              </Link>
          </Center>
          <Center >
            <Link as={routerLink} to="/app/pool">
              POOL
              </Link>
          </Center>
          <Center >
            <Link as={routerLink} to="/app/dashboard">
              DASHBOARD
              </Link>
          </Center>
        </VStack>
      </Box>
      <Box>
        {children}
      </Box>
    </HStack>
  );
};

export default AppPage