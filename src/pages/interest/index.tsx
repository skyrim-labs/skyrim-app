import React, { useCallback, useEffect, useState } from 'react'
import {
  VStack,
  Center,
  Box,
  Text,
  Divider,
  Flex,
  Spacer,
  Button,
  HStack,
  useDisclosure
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import HelpIcon from '../../components/HelpIcon'
import TradeModal from '../../components/Modals/TradeModal'
import HistoryModal from '../../components/Modals/HistoryModal'
// import { useTipModal } from '../../hooks/useModals'
import { tokenApi, mainApi, investPoolApi } from '../../utils/api'
import { toast, getTokenContract, formatBalance, getMainPoolContract } from '../../utils'
import store from '../../stores/account'
import { ToastProps, MAX_INVEST, MIN_INVEST } from '../../constants'
import { t } from '../../i18n'
import { globalStore } from 'rekv'
import { ethers } from 'ethers'

export default function Trade() {
  const { traPrice } = globalStore.useState('traPrice')
  // const { onClose, onOpen } = useTipModal()
  const [type, setType] = useState('mint')
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const tradeModalProps = {
    isOpen, onOpen, onClose,
  }
  const mainPoolApi = mainApi()
  const { address, signer } = store.useState('address', 'signer')

  const [bals, setBals] = useState({
    stInvest: '0',
    jtInvest: '0',
    totalInvest: '0',
    totalInterest: '0',
    totalInterestInUSD: '0',
    valuePerST: '0',
    valuePerJT: '0',
    earned: '0',
    investedResult: {
      JTAmountRedeemable: '0',
      STAmountRedeemable: '0',
    },
    TRAAmountPerST: 0,
    TRAAmountPerJT: 0,
    // reward: '0'
  })

  const [rewards, setReward] = useState({
    jtReward: '0',
    stReward: '0'
  })

  // const JTPool = investPoolApi('junior')
  // const STPool = investPoolApi('senior')


  const fetchData = async () => {
    console.log('fetch and refresh')
    if (!address || !mainPoolApi) return

    const stInvest = await mainPoolApi.getTotalInvestedAmount('senior', address)
    const jtInvest = await mainPoolApi.getTotalInvestedAmount('junior', address)
    const stTraReward = await mainPoolApi.getRewardToken('senior', address)
    const jtTraReward = await mainPoolApi.getRewardToken('junior', address)
    setReward({
      jtReward: formatBalance(jtTraReward),
      stReward: formatBalance(stTraReward)
    })
    const totalInvest = await mainPoolApi.totalInvest()
    const totalInvestByST = await mainPoolApi.totalInvestByST()
    const totalInvestByJT = await mainPoolApi.totalInvestByJT()
    const STCapitalRate = await mainPoolApi.STCapitalRate()
    const currentInvestmentPriceForST = await mainPoolApi.getCurrentInvestmentPriceForST()
    const currentInvestmentPriceForJT = await mainPoolApi.getCurrentInvestmentPriceForJT()
    const STRealProfitRate = await mainPoolApi.STRealProfitRate()
    const JTCapitalRate = await mainPoolApi.JTCapitalRate()
    const JTRealProfitRate = await mainPoolApi.JTRealProfitRate()
    const STAmountRedeemable = await mainPoolApi.getRedeemToken('senior', address)
    const JTAmountRedeemable = await mainPoolApi.getRedeemToken('junior', address)
    // const JTAmountTotal = await mainPoolApi.getTotalInvestedAmount('junior', address)
    // const STAmountTotal = await mainPoolApi.getRedeemToken('senior', address)
    const totalInterestByST = await mainPoolApi.getAccruedTRARewards('senior', address)
    const totalInterestByJT = await mainPoolApi.getAccruedTRARewards('junior', address)
    // TODO: get from uniswap
    const TRAPrice = 1
    console.log('totalInterestByST: ', totalInterestByST)
    console.log('totalInterestByJT: ', totalInterestByJT)
    // const totalInterest = formatBalance(totalInterestByST.add(totalInterestByJT).toString())
    const totalInterest = await mainPoolApi.getTotalTRARewards()
    console.log('totalInterest: ', totalInterest)

    // const totalInterestInUSD = Number(totalInterest) * TRAPrice
    const valuePerST = currentInvestmentPriceForST.div(ethers.utils.parseEther('1')).toString()
    const valuePerJT = currentInvestmentPriceForJT.div(ethers.utils.parseEther('1')).toString()
    const TRAAmountPerST = STRealProfitRate.div(ethers.utils.parseEther('1')).toNumber()
    const TRAAmountPerJT = JTRealProfitRate.div(ethers.utils.parseEther('1')).toNumber()

    const JTEarned = JTCapitalRate.add(JTRealProfitRate).mul(JTAmountRedeemable)
    const STEarned = STCapitalRate.add(STRealProfitRate).mul(STAmountRedeemable)
    const earned = JTEarned.add(STEarned).div(ethers.utils.parseEther('1'))
    // const earned = JTAmountRedeemable * JTCapitalRate.div(10**18) + JTAmountRedeemable * JTRealProfitRate.div(10**18) + STAmountRedeemable * STCapitalRate.div(10**18) + STAmountRedeemable * STRealProfitRate.div(10**18)

    // const TRAEarnedFromJT = JTAmountRedeemable * JTRealProfitRate.div(10**18)
    // const TRAEarnedFromST = STAmountRedeemable * STRealProfitRate.div(10**18)

    const investedResult = {
      JTAmountRedeemable: formatBalance(JTAmountRedeemable.toString()),
      STAmountRedeemable: formatBalance(STAmountRedeemable.toString()),
    }
    console.log('JTAmountRedeemable: ', JTAmountRedeemable)
    console.log('STAmountRedeemable: ', STAmountRedeemable)
    setBals({
      stInvest: formatBalance(stInvest),
      jtInvest: formatBalance(jtInvest),
      totalInvest: formatBalance(totalInvest),
      totalInterest: formatBalance(totalInterest.toString()),
      totalInterestInUSD: (totalInterest.toString()),
      valuePerST: valuePerST.toString(),
      valuePerJT: valuePerJT.toString(),
      earned: formatBalance(earned.toString()),
      investedResult,
      TRAAmountPerST,
      TRAAmountPerJT,
    })
  }

  useEffect(() => {

    fetchData()

  }, [address])

  useEffect(() => {
    setInterval(() => {
      fetchData()
    }, 30000)
  }, [])


  const claimReward = async () => {
    if (!mainPoolApi) {
      return
    }
    setLoading(true)

    const res = await mainPoolApi.harvest(signer)
    console.log(res)
    setLoading(false)
  }


  const historyModelProps = {
    ...useDisclosure()
  }

  const titleStyle = {
    fontSize: '12px',
    fontWeight: '400',
    color: 'textDesc'
  }
  const valueStyle = {
    fontSize: '26px',
    fontWeight: '600',
  }

  const onMint = async () => {
    // onOpen('123', 'error')
  }

  const handleOpen = (type: string) => {
    setType(type)
    onOpen()
  }

  const openHistory = () => {

  }

  return (
    <Center bgColor='contentBg' px='88px' pt='24px'>
      <VStack width='100%' minH='640px' p='24px' bgColor='white'>
        <Box width='100%' mb='24px'>
          <Text fontSize={34} fontWeight={600} color='textHead'>
            {t('interest')}
          </Text>
        </Box>
        <Divider />
        <Flex pos='relative' width='100%' height='140px' color='textHead' p={10}>
          <Box textAlign='center'>
            <Text fontSize='26px' fontWeight={600}>
              ${bals.totalInvest}
            </Text>
            <Text fontSize='12px' color='textDesc'>
              {t('tvl')}
            </Text>
          </Box>
          <Spacer />
          <Divider orientation='vertical' />
          <Spacer />
          <Box textAlign='center'>
            <Text fontSize='26px' fontWeight={600}>
              {bals.totalInterest} TRA
            </Text>
            <Text fontSize='12px' color='textDesc'>
              {t('tid')}
            </Text>
          </Box>
          <Spacer />
          <Divider orientation='vertical' />
          <Spacer />
          <Box textAlign='center'>
            <Text fontSize='26px' fontWeight={600}>
              ${bals.valuePerST}
            </Text>
            <Text fontSize='12px' color='textDesc'>
              {t('ost')}
            </Text>
          </Box>
          <Spacer />
          <Divider orientation='vertical' />
          <Spacer />
          <Box textAlign='center'>
            <Text fontSize='26px' fontWeight={600}>
              ${bals.valuePerJT}
            </Text>
            <Text fontSize='12px' color='textDesc'>
              {t('ojt')}
            </Text>
          </Box>
          <Spacer />
          {/* <HelpIcon tip='123' /> */}
        </Flex>
        <Divider />
        <Flex
          h='68px'
          w='100%'
          justifyContent='space-between'
          lineHeight='68px'
        >
          <Text fontSize='14px' fontWeight={600}>
            {t('currentHold')}
          </Text>
          {/* <Text as='a' fontSize='12px' color='textDesc' cursor='pointer' onClick={() => historyModelProps.onOpen()}>
            {t('viewHistory') + ' >'}
          </Text> */}
        </Flex>
        <Box width='100%'>
          <Flex bgColor='white' justifyContent='space-between'>
            <Flex pos='relative' w='40%' minW='200px' h='188px' py='24px' px='31px' bgColor='#FBFCFE' justifyContent='center' border='1px solid #EBEFF5' borderRadius='lg'>
              <VStack>
                <Text {...titleStyle}>SENIOR token(Total/Unlocked)</Text>
                <Text {...valueStyle} mb={2}>{bals.stInvest}/{bals.investedResult.STAmountRedeemable}</Text>
                <Text {...titleStyle}>JUNIOR token(Total/Unlocked)</Text>
                <Text {...valueStyle}>{bals.jtInvest}/{bals.investedResult.JTAmountRedeemable}</Text>
              </VStack>
              {/* <HelpIcon tip='123' /> */}

            </Flex>
            <Center w="100px" p={4}>
              <ArrowForwardIcon boxSize={10} color='white' bgColor='#DFE4E8' borderRadius='3xl' />
            </Center>
            <Center pos='relative' w='40%' minW='200px' h='188px' py='24px' px='31px' bgColor='#FBFCFE' border='1px solid #EBEFF5' borderRadius='lg'>
              <Box pr='30px'>
                <Text {...titleStyle} mb={2}>{t('reward')}</Text>
                <Box>{rewards.stReward} TRA(ST interest)  </Box>
                <Box>{rewards.jtReward} TRA(JT interest) </Box>
                <Box mt="20px">Total: {(+rewards.jtReward + +rewards.stReward).toFixed(2)} TRA </Box>
              </Box>
              {/* <HelpIcon tip='123' /> */}
            </Center>
          </Flex>

          <Center>
            <Flex w='80%' justifyContent='space-between'>
              <Button w='280px' h='60px' mt='50px' colorScheme='grass' onClick={() => handleOpen('mint')}>
                {t('invest')}
              </Button>
              <Button w='280px' h='60px' mt='50px' colorScheme='reddish' onClick={() => handleOpen('redeem')}>
                {t('redeem')}
              </Button>
              <Button w='280px' h='60px' mt='50px' colorScheme='gray' isLoading={loading} isDisabled={(+rewards.jtReward + +rewards.stReward) === 0} onClick={() => claimReward()} >
                {t('claim')}
              </Button>
            </Flex>
          </Center>

        </Box>
      </VStack>
      <TradeModal {...tradeModalProps} type={type} cb={fetchData} />
      {/* <HistoryModal {...historyModelProps} /> */}
    </Center>
  )
}
