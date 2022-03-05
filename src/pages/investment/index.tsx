import React, { useCallback, useEffect, useState } from "react"
import {
  Center,
  Box,
  VStack,
  Button,
  Text,
  Divider,
  Spacer,
  Flex,
  useDisclosure,
} from "@chakra-ui/react"
import { t } from "../../i18n"
import ConvertModal from "../../components/Modals/ConvertModal"
import { mainApi, stakePoolApi, uniPoolApi, tokenApi } from "../../utils/api"
import { formatBalance, getTokenContract } from "../../utils"
import store from "../../stores/account"

export default function Investment() {
  const contentHigh = document.documentElement.clientHeight - 80 - 81 - 97
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [type, setType] = useState("")
  const [bals, setBals] = useState({
    totalInvest: "0",
    tvl: "0",
    apyST: 0,
    apyJT: 0,
  })

  const mainPoolApi = mainApi()
  const { address, signer } = store.useState("address", "signer")
  const stToken = tokenApi("senior")
  const jtToken = tokenApi("junior")
  const traToken = tokenApi("tra")
  const stPool = uniPoolApi("senior")
  const jtPool = uniPoolApi("junior")
  const traPool = uniPoolApi("tra")
  const stStakePool = stakePoolApi("senior", signer)
  const jtStakePool = stakePoolApi("junior", signer)
  const traStakePool = stakePoolApi("tra", signer)

  const fetchData = async () => {
    if (!mainPoolApi) return

    if (
      !(
        stToken &&
        jtToken &&
        traToken &&
        stPool &&
        jtPool &&
        traPool &&
        stStakePool &&
        jtStakePool &&
        traStakePool
      )
    ) {
      return
    }

    console.log("fetch and refresh")
    if (!address) return
    const totalInvest = await mainPoolApi.totalInvest()
    const apyST = await mainPoolApi.getAPY("senior")
    const apyJT = await mainPoolApi.getAPY("junior")
    const stBal = await stToken.totalSupply()
    const jtBal = await jtToken.totalSupply()
    const traBal = await traToken.totalSupply()
    // const st = await stPool.totalSupply()
    // const jt = await jtPool.totalSupply()
    // const tra = await traPool.totalSupply()
    const lock =
      Number(formatBalance(stBal)) +
      Number(formatBalance(jtBal)) +
      Number(formatBalance(traBal))
    const stStake = await stStakePool.totalSupply()
    const jtStake = await jtStakePool.totalSupply()
    const traStake = await traStakePool.totalSupply()
    const stakeLock =
      Number(formatBalance(stStake)) +
      Number(formatBalance(jtStake)) +
      Number(formatBalance(traStake))
    console.log(lock, stakeLock, "tvl=====")
    setBals({
      totalInvest: formatBalance(totalInvest),
      tvl: lock + stakeLock + "",
      apyST: apyST.toNumber(2),
      apyJT: apyJT.toNumber(2),
    })
  }

  useEffect(() => {
    fetchData()
  }, [address])

  let modalProps = {
    isOpen,
    onOpen,
    onClose,
  }

  const openModal = (type: string) => {
    setType(type)
    modalProps.onOpen()
  }

  return (
    <VStack h={contentHigh} bgColor="contentBg" px="88px" pt="24px">
      <VStack width="100%" minH="587px" p="24px" bgColor="white">
        <Box width="100%" mb="25px">
          <Text fontSize={34} fontWeight={600} color="textHead">
            Risk Combo
          </Text>
          <Box color="textDesc" fontSize="14px">
            <Text>Safely earn free, passive income from your idle assets</Text>
          </Box>
        </Box>
        <Divider />
        <Flex width="100%" height="200px" color="textHead" p={12}>
          <Box textAlign="center">
            <Text fontSize="42px" fontWeight="bold">
              {bals.apyST / 10000}%
            </Text>
            <Text fontSize="12px">senior investor APY</Text>
          </Box>
          <Spacer />
          <Divider orientation="vertical" />
          <Spacer />
          <Box textAlign="center">
            <Text fontSize="42px" fontWeight="bold">
              {bals.apyJT / 10000}%
            </Text>
            <Text fontSize="12px">junior investor APY</Text>
          </Box>
          <Spacer />
          <Divider orientation="vertical" />
          <Spacer />
          <Box textAlign="center">
            <Text fontSize="42px" fontWeight="bold">
              ${bals.totalInvest}
            </Text>
            <Text fontSize="12px">Total value locked</Text>
          </Box>
          <Spacer />
          <Divider orientation="vertical" />
          <Spacer />
          <Box textAlign="center">
            <Center></Center>
            <Text fontSize="12px">Compound+Uniswap+1inch</Text>
          </Box>
        </Flex>
        <Divider />
        <Box width="100%" p="24px">
          <Text fontSize={22} fontWeight={600}>
            Investment Dai can directly obtain senior investor + senior investor
          </Text>
          <Text fontSize={14} color="textDesc">
            Holding senior token or investor token can get interest reward every
            day, and adding liquidity can get combo token
          </Text>
          <Center>
            <Button
              mr={8}
              w="280px"
              h="60px"
              mt="50px"
              colorScheme="grass"
              color="white"
              onClick={() => openModal("deposit")}
            >
              {" "}
              {t("deposit")}{" "}
            </Button>
            <Button
              w="280px"
              h="60px"
              mt="50px"
              colorScheme="reddish"
              color="white"
              onClick={() => openModal("withdraw")}
            >
              {" "}
              {t("withdraw")}{" "}
            </Button>
          </Center>
        </Box>
      </VStack>

      <ConvertModal {...modalProps} type={type} cb={fetchData} />
      <Center
        width="100%"
        textAlign="center"
        fontSize="16px"
        color="textStats"
        pt="24px"
        mb={4}
      >
        {/* <Spacer /> */}
        <Text textAlign="center"> TVL $ {bals.tvl}</Text>
        {/* <Spacer /> */}
        {/* <Text>TODO: User   4.21M</Text> */}
      </Center>
    </VStack>
  )
}
