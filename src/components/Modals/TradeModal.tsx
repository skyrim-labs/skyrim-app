import React, { useState, useEffect } from "react"

import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Radio,
  Flex,
  Spacer,
  useTheme,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"

import { Formik } from "formik"
import { RadioGroupControl, InputControl, SubmitButton } from "formik-chakra-ui"
import ApproveBtn from "../ApproveBtn"
import * as Yup from "yup"

import { tokenApi, mainApi, investPoolApi } from "../../utils/api"

import HelpIcon from "../../components/HelpIcon"
import {
  toast,
  getTokenContract,
  formatBalance,
  getMainPoolContract,
} from "../../utils"
import { t } from "../../i18n"
import store from "../../stores/account"
import { ToastProps, MAX_INVEST, MIN_INVEST } from "../../constants"

type ConvertProps = {
  isOpen: boolean
  type: string
  onOpen: () => void
  onClose: () => void
  cb?: () => void
}

interface FormValues {
  amount: number
  token?: string
}

const ConvertModal = (props: ConvertProps) => {
  const mainPoolApi = mainApi()
  const { isOpen, onClose, cb = () => {}, type } = props
  const initialValues: FormValues = { amount: 0, token: "senior" }
  const [tabIndex, setTabIndex] = React.useState(0)
  const [formType, setFormType] = React.useState("mint")
  const themes = useTheme()
  const [loading, setLoading] = useState(false)
  const [startTime, setTime] = useState("0")

  const JT = tokenApi("JUNIOR")
  const ST = tokenApi("SENIOR")
  // const market = marketApi()
  // const JTPool = investPoolApi('junior')
  // const STPool = investPoolApi('senior')
  const [bals, setBals] = useState({
    jtBal: "0",
    stBal: "0",
    stInvest: "0",
    jtInvest: "0",
    stRedeem: "0",
    jtRedeem: "0",
  })

  const isMint = formType === "mint"
  const colorScheme = isMint ? "grass" : "reddish"
  const validationSchema = Yup.object({
    // amount: Yup.number().required().positive().min(MIN_INVEST).max(MAX_INVEST),
    token: Yup.string().required(),
  })

  const btnStyle = {
    mt: "20px",
    width: "100%",
    h: "60px",
    colorScheme,
  }

  const { address, signer } = store.useState("address", "signer")

  useEffect(() => {
    setTabIndex(type === "mint" ? 0 : 1)
    setFormType(type)
  }, [type, isOpen])

  const fetchData = async () => {
    if (!address) return
    if (!isOpen || !mainPoolApi || !JT || !ST) return
    // const res = await mainPoolApi.canInvest()
    // setCanInvest(res)
    // const arr = [JT.getBalance(address), ST.getBalance(address)]
    const jtBal = await JT.getBalance(address)
    const stBal = await ST.getBalance(address)
    const stInvest = await mainPoolApi.getInvestBalance("senior", address)
    const jtInvest = await mainPoolApi.getInvestBalance("junior", address)
    const stRedeem = await mainPoolApi.getRedeemToken("senior", address)
    const jtRedeem = await mainPoolApi.getRedeemToken("junior", address)
    const startTime = await mainPoolApi.getStartTime()
    console.log(
      "stInvest, jtInvest: ",
      formatBalance(stInvest),
      formatBalance(jtInvest),
    )
    setBals({
      jtBal: formatBalance(jtBal),
      stBal: formatBalance(stBal),
      stInvest: formatBalance(stInvest),
      jtInvest: formatBalance(jtInvest),
      stRedeem: formatBalance(stRedeem),
      jtRedeem: formatBalance(jtRedeem),
    })
  }

  useEffect(() => {
    fetchData()
  }, [isOpen])

  useEffect(() => {}, [isMint])

  const onSub = async (values: any, actions: any) => {
    if (!mainPoolApi) {
      return
    }

    const { token, amount } = values
    let tx = null
    setLoading(true)
    if (isMint) {
      tx = await mainPoolApi.invest(token, amount, signer)
    } else {
      const redeemNum = token === "senior" ? bals.stRedeem : bals.jtRedeem
      tx = await mainPoolApi.redeem(token, Number(redeemNum), signer)
    }

    const res = await tx.wait(2)
    const toastProps: ToastProps = {
      title: "Transaction",
      desc: "",
      status: "success",
    }
    if (res.status === 1) {
      setLoading(false)
      toastProps.desc = t("trx.success")
    } else {
      toastProps.desc = t("trx.fail")
      toastProps.status = "error"
      setLoading(false)
    }
    actions.resetForm()
    toast(toastProps)
    onClose()
    cb()
    fetchData()
  }

  // const handleTabsChange = (index: number) => {
  //   setTabIndex(index)
  //   setFormType(index === 0 ? 'mint' : 'redeem')
  // }

  const renderLable = (values: any) => {
    const token = values.token.toUpperCase()
    let bal = ""
    if (isMint) {
      bal = token === "SENIOR" ? `${bals.stBal}` : `${bals.jtBal}`
    } else {
      bal = token === "SENIOR" ? `${bals.stInvest}` : `${bals.jtInvest}`
    }
    const title = token + " token"
    return (
      <Flex color="textLabel" fontSize={12}>
        <Text>{title}</Text>
        <Spacer />
        {isMint && <Text>{bal + " " + token}</Text>}
      </Flex>
    )
  }

  // const renderOutput = (values: any) => {
  //   let { amount, token } = values
  //   token = token.toUpperCase()
  //   const output = isMint ? amount + ' ' + token + ' token' : amount + ' DAI'

  //   return <Flex color='textLabel' fontSize={12}>
  //     <Text fontSize={16} fontWeight={500}>{output}</Text>
  //     <Spacer />
  //     {!isMint && <Text>{t('charge', { fee: '0.2' })}</Text>}
  //   </Flex>
  // }

  const renderOutput = (values: any) => {
    let { amount, token } = values
    token = token.toUpperCase()
    const output = isMint ? "" : t("redeemTip")

    return (
      <Flex color="textLabel">
        <Text fontSize={12} fontWeight={400}>
          {output}
        </Text>
      </Flex>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
      <ModalOverlay />
      <ModalContent>
        {/* <ModalHeader>
          <Tabs variant='unstyled' index={tabIndex} isFitted onChange={handleTabsChange}>
            <TabList>
              <Tab {...tabStyle(0)}>{t('mint')}</Tab>
              <Tab {...tabStyle(1)}>{t('redeem')}</Tab>
            </TabList>
          </Tabs>
        </ModalHeader> */}

        <ModalHeader h="60px" border="1px solid #F2F4F5">
          <Flex justify="center">
            <Text h={30} color="text" fontSize={20} fontWeight={500}>
              {t(isMint ? "mint" : "redeem")}
            </Text>
            <Box pos="relative">
              <HelpIcon iconStyle={{ top: "5px", right: "-20px" }} tip="123" />
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSub}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, values, errors, setFieldValue }) => {
              return (
                <Box
                  maxWidth={"sm"}
                  m="10px auto"
                  as="form"
                  onSubmit={handleSubmit as any}
                >
                  <Box
                    px={8}
                    pt={4}
                    borderRadius="lg"
                    border="1px"
                    borderColor="borderColor"
                  >
                    {renderLable(values)}
                    <InputGroup>
                      <InputControl
                        inputProps={{
                          fontSize: "24px",
                          fontWeight: "600",
                          size: "lg",
                          variant: "unstyled",
                          isDisabled: !isMint,
                          value: !isMint
                            ? values.token === "senior"
                              ? `${bals.stRedeem}`
                              : `${bals.jtRedeem}`
                            : values.amount,
                        }}
                        name="amount"
                      />
                      <InputRightElement>
                        {isMint && (
                          <Button
                            mt="20px"
                            h="40px"
                            size="lg"
                            variant="unstyled"
                            _focus={{ boxShadow: "none" }}
                            onClick={() => {
                              setFieldValue(
                                "amount",
                                values.token === "senior"
                                  ? bals.stBal
                                  : bals.jtBal,
                              )
                            }}
                          >
                            MAX
                          </Button>
                        )}
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                  <RadioGroupControl mb={12} name="token" label="">
                    <Radio colorScheme={colorScheme} value="senior">
                      {t("senior").toUpperCase() + " token"}
                    </Radio>
                    <Radio colorScheme={colorScheme} value="junior">
                      {t("junior").toUpperCase() + " token"}
                    </Radio>
                  </RadioGroupControl>
                  {renderOutput(values)}
                  <ApproveBtn
                    {...btnStyle}
                    token={values.token}
                    contractAddr={getMainPoolContract()}
                  >
                    <SubmitButton
                      mt="20px"
                      width="100%"
                      h="60px"
                      colorScheme={colorScheme}
                    >
                      {t(formType)}
                    </SubmitButton>
                  </ApproveBtn>
                </Box>
              )
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConvertModal
