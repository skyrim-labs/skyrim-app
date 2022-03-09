import React, { Suspense, useEffect } from "react"
import { Route, Switch } from "react-router-dom"

import GoogleAnalyticsReporter from "../components/analytics/GoogleAnalyticsReporter"
import TabHeader from "../components/TabHeader"
// import { NetworkContextName } from '../constants'
import { VStack, } from "@chakra-ui/react"
import TipModal from "../components/Modals/TipModal"
import Header from "../components/Header"
import Footer from "../components/Footer"

import Config from "./config"
import Investment from "./investment"
import Interest from "./interest"
import Liquidity from "./liquidity"
import Dashboard from "./dashboard"
import ConnectWallet from "../components/ConnectWallet"
import { uniPoolApi } from "../utils/api"
import { globalStore } from "rekv"
import { formatBalance } from "../utils"
import { NetworkGuard } from "../components/GlobalSwitchNetwork"

export const App = () => {
  const fetchData = async () => {
    const pool = uniPoolApi("tra")

    if (!pool) return

    const reserves = await pool.getReserves()

    const tra = formatBalance(reserves[0])
    const dai = formatBalance(reserves[1])
    const k = +tra * +dai
    const price = +dai - k / (+tra + 1)

    globalStore.setState({
      traPrice: price.toFixed(2),
    })
  }
  useEffect(() => {
    fetchData()
  }, [])
  const contentHigh = document.documentElement.clientHeight - 80 - 97

  return (
    <Suspense fallback={null}>
      {/* <ColorModeScript /> */}
      <Route component={GoogleAnalyticsReporter} />
      <NetworkGuard>
        <Header />
        <VStack minHeight={contentHigh} bgColor="contentBg" pb="24px">
        <TabHeader />
        <ConnectWallet>
          <Switch>
            <Route exact strict path="/app/investment" component={Investment} />
            <Route exact strict path="/app/interest" component={Interest} />
            <Route exact strict path="/app/liquidity" component={Liquidity} />
            <Route exact strict path="/app/dashboard" component={Dashboard} />
            <Route exact strict path="/config" component={Config} />
            <Route exact strict path="/app*" component={Investment} />
          </Switch>
        </ConnectWallet>
        <TipModal />
        </VStack>
        <Footer />
      </NetworkGuard>
    </Suspense>
  )
}
