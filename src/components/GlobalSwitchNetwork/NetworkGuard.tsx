import React, { FC } from "react"
import { Box, useColorMode } from "@chakra-ui/react"
import accountStore from "../../stores/account"
import GlobalSwitchNetworkModal from "./GlobalSwitchNetworkModal"
import { CURRENT_CHAIN } from "../../utils/chainInfo"

const isOnSupportedChain = (chainId: string | number) => {
  const numberChainId = Number(chainId)
  return numberChainId === CURRENT_CHAIN
}

const NetworkGuard: FC = ({ children }) => {
  const { colorMode } = useColorMode()
  const color = `text.${colorMode}`
  const background = `background.${colorMode}`
  const { address, networkId } = accountStore.useState("address", "networkId")

  // Connected and not in supported chain
  if (!!address && !!networkId && !isOnSupportedChain(networkId)) {
    return <GlobalSwitchNetworkModal />
  }

  return (
    <Box bg={background} w="100%" minH="100vh" color={color}>
      {children}
    </Box>
  )
}

export default NetworkGuard
