import { ReactNode } from 'react'
import JSBI from 'jsbi'
import deployedContracts from './deployedContractsAddress'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

// export const ONE_SPLIT_ADRESS = '0x1d54420AdBe011C3115b72CcB876cFcBD8e3aa59'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC = 56,
  BSC_TESTNET = 97,
}

export type BigintIsh = JSBI | bigint | string

export type toastStatus = 'success' | 'info' | 'warning' | 'error' | undefined
export interface ToastProps {
  title?: string
  desc: string | ReactNode
  status?: toastStatus
  duration?: number
  isClosable?: boolean
}

export const JT: any = {
  [ChainId.MAINNET]: deployedContracts.JTAddress,
  [ChainId.RINKEBY]: deployedContracts.JTAddress,
  [ChainId.ROPSTEN]: deployedContracts.JTAddress,
  [ChainId.BSC_TESTNET]: deployedContracts.JTAddress,
}

export const ST: any = {
  [ChainId.MAINNET]: deployedContracts.STAddress,
  [ChainId.RINKEBY]: deployedContracts.STAddress,
  [ChainId.ROPSTEN]: deployedContracts.STAddress,
  [ChainId.BSC_TESTNET]: deployedContracts.STAddress,
}
export const TRA: any = {
  [ChainId.MAINNET]: deployedContracts.TRAAddress,
  [ChainId.RINKEBY]: deployedContracts.TRAAddress,
  [ChainId.ROPSTEN]: deployedContracts.TRAAddress,
  [ChainId.BSC_TESTNET]: deployedContracts.TRAAddress,
}
export const DAI: any = {
  [ChainId.MAINNET]: deployedContracts.DAIAddress,
  [ChainId.RINKEBY]: deployedContracts.DAIAddress,
  [ChainId.ROPSTEN]: deployedContracts.DAIAddress,
  [ChainId.BSC_TESTNET]: deployedContracts.DAIAddress,
}

export const BUSD: any = {
  [ChainId.MAINNET]: deployedContracts.BUSDAddress,
  [ChainId.RINKEBY]: deployedContracts.BUSDAddress,
  [ChainId.ROPSTEN]: deployedContracts.BUSDAddress,
  [ChainId.BSC_TESTNET]: deployedContracts.BUSDAddress,
}

// vault -> SkyrimInvestVault
export const MIAN_POOL: any = {
  [ChainId.MAINNET]: deployedContracts.InvestVaultAddress,
  [ChainId.RINKEBY]: deployedContracts.InvestVaultAddress,
  [ChainId.ROPSTEN]: deployedContracts.InvestVaultAddress,
  [ChainId.BSC_TESTNET]: deployedContracts.InvestVaultAddress,
}

// liquidity pool addrs in uniswap
export const JUNIOR_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0xe05cC67103F08e0A5C8D4d3D065f684c8668195A',
  [ChainId.BSC_TESTNET]: '0x9F40231eF8dff5003D24b5792bAcF086FaD9D701',
}
export const SENIOR_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0x2D76E0816fD686e8Ce934467403Da7dEe809ead5',
  [ChainId.BSC_TESTNET]: '0xfA096EE95Bc02552130F7647c3a12AaBFf4AAaFf',
}
export const TRA_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0x8A460dfD8b6e2F5CC18044129605AC46d25B2B16',
  [ChainId.BSC_TESTNET]: '0x47a0f19F345E3CD4C0F0148CD9273483283a65a3',
}

// liquidity pool addrs in Skyrim
export const JUNIOR_STAKE_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0x8CD16840f19589E06f1B9E68C8AE6e45C2FCad37',
  [ChainId.BSC_TESTNET]: '0x6739f4ed4153B303563DcA0954BA8cba436629AD',
}
export const SENIOR_STAKE_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0xb32e552F4E6761c3f8f61260a070E8E7f2Bc46C0',
  [ChainId.BSC_TESTNET]: '0x0d03750463412BD18A24ef09ca8dc71E0528417b',
}
export const TRA_STAKE_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0x8A460dfD8b6e2F5CC18044129605AC46d25B2B16',
  [ChainId.BSC_TESTNET]: '0x23f53BCdBEfAE24694819C78cD6861716744b337',
}

// DELETE ME: market
export const MARKET: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0xe832860Fd283856F25649E0b89E080c4e91D2C30',
}

// DELETE ME: invest pool  discard
export const SENIOR_INVEST_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0x45FBC735c8113724eA76b6f5d8a76Fd4bD1CBc74',
}
// DELETE ME: invest pool  discard
export const JUNIOR_INVEST_POOL: any = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.ROPSTEN]: '0x24B8f190E60Eb1829d927F2cFFd976429545F8C1',
}

export const POOL_STAKE_ADDRESS: { [key: string]: any } = {
  JUNIOR: JUNIOR_STAKE_POOL,
  SENIOR: SENIOR_STAKE_POOL,
  TRA: TRA_STAKE_POOL,
}

export const POOL_ADDRESS: { [key: string]: any } = {
  JUNIOR: JUNIOR_POOL,
  SENIOR: SENIOR_POOL,
  TRA: TRA_POOL,
}

export const TOKEN_ADDRESS: { [key: string]: any } = {
  JUNIOR: JT,
  SENIOR: ST,
  TRA: TRA,
  DAI: DAI,
  BUSD: BUSD,
  JUNIOR_POOL,
  SENIOR_POOL,
  TRA_POOL,
}

export const NetworkContextName = 'NETWORK'

export const BIG_INT_ZERO = JSBI.BigInt(0)

// used for warning states

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)
export const APPROVE_NUM = JSBI.BigInt(10000000000000000000000000)

export const appPath: string[] = ['investment', 'interest', 'liquidity', 'dashboard']

export interface SubmitFuncType {
  (values: any, actions: any): void
}

// export const MAX_MINT_JT = 100000
// export const MAX_MINT_ST = 100000
// export const MAX_INVEST_JT = 100000
// export const MAX_INVEST_ST = 100000
// export const MIN_INVEST_JT = 100000
// export const MIN_INVEST_ST = 100000
// export const MIN_MINT_JT = 100000
// export const MIN_MINT_ST = 100000

export const MAX_MINT = 10000000000
export const MIN_MINT = 1
export const MAX_INVEST = 1000000000
export const MIN_INVEST = 1
