const CHAINS = [
  {
    name: "Binance Smart Chain Mainnet",
    chain: "BSC",
    rpc: [
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
    faucets: ["https://free-online-app.com/faucet-for-eth-evm-chains/"],
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "BNB",
      decimals: 18,
    },
    infoURL: "https://www.binance.org",
    shortName: "bnb",
    chainId: 56,
    networkId: 56,
    slip44: 714,
    explorers: [
      {
        name: "bscscan",
        url: "https://bscscan.com",
        standard: "EIP3091",
      },
    ],
  },
  {
    name: "Binance Smart Chain Testnet",
    chain: "BSC",
    rpc: [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545",
    ],
    faucets: ["https://testnet.binance.org/faucet-smart"],
    nativeCurrency: {
      name: "Binance Chain Native Token",
      symbol: "tBNB",
      decimals: 18,
    },
    infoURL: "https://testnet.binance.org/",
    shortName: "bnbt",
    chainId: 97,
    networkId: 97,
    explorers: [
      {
        name: "bscscan-testnet",
        url: "https://testnet.bscscan.com",
        standard: "EIP3091",
      },
    ],
  },
]

export function getChainData(chainId?: number | null) {
  if (!chainId) {
    return undefined
  }
  const chainData = CHAINS.filter(
    (chain: any) => chain.chain_id === Number(chainId),
  )[0]

  if (!chainData) {
    return undefined
  }

  return chainData
}
