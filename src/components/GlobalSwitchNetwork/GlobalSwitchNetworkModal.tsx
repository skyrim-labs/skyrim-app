import React, { useCallback } from "react"
import {
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  VStack,
  Button,
} from "@chakra-ui/react"
import accountStore from "../../stores/account"
import { t } from "../../i18n"
import { getChainData, CURRENT_CHAIN } from "../../utils/chainInfo"

const GlobalSwitchNetworkModal = () => {
  const { address, provider } = accountStore.useState("address", "provider")

  const handleSwitchNetwork = useCallback(async () => {
    if (!provider) {
      return
    }
    const chainIdToChangeTo = CURRENT_CHAIN
    try {
      await provider?.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainIdToChangeTo.toString(16)}` },
        address,
      ])
    } catch (switchError) {
      console.log(switchError)
      console.error(`Switch chain error ${switchError}`)
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          console.log(
            "🚀 ~ file: GlobalSwitchNetworkModal.tsx ~ line 37 ~ handleSwitchNetwork ~ getChainData(chainIdToChangeTo)",
            getChainData(chainIdToChangeTo),
          )
          console.log(
            "🚀 ~ file: GlobalSwitchNetworkModal.tsx ~ line 39 ~ handleSwitchNetwork ~ chainIdToChangeTo",
            chainIdToChangeTo,
          )
          // TODO: Add bsc chain configs
          await provider?.send("wallet_addEthereumChain", [
            getChainData(chainIdToChangeTo),
          ])
        } catch (addError) {
          console.log(addError)
          // handle "add" error
          console.error(`Add chain error ${addError}`)
        }
      }
      // handle other "switch" errors
    }
  }, [address, provider])

  return (
    <Modal
      isOpen
      isCentered
      onClose={() => null}
      closeOnOverlayClick={false}
      size="sm"
    >
      <ModalOverlay
        bg="blackAlpha.200"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalBody p={6}>
          <VStack spacing={4}>
            <Heading fontSize="20px" color="gray.700">
              {t("help__please_switch_network")}
            </Heading>

            <Button
              size="sm"
              w="full"
              colorScheme="pink"
              onClick={handleSwitchNetwork}
            >
              {t("action__switch")}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default GlobalSwitchNetworkModal
