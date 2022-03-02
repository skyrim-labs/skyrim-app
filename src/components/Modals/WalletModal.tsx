import React, { useEffect, useState } from "react"
import {
  Modal,
  VStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react"
import { t } from "../../i18n"

import { imgs } from "../../assets"
import { getTokenContract, formatBalance } from "../../utils"
import { tokenApi } from "../../utils/api"
import store from "../../stores/account"
import { createNoSubstitutionTemplateLiteral } from "typescript"

type WalletProps = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  cb?: () => void
}

const WalletModal = (props: WalletProps) => {
  const { isOpen, onClose, cb = () => {} } = props

  const balanceStyle = {
    fontSize: "20px",
    fontWeight: "500",
  }

  const tokenStyle = {
    fontSize: "12px",
    fontWeight: "400",
    color: "textDesc",
  }
  const JT = tokenApi("JUNIOR")
  const ST = tokenApi("SENIOR")
  const TRA = tokenApi("TRA")
  const { address } = store.useState("address")

  const [bals, setBals] = useState({ jtBal: "0", stBal: "0", traBal: "0" })
  useEffect(() => {
    const fetchData = async () => {
      if (!address) return
      if (!isOpen) return

      if (!(JT && ST && TRA)) {
        return
      }

      // const arr = [JT.getBalance(address), ST.getBalance(address)]
      const jtBal = await JT.getBalance(address)
      const stBal = await ST.getBalance(address)
      const traBal = await TRA.getBalance(address)
      setBals({
        jtBal: formatBalance(jtBal),
        stBal: formatBalance(stBal),
        traBal: formatBalance(traBal),
      })
    }

    fetchData()
  }, [JT, ST, TRA, address, isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
      <ModalOverlay />
      <ModalContent h="368px" w="446px">
        <ModalHeader>
          <Text
            textAlign="center"
            h={45}
            color="textDesc"
            fontSize={20}
            fontWeight={500}
          >
            {t("wallet")}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mt={10} pb={6}>
          <VStack>
            <Flex w="100%" justify="space-around" textAlign="center" mb={6}>
              <Box>
                <Image h="60px" w="60px" mb={4} src={imgs.JTLogo} />
                <Text {...balanceStyle}>{bals.stBal}</Text>
                <Text {...tokenStyle}>SENIOR</Text>
              </Box>
              <Box>
                <Image h="60px" mb={4} src={imgs.STLogo} />
                <Text {...balanceStyle}>{bals.jtBal}</Text>
                <Text {...tokenStyle}>JUNIOR</Text>
              </Box>
              <Box>
                <Image h="60px" mb={4} src={imgs.TRALogo} />
                <Text {...balanceStyle}>{bals.traBal}</Text>
                <Text {...tokenStyle}>TRA</Text>
              </Box>
            </Flex>
            <Button
              w="100%"
              h="60px"
              colorScheme="grass"
              onClick={() => onClose()}
            >
              {t("Close")}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WalletModal
