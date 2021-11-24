import React, { useState, useEffect } from 'react'
import {
  Modal,
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button, Text,
  Box,
} from '@chakra-ui/react'
import { stakePoolApi } from '../../utils/api'
import store from '../../stores/account'
import { toast, getTokenContract, formatBalance, getMainPoolContract } from '../../utils'

import { t } from '../../i18n'


type Props = {
  isOpen: boolean
  type: string
  onOpen: () => void
  onClose: () => void
  cb?: () => void
}

const LiquidityModal = (props: Props) => {

  const { isOpen, onClose, type } = props
  const { address, signer } = store.useState('address', 'signer')
  const [earn, setEarn] = useState('')
  const [loading, setLoading] = useState(false)


  const fetchData = async () => {
    if(type==='') return 
    const api = stakePoolApi(type, signer)
    const res = await api.earned(address)
    setEarn(formatBalance(res))
  }
  useEffect(() => {
    fetchData()
  }, [address, type])

  const handleReceive = async () => {
    try {

      let tx = null
      setLoading(true)
      const api = stakePoolApi(type, signer)

      tx = await api.getReward()

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
      toast(toastProps)
      onClose()
    } catch (error) {
      console.log(error)
      onClose()

    }
    // fetchData()
  }


  return <Modal
    isOpen={isOpen}
    onClose={onClose}
    autoFocus={false}
    isCentered
  >
    <ModalOverlay />
    <ModalContent h='195px' w='564px'>
      <ModalHeader border='1px solid #F2F4F5'>
        <Text textAlign='center' fontSize='20px' fontWeight={500}>
          {t('receiveLiq')}
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody mt={10} pb={6}>
        <HStack spacing={10}>
          <Box >
            <Text h='30px' fontSize='24px' fontWeight={600}>{earn} TRA {t('available')}</Text>
          </Box>
          <Box>
            <Button w='110px' h='44px' colorScheme='grass' onClick={() => handleReceive()}>{t('claim')}</Button>
          </Box>
        </HStack>
      </ModalBody>
    </ModalContent>
  </Modal>
}

export default LiquidityModal
