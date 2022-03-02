import * as React from "react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { Center, Button } from "@chakra-ui/react"
import { Web3Provider } from "@ethersproject/providers"
import store from "../../stores/account"
// TODO media links
type Props = {
  children: any
}

const currentUrl = new URL(window.location.href)
const forwarderOrigin =
  currentUrl.hostname === "localhost"
    ? `${currentUrl.host}:${currentUrl.port}`
    : undefined
const onboarding = new MetaMaskOnboarding({ forwarderOrigin })

const ConnectWallet = ({ children }: Props) => {
  const { ethereum } = window

  const connect = async () => {
    if (!ethereum) {
      return onboarding.startOnboarding()
    }

    const web3Provider = new Web3Provider(ethereum)
    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()
    const network = await web3Provider.getNetwork()

    store.setState((s) => ({
      ...s,
      address: address,
      networkId: network.chainId,
      provider: web3Provider,
    }))
  }

  const { address } = store.useState("address")
  return (
    <>
      {address ? (
        children
      ) : (
        <Center h="75vh">
          <Button colorScheme="grass" onClick={connect}>
            Connect
          </Button>
        </Center>
      )}
    </>
  )
}

export default ConnectWallet
