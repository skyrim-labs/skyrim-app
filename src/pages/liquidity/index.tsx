import React, { useCallback, useEffect, useState } from "react"
import {
  VStack,
  Box,
  Text,
  SimpleGrid,
  Center,
  Button,
  useDisclosure,
} from "@chakra-ui/react"

import LiquidityModal from "../../components/Modals/LiquidityModal"
import { getTokenContract, formatBalance } from "../../utils"
import { t } from "../../i18n"
import { uniPoolApi, stakePoolApi as stakeApi } from "../../utils/api"
import store from "../../stores/account"

export default function Liquidity() {
  const [pool, setPool] = useState("")
  const { address, signer } = store.useState("address", "signer")

  const liqModalProps = {
    ...useDisclosure(),
  }

  const descTextStyle = {
    color: "textDesc",
    fontSize: "14px",
    fontWeight: 400,
  }

  const valueTextStyle = {
    color: "textHead",
    fontSize: "18px",
    fontWeight: 600,
    mb: 12,
  }

  const handleOpen = (pool: string) => {
    console.log("open")
    setPool(pool)
    liqModalProps.onOpen()
  }

  const PoolCard = ({ token, tr, tvl, ttr, ptr }: any) => {
    const contractAddr = getTokenContract(token)
    const contract = uniPoolApi(token)
    // const stakeContract = stakePoolApi(token)
    const stakePoolApi: any = stakeApi(token, signer)

    const [perReward, setPerReward] = useState("0")
    const [bals, setBals] = useState({
      totalSupply: "0",
      rewardPerToken: "0",
      totalRewardsToday: "0",
    })

    const fetchData = async () => {
      const totalSupply = await stakePoolApi.totalSupply()
      const rewardPerToken = await stakePoolApi.rewardPerToken()
      // console.log(totalSupply, rewardPerToken, '++++=====+++++')
      setBals({
        totalSupply: formatBalance(totalSupply),
        rewardPerToken: formatBalance(rewardPerToken),
        totalRewardsToday: (
          Number(formatBalance(totalSupply)) *
          Number(formatBalance(rewardPerToken))
        ).toString(),
      })
    }
    useEffect(() => {
      fetchData()
    }, [token])
    return (
      <Center minW="233px" background="white">
        <VStack p={8}>
          <Text fontSize={24} fontWeight={600}>
            {t("poolTitle", { token })}
          </Text>
          {/* <Text {...descTextStyle}>
          {t('totalRewards')}（删掉？只有一期）
        </Text>
        <Text  {...valueTextStyle}>
          0 TRA
        </Text> */}

          <Text {...descTextStyle} mt={4}>
            {t("poolTVL")}
          </Text>
          <Text {...valueTextStyle}>{bals.totalSupply} LP</Text>
          <Text {...descTextStyle}>{t("LPRewardTip")}</Text>
          <Text {...valueTextStyle} color="primary">
            {bals.rewardPerToken} TRA
          </Text>
          <Text {...descTextStyle}>{t("totalRewardsToday")}</Text>
          <Text {...valueTextStyle} color="primary">
            {bals.totalRewardsToday} TRA
          </Text>
          <Button
            fontWeight={500}
            fontSize={16}
            h="60px"
            w="280px"
            colorScheme="grass"
            onClick={() => {
              handleOpen(token)
            }}
          >
            {t("enter")}
          </Button>
        </VStack>
      </Center>
    )
  }

  const liquidityModal = pool && (
    <LiquidityModal {...liqModalProps} pool={pool} />
  )

  return (
    <VStack
      bgColor="contentBg"
      px="88px"
      pt="24px"
    >
      <Box width="100%" mb="25px" px="24px">
        <Text fontSize={34} fontWeight={600} color="textHead">
          {t("liquidityTitle")}
        </Text>
        <Box {...descTextStyle}>
          <Text>{t("liquidityDesc")}</Text>
        </Box>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
        <PoolCard token="JUNIOR" />
        <PoolCard token="SENIOR" />
        <PoolCard token="TRA" />
      </SimpleGrid>
      {liquidityModal}
    </VStack>
  )
}
