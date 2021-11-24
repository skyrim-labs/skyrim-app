import { SerializableParam } from 'recoil'
import {
  getContract,
  getMainPoolContract,
  convertAmount,
  getTokenContract,
  // getMarketContract,
  getInvestPoolContract,
  getTokenPairAddress,
  getStakePoolAddress,
} from '../utils'
import { ethers } from 'ethers'
import pairABI from '../abis/Pair.json'
import jtTokenAbi from '../abis/JuniorToken.json'
import stTokenAbi from '../abis/SeniorToken.json'
import MainContract from '../abis/SkyrimInvestVault.json'
// import MarketContract from '../abis/SkyrimInvestMarket.json'
import UniPoolContract from '../abis/JTAndTRAV2PairPool.json'
import StakePollContract from '../abis/JTAndTRALPTokenStakeRewardPool.json'
// import  from '../abis/JTAndTRAV2PairPool.json'

import SeniorInvestContract from '../abis/SeniorInvestPool.json'
import JuniorInvestContract from '../abis/JuniorInvestPool.json'
import { APPROVE_NUM } from '../constants'
import { result } from 'lodash'
// import store from '../stores/account'
export const fetchAccount = async (addr: SerializableParam) => {
  return ''
}

// api for uniswap
export const uniswapAPI = (pairAddr: string) => {
  // init contract with pair address
  const contract = getContract(pairAddr, pairABI)

  // query pair pool balance token address is optional
  const getPoolBalance = async (tokenAddr: string) => {}
  // query lp balance of accountBalance
  const getLPTokenBalance = async (accountBalance: string) => {}

  return {
    getPoolBalance,
    getLPTokenBalance,
  }
}

