import React, { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Spacer, Heading, Button, Link, Center, Text, VStack, HStack, useMediaQuery, SimpleGrid, Image, Divider } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
import HomePage from '../../layout/homePage'
import { imgs } from '../../assets'
import { Link as RouterLink } from 'react-router-dom'

export default function Home() {
  const history = useHistory()
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)")
  const headerFontStyle = isLargerThan1280 ? '5xl' : '3xl'
  return (
    <HomePage >
      <Box color="white" h="810px" p={4} backgroundImage={`url(${imgs.headBg})`} backgroundRepeat="no-repeat" backgroundSize={isLargerThan1280 ? "100%" : "auto"} backgroundPosition="right">
        <Flex>
          <Center>
            {/* <Image h="33px" ml={{ sm: 2, xl: "90px" }} src={imgs.logo} objectFit="cover" /> */}
            <Image w="233px" src={imgs.logo} />
          </Center>
          <Spacer />
          {isLargerThan1280 && <Flex width="40%">
            <Flex fontSize={14} p={3} w="60%">
              <Link href="https://coinmarketcap.com/currencies/skyrim-finance/">Token</Link>
              <Spacer />
              <Link href="https://docs.skyrim.finance/">Docs</Link>
              <Spacer />
            </Flex>
            <Button ml={8} w="128px" h="48px" color="primary" borderColor="primary" variant="outline" borderRadius="3xl" onClick={() => history.push('/app')}>Launch App</Button>
          </Flex>}
        </Flex>
        <Center h="650px" >
          <VStack pt={12}>
            <Text fontSize={42} p={6} mb={8} fontWeight={400}>
              A Decentralized Structured Finance Platform
        </Text>
            <Button w="240px" h="50px" bgColor="primary" color="white" borderRadius="3xl" onClick={() => history.push('/app')}>Go to APP</Button>
          </VStack>
        </Center>
      </Box>

      <Center p={8} minH="400px" backgroundImage={`url(${imgs.descBg})`} backgroundRepeat="no-repeat" backgroundSize={isLargerThan1280 ? "100%" : "auto"} backgroundPosition="right">
        <VStack color="black" w="70%" p={4}>
          <Image h="142px" src={imgs.logoBlack} objectFit="cover" />
          <Text fontSize={18} color="text">Skyrim aims to build a Decentralized Structured Finance Platform. The DeFi ecosystem is getting growth rapidly and more interest rate (APY or Yield) products are emerging in the market. We believe that the structured finance market will become one of the biggest DeFi markets in the future.</Text>
        </VStack>
      </Center>
      {/* Roles */}
      <Center px={{ lg: 24, md: 8, sm: 2 }} py={8} color="white" minH="610px" backgroundImage={`url(${imgs.rolesBg})`} backgroundRepeat="no-repeat" backgroundSize={isLargerThan1280 ? "100%" : "auto"} backgroundPosition="right" >
        <VStack pos="relative">
          <Box mb={20}>
            <Text fontSize={headerFontStyle} fontWeight={600}>
              TRANCHE ROLES
          </Text>
            {isLargerThan1280 && <Image pos="absolute" top="30px" right="-90px" h="12px" src={imgs.titleRight} objectFit="cover" />}
          </Box>
          <SimpleGrid
            columns={{ sm: 1, md: 3 }}
            spacing="4" >
            <Center bgColor="cardBg" >
              <VStack px={12} pb={4} spacing={2}>
                <Image src={imgs.cardHead} />
                <Divider borderColor="transparent" h="20px" />
                <Image w="65px" src={imgs.roleMaker} />
                <Text fontSize="24px" fontWeight={600}>
                  Be a Market Maker
                </Text>
                <Text textAlign="center" fontSize="14px" fontWeight={600}>
                  Minting and then providing liquidity for both SENIOR and JUNIOR makes you a market maker
                </Text>
              </VStack>
            </Center>
            <Center bgColor="cardBg" >
              <VStack px={12} spacing={2} pb={4}>
                <Image src={imgs.cardHead} />
                <Divider borderColor="transparent" h="20px" />
                <Image w="65px" src={imgs.roleSenior} />
                <Text fontSize="24px" fontWeight={600}>
                  Be a Senior Investor
                </Text>
                <Text textAlign="center" fontSize="14px" fontWeight={600}>
                  Minting and then providing liquidity for SENIOR token but selling the JUNIOR token makes you a SENIOR token liquidity provider.                </Text>
              </VStack>
            </Center>
            <Center bgColor="cardBg" >
              <VStack px={12} spacing={2} pb={4}>
                <Image src={imgs.cardHead} />
                <Divider borderColor="transparent" h="20px" />
                <Image w="65px" src={imgs.roleJunior} />
                <Text fontSize="24px" fontWeight={600}>
                  Be a Junior Investor                </Text>
                <Text textAlign="center" fontSize="14px" fontWeight={600}>
                  Minting and then providing liquidity for JUNIOR token but selling the SENIOR token makes you a JUNIOR token liquidity provider                </Text>
              </VStack>
            </Center>
          </SimpleGrid>
        </VStack>

      </Center>
      {/* features */}
      <Center id="feature" px={{ lg: 24, md: 8, sm: 2 }} color="white" py={8} minH="800px" backgroundImage={`url(${imgs.featBg})`} backgroundRepeat="no-repeat" backgroundSize={isLargerThan1280 ? "100%" : "auto"} backgroundPosition="right" >
        <VStack pos="relative">
          <Box mb={20}>
            <Text fontSize={headerFontStyle} fontWeight={600}>
              TRANCHE FEATURES
          </Text>
            {isLargerThan1280 && <Image pos="absolute" top="30px" left="-90px" h="10px" src={imgs.titleLeft} objectFit="cover" />}
          </Box>
          <SimpleGrid
            columns={{ sm: 1, md: 3 }}
            spacing="8" >
            <Center minH="450px" bgGradient="linear-gradient(180deg, rgba(36, 37, 44, 0) 0%, #24252C 100%)" >
              <VStack px={6} py={16} spacing={2}>
                <Image w="150px" src={imgs.featDec} />
                <Text fontSize="24px" fontWeight={600}>
                  Decentralized
                  </Text>
                <Text textAlign="center" fontSize="14px" fontWeight={600}>
                  Skyrim is managed by a decentralized community of token holders and their delegates.
                </Text>
              </VStack>
            </Center>
            <Center minH="450px" bgGradient="linear-gradient(180deg, rgba(36, 37, 44, 0) 0%, #24252C 100%)" >
              <VStack px={6} py={16} spacing={2}>
                <Image w="150px" src={imgs.featEff} />
                <Text fontSize="24px" fontWeight={600}>
                  Market Efficient
                </Text>
                <Text textAlign="center" fontSize="14px" fontWeight={600}>
                  The expected interest rate is tradable and decided by the free market of demand.
                </Text>
              </VStack>
            </Center>
            <Center minH="450px" bgGradient="linear-gradient(180deg, rgba(36, 37, 44, 0) 0%, #24252C 100%)" >
              <VStack px={6} py={16} spacing={2} >
                <Image w="150px" src={imgs.featLim} />
                <Text fontSize="24px" fontWeight={600}>
                  Limitless               </Text>
                <Text textAlign="center" fontSize="14px" fontWeight={600}>
                  Skyrim can launch a basket of different interest rate products as a combination.                       </Text>
              </VStack>
            </Center>
          </SimpleGrid>
        </VStack>

      </Center>

      {/* Token */}
      <Center id="token" px={{ lg: 24, md: 8, sm: 2 }} color="white" py={8} minH="800px" backgroundImage={`url(${imgs.tokenBg})`} backgroundRepeat="no-repeat" backgroundSize={isLargerThan1280 ? "100%" : "auto"} backgroundPosition="right" >
        <VStack pos="relative">
          <Box mb={20}>
            <Text fontSize={headerFontStyle} fontWeight={600}>
              TRANCHE TOKEN
          </Text>
            {isLargerThan1280 && <Image pos="absolute" top="30px" right="-90px" h="12px" src={imgs.titleRight} objectFit="cover" />}
          </Box>
          <SimpleGrid
            columns={{ sm: 1, md: 2 }}
            spacing="8" >
            <Center h="250px" bgColor="cardBg" >
              <HStack p={12} spacing={8}>
                <Box textAlign="left">
                  <Text mb={4} fontSize="28px" fontWeight={500}>
                    Governance
                  </Text>
                  <Text fontSize="14px" fontWeight={600}>
                    Token holders and delegates can propose and vote on upgrades.
                  </Text>
                </Box>
                {isLargerThan1280 && <Image w="140px" src={imgs.tokenGov} />}
              </HStack>
            </Center>
            <Center h="250px" bgColor="cardBg" >
              <HStack p={12} spacing={8}>
                <Box textAlign="left">
                  <Text mb={4} fontSize="28px" fontWeight={500}>
                    Rate Mining
                  </Text>
                  <Text fontSize="14px" fontWeight={600}>
                    Rewards for market making minting of two fungible tokens.
                                    </Text>
                </Box>
                {isLargerThan1280 && <Image w="140px" src={imgs.tokenRate} />}
              </HStack>
            </Center>
            <Center h="250px" bgColor="cardBg" >
              <HStack p={12} spacing={8}>
                <Box textAlign="left">
                  <Text mb={4} fontSize="28px" fontWeight={500}>
                    Liquidity Mining
                  </Text>
                  <Text fontSize="14px" fontWeight={600}>
                    Rewards for creating and adding liquidity in Uniswap Pools.
                   </Text>
                </Box>
                {isLargerThan1280 && <Image w="140px" src={imgs.tokenMining} />}
              </HStack>
            </Center>
            <Center h="250px" bgColor="cardBg" >
              <HStack p={12} spacing={8}>
                <Box textAlign="left">
                  <Text mb={4} fontSize="28px" fontWeight={500}>
                    Premium Earn
                  </Text>
                  <Text fontSize="14px" fontWeight={600}>
                    Token holders can have exclusive access to premium products.
                  </Text>
                </Box>
                {isLargerThan1280 && <Image w="140px" src={imgs.featDec} />}
              </HStack>
            </Center>
          </SimpleGrid>
        </VStack>

      </Center>

      <Divider />
      <Center h="80px">
        <SimpleGrid
          w="90%"
          columns={{ sm: 1, md: 2 }}
          mx={16}
          spacing={24}
          p={4} >
          <Text fontSize="12px" color="#ACAFC4">
            ©2022 Skyrim Finance.
          </Text>
        </SimpleGrid>
      </Center>
    </HomePage>
  )
}
