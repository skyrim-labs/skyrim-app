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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure
} from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import ClaimModal from '../../components/Modals/ClaimModal'
import { mainApi, stakePoolApi } from '../../utils/api'
import store from '../../stores/account'
import { formatBalance } from '../../utils'

import { POOL_ADDRESS } from '../../constants'
import { t } from '../../i18n'


export default function Dashboard() {
  const contentHigh = document.documentElement.clientHeight - 80 - 81 - 97
  const mainPoolApi = mainApi()
  const { address, signer } = store.useState('address', 'signer')
  const jtStakePoolApi: any = stakePoolApi('junior', signer)
  const stStakePoolApi: any = stakePoolApi('senior', signer)
  const traStakePoolApi: any = stakePoolApi('tra', signer)

  const [bals, setBals] = useState({
    stInvest: '0',
    jtInvest: '0',
    earned: '0',
    jtReward: '0',
    stReward: '0',
    traReward: '0',
    // reward: '0'
  })

  const [stake, setStake] = useState({
    jt: '0',
    st: '0',
    tra: '0'
  })

  const fetchData = async () => {
    if (!mainPoolApi) {
      return
    }

    const stInvest = await mainPoolApi.getInvestBalance('senior', address)
    const jtInvest = await mainPoolApi.getInvestBalance('junior', address)
    const stReward = await mainPoolApi.getRewardToken('senior', address)
    const jtReward = await mainPoolApi.getRewardToken('junior', address)

    const totalInvestByST = await mainPoolApi.totalInvestByST()
    const STCapitalRate = await mainPoolApi.STCapitalRate()
    const STRealProfitRate = await mainPoolApi.STRealProfitRate()
    const JTRealProfitRate = await mainPoolApi.JTRealProfitRate()
    const JTAmount = await mainPoolApi.investAmountByJT(address)
    console.log('totalInvestByST STCapitalRate totalInvestByST STRealProfitRate: ', totalInvestByST, STCapitalRate, totalInvestByST, STRealProfitRate)
    const jtEarned = await jtStakePoolApi.earned(address)
    const stEarned = await stStakePoolApi.earned(address)
    const traEarned = await traStakePoolApi.earned(address)
    const totalEarnd = Number(formatBalance(stReward)) + Number(formatBalance(jtReward))

    setBals({
      stInvest: formatBalance(stInvest),
      jtInvest: formatBalance(jtInvest),
      earned: totalEarnd.toFixed(2),
      jtReward: formatBalance(jtEarned),
      stReward: formatBalance(stEarned),
      traReward: formatBalance(traEarned),
    })

    const jtBal = await jtStakePoolApi.balanceOf(address)
    const stBal = await stStakePoolApi.balanceOf(address)
    const traBal = await traStakePoolApi.balanceOf(address)

    setStake({
      jt: formatBalance(jtBal),
      st: formatBalance(stBal),
      tra: formatBalance(traBal),
    })

  }
  useEffect(() => {
    fetchData()

  }, [address])

  // const { onClose, onOpen } = useTipModal()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [receiveType, setReceiveType] = useState('')
  const receiveModalProps = {
    isOpen, onOpen, onClose,
  }

  const linkIcon = (type: number) => {
    const linkMap = {
      0: '',
      1: '',
      2: ''
    }
    return <LinkIcon cursor='pointer' ml='2px' mb='4px' p='2px' h='12px' boxSize='14px' color='white' bgColor='#D9DEE1' borderRadius='lg' />
  }

  const receiveBtn = (type: string) => {
    // const keys = Object.keys(POOL_ADDRESS)
    const handleReceive = (type: string) => {
      setReceiveType(type)
      receiveModalProps.onOpen()
    }
    return <Button colorScheme='grass' w='98px' h='34px' onClick={() => handleReceive(type)}>{t('receive')}</Button>
  }

  return (
    <Center h={contentHigh} bgColor='contentBg' px='88px' pt='24px'>
      <VStack width='100%' minH='640px' p='24px' >
        <Box width='100%' bgColor='white' py='24px' px='28px' mb='24px'>
          <Box pb='24px' borderBottom="1px solid #F2F4F5">
            <Text fontSize='34px' fontWeight={600}>
              {t('my').toUpperCase() + ' ' + t('investment').toUpperCase()}
            </Text>
          </Box>
          <Table variant="unstyled" size='lg'>
            <Thead>
              <Tr fontSize='12px' fontWeight={600} color="tableTitle">
                {/* <Th>{t('protocol')}</Th> */}
                {/* <Th>{t('time')}</Th> */}
                <Th>{t('totalDeposit')}</Th>
                <Th>{t('my') + ' JUNIOR'}</Th>
                <Th>{t('my') + ' SENIOR'}</Th>
                <Th>{t('myRewards')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr fontSize='16px' fontWeight={500} color='tableText'>
                {/* <Td color='primary'>{t('riskTRA')}</Td> */}
                {/* <Td>2021.1.12-2.11</Td> */}
                <Td isNumeric>{+bals.jtInvest + +bals.stInvest}  DAI</Td>
                <Td isNumeric>{bals.jtInvest}{linkIcon(0)}</Td>
                <Td isNumeric>{bals.stInvest}{linkIcon(1)}</Td>
                <Td isNumeric>{bals.earned}{linkIcon(2)}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
        {/* liqudity */}
        <Box width='100%' bgColor='white' py='24px' px='28px'>
          <Box pb='24px' borderBottom="1px solid #F2F4F5">
            <Text fontSize='34px' fontWeight={600}>
              {t('my').toUpperCase() + ' ' + t('liquidity').toUpperCase()}
            </Text>
          </Box>
          <Table variant="unstyled" size='lg'>
            <Thead>
              <Tr fontSize='12px' fontWeight={600} color="tableTitle">
                <Th>{t('rewardPool')}</Th>
                {/* <Th>{t('totalRewards')}</Th>
                <Th>{t('totalDeposit')}</Th>
                <Th>{t('pool') + ' APY'}</Th> */}
                <Th>{t('my') + ' Uni V2 Token'}</Th>
                <Th>{t('myRewards')}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr fontSize='16px' fontWeight={500} color='tableText'>
                <Td >JUNIOR Liquidity Provider</Td>
                {/* <Td>197.29 TRA ?</Td>
                <Td isNumeric>1,219,212 JUNIOR/ 12,712 DAI ?</Td>
                <Td isNumeric>20% ？</Td> */}
                <Td isNumeric>{stake.jt} </Td>
                <Td isNumeric> {bals.jtReward} TRA </Td>
                <Td isNumeric>{receiveBtn('junior')}</Td>
              </Tr>
              <Tr fontSize='16px' fontWeight={500} color='tableText'>
                <Td >SENIOR Liquidity Provider</Td>
                {/* <Td>197.29 TRA</Td>
                <Td isNumeric>1,219,212 JUNIOR/ 12,712 DAI</Td>
                <Td isNumeric>20%</Td> */}
                <Td isNumeric>{stake.st} </Td>
                <Td isNumeric>  {bals.stReward}  TRA </Td>
                <Td isNumeric>{receiveBtn('senior')}</Td>
              </Tr>
              <Tr fontSize='16px' fontWeight={500} color='tableText'>
                <Td >TRA Liquidity Provider</Td>
                {/* <Td>197.29 TRA</Td>
                <Td isNumeric>1,219,212 JUNIOR/ 12,712 DAI</Td>
                <Td isNumeric>20%</Td> */}
                <Td isNumeric>{stake.tra} </Td>
                <Td isNumeric> {bals.traReward}  TRA </Td>
                <Td isNumeric>{receiveBtn('tra')}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </VStack>
      <ClaimModal {...receiveModalProps} type={receiveType} />
    </Center >
  )
}
