import * as React from "react"
import ReactDOM from "react-dom"
import { HashRouter, Switch, Route } from "react-router-dom"
import { ToastProps } from "./constants"
import ReactGA from "react-ga"
import "./i18n"

import { App } from "./pages/App"
import reportWebVitals from "./reportWebVitals"
// import * as serviceWorker from "./serviceWorker"
import { RecoilRoot } from "recoil"
import { ChakraProvider } from "@chakra-ui/react"
import Home from "./pages/home"
import theme from "./themes"
import { recoilPersist } from "recoil-persist"
import TransHOC from "./components/Trans"

// A hack to disable error overlay
if (process.env.NODE_ENV !== "production") {
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  ;(async () => await import("./disable-error-overlay.css"))()
}

// const { RecoilPersist, updateState } = recoilPersist(['CURRENT_USER_ADDR'])

// const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
// if (typeof GOOGLE_ANALYTICS_ID === 'string') {
//   ReactGA.initialize(GOOGLE_ANALYTICS_ID)
//   ReactGA.set({
//     customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
//   })
// } else {
//   ReactGA.initialize('test', { testMode: true, debug: true })
// }

window.addEventListener("error", (error) => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true,
  })
})

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <ChakraProvider theme={theme}>
        <TransHOC>
          <RecoilRoot>
            <Switch>
              <Route exact strict path="/app*" component={App} />
              <Route exact strict path="/" component={Home} />
            </Switch>
          </RecoilRoot>
        </TransHOC>
      </ChakraProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
