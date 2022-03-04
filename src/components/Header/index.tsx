import React, { useEffect, useState } from "react"
// import { ethers } from "ethers";
import {
  Box,
  Flex,
  Spacer,
  Button,
  Link,
  Image,
  Center,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
// import { useConnector } from '../../hooks/index'
// import { useBalance } from '../../hooks/index'
import WalletModal from "../Modals/WalletModal"
// import { useCurrentUser, useCurrentNetworkId } from '../../hooks/useCurrentAccount'
import { imgs } from "../../assets"
import store from "../../stores/account"

type HeaderProps = {}

const Header = (props: HeaderProps) => {
  const { toggleColorMode } = useColorMode()
  const theme = useColorModeValue("dark", "light")
  const { isOpen, onOpen, onClose } = useDisclosure()
  let modalProps = {
    isOpen,
    onOpen,
    onClose,
  }

  // const { provider, signer } = useConnector()
  // const [isUnlock, setUnlock] = useState(false)
  // const [address, setAddress] = useCurrentUser()
  // const [networkId, setNetworkId] = useCurrentNetworkId()
  const { address, networkId } = store.useState("address", "networkId")
  const { ethereum } = window

  // useEffect(() => {

  //   const isConnect = async ()=> {
  //      const isUnlock = await ethereum._metamask.isUnlocked()
  //      setUnlock(isUnlock)
  //   }

  //   isConnect()

  // }, [ethereum, networkId])

  useEffect(() => {
    if (theme === "light") {
      toggleColorMode()
    }
  }, [theme])

  useEffect(() => {
    if (!ethereum) {
      return
    }
    ethereum.on("chainChanged", (networkId: string) => {
      store.setState({ networkId: +networkId })
      console.log(networkId, "networkIDstring")
    })
    ethereum.on("accountsChanged", (accounts: string[]) => {
      // Time to reload your interface with accounts[0]!
      console.log(accounts, "accounts")
      store.setState({ address: accounts[0] })
    })
  }, [ethereum])

  const getAccount = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    const account = accounts[0]
    console.log(account)
    store.setState({ address: account })
  }

  const showWalletModal = () => {
    onOpen()
  }

  // const { balance, refresh } = useBalance(address)
  return (
    <>
      <Flex h="80px" boxShadow="xl" bg="titleBg">
        <Center minW="210px" p="4">
          <Image w="233px" src={imgs.logo} ml="88px" />
        </Center>
        <Spacer />
        <Flex minW="300px" color="white">
          <Center p="4" fontSize={14}>
            <Link ml={6} href="#feature">
              Product
            </Link>
            <Link ml={6} href="#token">
              Token
            </Link>
            <Link ml={6}>Docs</Link>
            <Link ml={6}>About</Link>
          </Center>

          {/* {ethereum ? <Center p='4' >
            {address ? <Box><Badge colorScheme="gray">{shortenAddress(address)}</Badge> <Text as='kbd'>{ethers.utils.formatEther(balance || '')}</Text></Box> : <Button onClick={() => getAccount()}>Connect to wallet</Button>}
          </Center> : <Center>Please install <Link>MetaMask</Link></Center>} */}
          <Center minW="200px">
            {ethereum ? (
              <Box>
                {address ? (
                  <Box>
                    <Button
                      variant="outline"
                      borderColor="primary"
                      borderRadius="3xl"
                      color="primary"
                      onClick={() => showWalletModal()}
                    >
                      My wallet
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="outline"
                    borderColor="primary"
                    borderRadius="3xl"
                    color="primary"
                    onClick={() => getAccount()}
                  >
                    Connect to wallet
                  </Button>
                )}
              </Box>
            ) : (
              <Box>
                Please install <Link>MetaMask</Link>
              </Box>
            )}
          </Center>
        </Flex>
      </Flex>
      {/* <WalletModal {...modalProps} /> */}
    </>
  )
}

export default Header