// api for combo protocal
export const mainApi = () => {
  const address = getMainPoolContract()
  const contract = getContract(address, MainContract.abi)
  // total dai invested
  const totalInvest = async () => {
    return await contract.totalInvest()
  }

  const totalInvestByST = async () => {
    return await contract.totalInvestByST()
  }

  const getCurrentInvestmentPriceForST = async () => {
    const res = await contract.getCurrentInvestmentPriceForST()
    return ethers.BigNumber.from(res)
  }

  const getCurrentInvestmentPriceForJT = async () => {
    const res = await contract.getCurrentInvestmentPriceForJT()
    return ethers.BigNumber.from(res)
  }

  const STCapitalRate = async () => {
    const currentPeriod = await contract.getCurrentPeriod()
    const res = await contract.investmentPricePerPeriod(0, currentPeriod.toString())
    return ethers.BigNumber.from(res)
  }

  const STRealProfitRate = async () => {
    const currentPeriod = await contract.getCurrentPeriod()
    const res = await contract.TRAPricePerPeriod(0, currentPeriod)
    return ethers.BigNumber.from(res)
  }

  const getTotalTRARewards = async () => {
    return await contract.totalTRARewards()
  }

  const totalInvestByJT = async () => {
    return await contract.totalInvestByJT()
  }

  const JTCapitalRate = async () => {
    const currentPeriod = await contract.getCurrentPeriod()
    const res = await contract.investmentPricePerPeriod(1, currentPeriod)
    return ethers.BigNumber.from(res)
  }

  const JTRealProfitRate = async () => {
    const currentPeriod = await contract.getCurrentPeriod()
    const res = await contract.TRAPricePerPeriod(1, currentPeriod)
    return ethers.BigNumber.from(res)
  }
  // 已有
  const investAmountByJT = async (address: string) => {
    return await contract.investAmountByJT(address)
  }

  const investAmountByST = async (address: string) => {
    return await contract.investAmountByST(address)
  }

  const getAPY = async (token: string) => {
    const tokenType = token === 'senior' ? '0' : '1'
    return await contract.getAPY(tokenType)
  }

  const getInvestBalance = async (token: string, address: string) => {
    const method = token === 'senior' ? 'investAmountByST' : 'investAmountByJT'
    return await contract[method](address)
  }

  const getProfit = async (token: string, address: string) => {
    const method = token === 'senior' ? 'getSTProfit' : 'getJTProfit'
    return await contract[method](address)
  }
  // get vault starttime
  const getStartTime = async () => {
    const res = await contract.startTime()
    console.log(res)
    return res
  }
  // get vault starttime
  const getCurrentPeriod = async () => {
    const res = await contract.getCurrentPeriod()
    console.log(res)
    return res
  }
  // get vault starttime
  const getPeriod = async () => {
    const res = await contract.getPeriod()
    console.log(res)
    return res
  }

  // get vault starttime
  const canInvest = async () => {
    const period = await contract.getCurrentPeriod()
    const currentPeriod = await contract.getPeriod()
    console.log(period === currentPeriod)
    return period === currentPeriod
  }

  // deposit DAI to get JT ST
  const mint = async (token: string, amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)

    const methodName = token === 'senior' ? 'mintST' : 'mintJT'
    return await contractWithSigner[methodName](convertAmount(amount))
  }

  // burn JT ST to get DAI
  const burn = async (token: string, amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)
    const methodName = token === 'senior' ? 'withdrawByST' : 'withdrawByJT'
    return await contractWithSigner[methodName](convertAmount(amount))
  }

  // invest JT ST to get reward
  const invest = async (token: string, amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)
    const methodName = token === 'senior' ? 'investST' : 'investJT'
    return await contractWithSigner[methodName](signer._address, convertAmount(amount))
  }

  // redeem JT ST from main pool
  const harvestTRARewards = async (token: string, signer: any) => {
    const contractWithSigner = contract.connect(signer)
    const tokenType = token === 'senior' ? 0 : 1
    return await contractWithSigner.redeemInvestment(tokenType)
  }
  // redeem JT ST from main pool
  const redeem = async (token: string, amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)
    const tokenType = token === 'senior' ? 0 : 1
    return await contractWithSigner.redeemInvestment(tokenType, convertAmount(amount))
  }
  // harvest JT ST from main pool
  const harvest = async (signer: any) => {
    const contractWithSigner = contract.connect(signer)
    return await contractWithSigner.harvestAllTRARewards()
  }
  // get total valid invested token
  const getTotalInvestedAmount = async (token: string, address: string) => {
    const tokenType = token === 'senior' ? 0 : 1
    const res = await contract.getTotalInvestmentAmount(tokenType, address)
    return res.toString()
  }
  const getAccruedTRARewards = async (token: string, address: string) => {
    const tokenType = token === 'senior' ? 0 : 1
    const res = await contract.getAccruedTRARewards(tokenType, address)
    return res
  }
  // get redeem token
  const getRedeemToken = async (token: string, address: string) => {
    const tokenType = token === 'senior' ? 0 : 1
    const res = await contract.getValidInvestmentAmount(tokenType, address)
    return res.toString()
  }
  // get redeem token
  const getRewardToken = async (token: string, address: string) => {
    const tokenType = token === 'senior' ? 0 : 1
    const res = await contract.getUserTotalTRARewards(tokenType, address)
    return res.toString()
  }

  // stake uni-v2 token to get reward
  const stake = async (token: string, amount: number, signer: any) => {
    const stakeMethods: { [key: string]: string } = {
      senior: 'stakeSTAndTRAPairPoolToken',
      junior: 'stakeJTAndTRAPairPoolToken',
      TRA: 'stakeTRAAndDAIPairPoolToken',
    }

    const contractWithSigner = contract.connect(signer)
    const methodName = stakeMethods[token]
    return await contractWithSigner[methodName](convertAmount(amount))
  }

  // withdraw uni-v2 token from main pool
  const withdraw = async (token: string, amount: number, signer: any) => {
    const stakeMethods: { [key: string]: string } = {
      senior: 'withdrawSTAndTRALiquidityReward',
      junior: 'withdrawJTAndTRALiquidityReward',
      TRA: 'withdrawTRAAndDAILiquidityReward',
    }

    const contractWithSigner = contract.connect(signer)
    const methodName = stakeMethods[token]
    return await contractWithSigner[methodName](convertAmount(amount))
  }

  return {
    ...contract,
    getTotalTRARewards,
    totalInvestByST,
    totalInvestByJT,
    STCapitalRate,
    JTCapitalRate,
    STRealProfitRate,
    JTRealProfitRate,
    investAmountByJT,
    investAmountByST,
    totalInvest,
    mint,
    burn,
    withdraw,
    invest,
    redeem,
    stake,
    getInvestBalance,
    getAPY,
    getProfit,
    getTotalInvestedAmount,
    getAccruedTRARewards,
    getRedeemToken,
    getRewardToken,
    harvestTRARewards,
    getStartTime,
    canInvest,
    getCurrentPeriod,
    getPeriod,
    harvest,
    getCurrentInvestmentPriceForST,
    getCurrentInvestmentPriceForJT
  }
}

// api for SkyrimInvestMarket
// export const marketApi = () => {
//   // const { signer } = store.useState('signer')
//   const address = getMainPoolContract()
//   const contract = getContract(address, MarketContract.abi)
//   // const contractWithSigner = contract.connect(signer);

//   // // get invested ST
//   // const redeemableST = async (address: string) => {
//   //   return await contract.STInvestInfoMap(address)
//   // }
//   // // get invested JT
//   // const redeemableJT = async (address: string) => {
//   //   return await contract.JTInvestInfoMap(address)
//   // }
//   return { ...contract }
// }

