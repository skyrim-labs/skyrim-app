import { ChainId } from "../constants"

interface AddEthereumChainParameter {
  chainId: string
  blockExplorerUrls?: string[]
  chainName?: string
  iconUrls?: string[]
  nativeCurrency?: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls?: string[]
}

const CHAINS: AddEthereumChainParameter[] = [
  {
    chainName: "Ethereum Mainnet",
    chainId: ChainId.MAINNET.toString(16),
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  {
    chainName: "Ethereum Rinkeby",
    chainId: ChainId.RINKEBY.toString(16),
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
    },
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
  },
  {
    chainName: "Ethereum Ropsten",
    chainId: ChainId.ROPSTEN.toString(16),
    rpcUrls: ["https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
    },
    blockExplorerUrls: ["https://ropsten.etherscan.io/"],
  },
  {
    chainName: "BSC",
    rpcUrls: [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org",
    ],
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    chainId: ChainId.BSC.toString(16),
    blockExplorerUrls: ["https://bscscan.com"],
  },
  {
    chainName: "BSC Testnet",
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545",
    ],
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "tBNB",
      decimals: 18,
    },
    chainId: ChainId.BSC_TESTNET.toString(16),
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
]

export const CURRENT_CHAIN = ChainId.RINKEBY

export function getChainData(chainId?: number | null) {
  if (!chainId) {
    return undefined
  }
  const chainData = CHAINS.find(
    (chain: AddEthereumChainParameter) =>
      chain.chainId === `0x${chainId.toString(16)}`,
  )
  if (!chainData) {
    return undefined
  }

  return chainData
}
