import React, { useState, useEffect } from "react"
import {
  Modal,
  VStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button, Text,
  Box,
  Flex,
  Center,
  Input
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { t } from '../../i18n'
import { POOL_ADDRESS } from '../../constants'
import { tokenApi, mainApi, investPoolApi, stakePoolApi as stakeApi, uniPoolApi } from '../../utils/api'
import store from '../../stores/account'
import { toast, getTokenContract, getStakePoolAddress, formatBalance, getTokenPairAddress } from '../../utils'
import ApproveBtn from '../ApproveBtn'

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pool: string
  cb?: () => void
}

type handlerLPRewardProps = {
  amount: number
  method: string
}

const btnStyle = {
  width: '200px',
  ml: 4,
  h: '40px',
  colorScheme: 'grass',
  fontSize: '10px'
}

const LiquidityModal = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const [rewardLoading, setRewardLoading] = useState(false)
  const [exitLoading, setExitLoading] = useState(false)
  const [depositAmount, setDepositAmount] = useState(0)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [bals, setBals] = useState({ earned: '0', lpBal: '0', lpStakeBal: '0' })
  const { address, signer } = store.useState('address', 'signer')
  const { isOpen, onClose, pool } = props
  const chainId = Number(window.ethereum.chainId)
  const pairAddr = pool ? POOL_ADDRESS[pool][chainId] : ''
  const stakePoolApi: any = stakeApi(pool, signer)


  const handlerChangeLiquidity = () => {
    const chainId = Number(window.ethereum.chainId)
    const pairAddr = POOL_ADDRESS[pool][chainId]
    const link = `https://info.uniswap.org/pair/${pairAddr}`
    window.open(link, '_blank')
  }

  const fetchData = async (pool: string) => {
    const poolContract = uniPoolApi(pool)
    if (!isOpen || !poolContract) return
    // const arr = [JT.getBalance(address), ST.getBalance(address)]
    const earned = await stakePoolApi.earned(address)
    const lpStakeBal = await stakePoolApi.balanceOf(address)
    const lpBal = await poolContract.balanceOf(address)
    console.log('earned: ', earned)
    setBals({
      earned: formatBalance(earned),
      lpBal: formatBalance(lpBal),
      lpStakeBal: formatBalance(lpStakeBal),
    })
  }

  useEffect(() => {

    fetchData(pool)

  }, [isOpen, pool])

  const onDepositChange = (e: any) => {
    setDepositAmount(e.target.value);
  }

  // const onRedeemChange = (e: any) => {
  //   setDepositAmount(e.target.value);
  // }

  const onWithdrawChange = (e: any) => {
    setWithdrawAmount(e.target.value);
  }
  const handleWithdraw = async (e: any) => {
    const tx = await stakePoolApi.exit()
    if (!tx) return
    setExitLoading(true)
    const res = await tx.wait(2)
    const toastProps: any = {
      title: 'Transaction',
      desc: '',
      status: 'success'
    }
    if (res.status === 1) {
      setLoading(false)
      toastProps.desc = t('trx.success')
    } else {
      toastProps.desc = t('trx.fail')
      toastProps.status = 'error'
      setLoading(false)
    }
    // actions.resetForm()
    setExitLoading(false)
    toast(toastProps)
    onClose()
  }
  const handleRedeem = async () => {
    setRewardLoading(true)
    const tx = await stakePoolApi.getReward()
    if (!tx) {
      setRewardLoading(false)
      return
    }

    const res = await tx.wait(2)
    const toastProps: any = {
      title: 'Transaction',
      desc: '',
      status: 'success'
    }
    if (res.status === 1) {
      setLoading(false)
      toastProps.desc = t('trx.success')
    } else {
      toastProps.desc = t('trx.fail')
      toastProps.status = 'error'
      setLoading(false)
    }
    // actions.resetForm()
    setRewardLoading(false)
    toast(toastProps)
    onClose()
  }

  const handlerLPReward = async (values: handlerLPRewardProps) => {
    const { amount, method } = values

    if (amount > +bals.lpBal || !amount) {
      return
    }
    let tx = null

    tx = await (stakePoolApi[method] as any)(amount, signer)
    if (!tx) return
    setLoading(true)
    const res = await tx.wait(2)
    const toastProps: any = {
      title: 'Transaction',
      desc: '',
      status: 'success'
    }
    if (res.status === 1) {
      setLoading(false)
      toastProps.desc = t('trx.success')
    } else {
      toastProps.desc = t('trx.fail')
      toastProps.status = 'error'
      setLoading(false)
    }
    // actions.resetForm()
    setLoading(false)
    toast(toastProps)
    onClose()
    // fetchData()
  }

  return <Modal
    isOpen={isOpen}
    onClose={onClose}
    autoFocus={false}
    size='lg'
    isCentered
  >
    <ModalOverlay />
    <ModalContent >
      <ModalHeader border='1px solid #F2F4F5'>
        <Text textAlign='center' fontSize='20px' fontWeight={500}>
          {t('addLiq')}
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody mt={4} pb={6}>
        <VStack >
          <Box minH='60px' width='100%' mb={4}>
            <Text h='30px' fontSize='12' color='textDesc' fontWeight={400}>{pool}/{pool !== 'TRA' ? 'TRA' : 'BUSD'} UNI-V2</Text>
            <Flex>
              <Input placeholder="Basic usage" disabled _disabled={{ color: 'black' }} defaultValue={bals.lpBal} />
              <Button w='200px' h='40px' ml={4} leftIcon={<AddIcon />} colorScheme="orange" variant="solid" onClick={() => handlerChangeLiquidity()}>
                {t('addLiq')}
              </Button>
            </Flex>
          </Box>

          <Box minH='60px' width='100%'>
            <Text h='30px' fontSize='12' color='textDesc' fontWeight={400}>{pool}/{pool !== 'TRA' ? 'TRA' : 'BUSD'} {t('deposit')}</Text>
            <Flex>
              <Input placeholder="" onChange={onDepositChange} />
              <ApproveBtn {...btnStyle} tokenName={`${pool} LP`} token={`${pool}_POOL`} contractAddr={getStakePoolAddress(pool)}>
                <Button w='200px' h='40px' isLoading={loading} ml={4} colorScheme="grass" variant="solid" onClick={() => handlerLPReward({ amount: depositAmount, method: 'stake' })}>
                  {t('confirmDed')}
                </Button>
              </ApproveBtn>
            </Flex>
            <Text mt={2} h='30px' fontSize='12' color='textDesc' fontWeight={400}>{t('addLiqTip')}</Text>
          </Box>

          <Box mb={4} w='110%' h='7px' bgColor='#EEF1F4' />

          <Box minH='60px' width='100%' mb={4} >
            <Text h='30px' fontSize='12' color='textDesc' fontWeight={400}>{pool}/{pool !== 'TRA' ? 'TRA' : 'BUSD'} UNI V2 {t('pledged')} + {t('rewards')}</Text>
            <Flex>
              <Input placeholder="" onChange={onWithdrawChange} disabled _disabled={{ color: 'black' }} value={`${bals.lpStakeBal} LP + ${bals.earned} TRA`} />
              <Button w='200px' h='40px' ml={4} isLoading={exitLoading} colorScheme="grass" variant="solid" onClick={handleWithdraw}>
                {t('withdraw')}
              </Button>
            </Flex>
          </Box>

          <Box minH='60px' width='100%' mb={4}>
            <Text h='30px' fontSize='12' color='textDesc' fontWeight={400}>{t('reward')}</Text>
            <Flex>
              <Input placeholder="" value={`${bals.earned}`} _disabled={{ color: 'black' }} />
              {/* <ApproveBtn {...btnStyle} token={`${pool}_POOL`} contractAddr={getTokenContract(`${pool}_POOL`)}> */}
              <Button w='200px' isLoading={rewardLoading} h='40px' ml={4} colorScheme="grass" variant="solid" onClick={() => handleRedeem()}>
                {t('redeem')}
              </Button>
              {/* </ApproveBtn> */}
            </Flex>
          </Box>
          {/* <Button w='100%' h='60px' colorScheme={styleMap[status]} onClick={() => onClose()}>{t('close')}</Button> */}
        </VStack>
      </ModalBody>
    </ModalContent>
  </Modal>
}

export default LiquidityModal