//api for invest pool with JT/ST
export const investPoolApi = (token = 'senior') => {
  // const { signer } = store.useState('signer')
  const address = getMainPoolContract()
  const contract = getContract(address, MainContract.abi)
  // const contractWithSigner = contract.connect(signer);

  // get total stake amount
  const stakeTotal = async () => {
    return await contract.stakeTotal()
  }
  // get user stake amount
  const stakeAmount = async (address: string) => {
    return await contract.stakeAmount(address)
  }
  // get user stake reward
  const getReward = async (signer: any) => {
    return await contract.getReward(signer)
  }

  // get user stake amount
  const rewardPerToken = async () => {
    return await contract.rewardPerToken()
  }
  // get user earned
  const earned = async (address: string) => {
    return await contract.earned(address)
  }

  const queryInterestList = async (address: string, blockNum = 1000) => {
    const filter = contract.filters.RewardPaid(address, null)
    let records = await contract.queryFilter(filter)
    records = records.map((rec: any) => {
      rec.token = token
      return rec
    })
    return records
  }

  return {
    ...contract,
    stakeTotal,
    stakeAmount,
    rewardPerToken,
    getReward,
    earned,
    queryInterestList,
  }
}

export const tokenApi = (name = '') => {
  // const { signer } = store.useState('signer')
  name = name.toUpperCase()
  const tokenAddr = getTokenContract(name)
  const contract = getContract(tokenAddr, name === 'senior' ? stTokenAbi.abi : jtTokenAbi.abi)
  // const contractWithSigner = contract.connect(signer);

  const getBalance = async (address: string) => {
    return await contract.balanceOf(address)
  }

  const approve = async (
    contractAddr: string,
    signer: any,
    amount = '1000000000000000000000000000',
  ) => {
    const contractWithSigner = contract.connect(signer)
    return await contractWithSigner.approve(contractAddr, amount)
  }

  const allowance = async (address: string, contractAddr: string) => {
    return await contract.allowance(address, contractAddr)
  }

  const totalSupply = async () => {
    return await contract.totalSupply()
  }

  // approve to vault
  const approveToInvest = async (
    address: string,
    signer: any,
    amount = '1000000000000000000000000000',
  ) => {
    const contractWithSigner = contract.connect(signer)
    return await contractWithSigner.approveToInvest(amount, address)
  }

  const mint = async (amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)

    return await contractWithSigner.mint(signer._address, convertAmount(amount))
  }

  const burn = async (amount: number, signer: any) => {
    const contractWithSigner = contract.connect(signer)

    return await contractWithSigner.burn(convertAmount(amount))
  }

  return { ...contract, getBalance, allowance, approve, approveToInvest, mint, burn, totalSupply }
}

// api for uniswap pool
export const uniPoolApi = (token = '') => {
  const address = getTokenPairAddress(token)
  const contract = getContract(address, UniPoolContract.abi)
  // const contractWithSigner = contract.connect(signer);

  // // get invested ST
  // const getTokenPerReward = async () => {
  //   return await contract.rewardPerToken()
  // }
  // get invested JT
  // const redeemableJT = async (address: string) => {
  //   return await contract.JTInvestInfoMap(address)
  // }
  return { ...contract }
}

// api for uniswap pool
export const stakePoolApi = (token = '', signer: any) => {
  const address = getStakePoolAddress(token)
  const contract = getContract(address, StakePollContract.abi)
  const contractWithSigner = contract.connect(signer)

  // get invested ST
  const getTokenPerReward = async () => {
    return await contract.rewardPerToken()
  }

  const earned = async (account: string) => {
    return await contract.earned(account)
  }

  const totalSupply = async () => {
    return await contract.totalSupply()
  }

  const notifyRewardAmount = async () => {
    return await contract.notifyRewardAmount()
  }

  const rewardPerToken = async () => {
    return await contract.rewardPerToken()
  }

  const getReward = async () => {
    let result
    try {
      result = await contractWithSigner.getReward()
    } catch (error) {
      console.error(error)
    }
    return result
  }

  // stake uni-v2 token to get reward
  const stake = async (amount: number) => {
    let result
    try {
      result = await contractWithSigner.stake(convertAmount(amount))
    } catch (error) {
      console.error(error)
    }
    return result
  }

  // withdraw uni-v2 token from main pool
  const withdraw = async (amount: number) => {
    let result
    try {
      result = await contractWithSigner.withdraw(convertAmount(amount))
    } catch (error) {
      console.error(error)
    }
    return result
  }

  // withdraw uni-v2 token from main pool
  const exit = async (amount: number) => {
    let result
    try {
      result = await contractWithSigner.exit()
    } catch (error) {
      console.error(error)
    }
    return result
  }
  // get invested JT
  // const redeemableJT = async (address: string) => {
  //   return await contract.JTInvestInfoMap(address)
  // }
  return {
    ...contract,
    totalSupply,
    notifyRewardAmount,
    rewardPerToken,
    getTokenPerReward,
    stake,
    withdraw,
    getReward,
    earned,
    exit,
  }
}
