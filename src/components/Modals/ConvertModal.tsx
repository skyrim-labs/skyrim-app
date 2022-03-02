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
  Link,
  Tabs,
  TabList,
  Tab,
  Radio,
  Flex,
  Spacer,
  useTheme,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"

import { Formik } from "formik"
import {
  RadioGroupControl,
  NumberInputControl,
  InputControl,
  SubmitButton,
} from "formik-chakra-ui"
import * as Yup from "yup"
import { tokenApi, mainApi } from "../../utils/api"
import {
  toast,
  getMainPoolContract,
  formatBalance,
  getTokenContract,
} from "../../utils"
import { t } from "../../i18n"
import { ToastProps, MAX_MINT, MIN_MINT } from "../../constants"

import store from "../../stores/account"
import ApproveBtn from "../ApproveBtn"

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
  const { isOpen, onClose, cb = () => {}, type } = props
  const initialValues: FormValues = { amount: 0, token: "senior" }
  const [tabIndex, setTabIndex] = React.useState(0)
  const [formType, setFormType] = React.useState("deposit")
  const themes = useTheme()
  const { address, signer } = store.useState("address", "signer")

  const isDeposit = formType === "deposit"
  const colorScheme = isDeposit ? "grass" : "reddish"
  const validationSchema = Yup.object({
    amount: Yup.number().required().positive().max(MAX_MINT).min(MIN_MINT),
    token: Yup.string().required(),
  })
  // const [txInfo, setTx] = useState()
  const [loading, setLoading] = useState(false)

  const JT = tokenApi("JUNIOR")
  const ST = tokenApi("SENIOR")
  const DAI = tokenApi("DAI")
  const [bals, setBals] = useState({ jtBal: "0", stBal: "0", daiBal: "0" })

  const fetchData = async () => {
    if (!address) return
    if (!isOpen || !JT || !ST || !DAI) return
    // const arr = [JT.getBalance(address), ST.getBalance(address)]
    const jtBal = await JT.getBalance(address)
    const stBal = await ST.getBalance(address)
    const daiBal = await DAI.getBalance(address)
    // console.log(formatBalance(jtBal), formatBalance(stBal), formatBalance(daiBal))
    setBals({
      jtBal: formatBalance(jtBal),
      stBal: formatBalance(stBal),
      daiBal: formatBalance(daiBal),
    })
  }

  useEffect(() => {
    setTabIndex(type === "deposit" ? 0 : 1)
    setFormType(type)
  }, [type, isOpen])

  useEffect(() => {
    fetchData()
  }, [isOpen])

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
    setFormType(index === 0 ? "deposit" : "withdraw")
  }

  const renderLable = (values: any) => {
    const token = values.token.toUpperCase()

    const title = t("input") + " " + (isDeposit ? "DAI" : token)
    const bal = isDeposit
      ? bals.daiBal + " DAI"
      : token === "SENIOR"
      ? bals.stBal + " " + token
      : bals.jtBal + " " + token
    return (
      <Flex color="textLabel" fontSize={12}>
        <Text>{title}</Text>
        <Spacer />
        <Text>{bal}</Text>
      </Flex>
    )
  }

  const renderOutput = (values: any) => {
    let { amount, token } = values
    token = token.toUpperCase()
    const output = isDeposit ? amount + " " + token + " token" : amount + " DAI"

    return (
      <Flex color="textLabel" fontSize={12}>
        <Text fontSize={16} fontWeight={500}>
          {output}
        </Text>
        <Spacer />
        {!isDeposit && <Text>{t("charge", { fee: "0.2" })}</Text>}
      </Flex>
    )
  }

  const tabStyle = (idx: number) => {
    const color = isDeposit ? themes.colors.primary : themes.colors.secondary

    const styles = {
      color: tabIndex === idx ? color : "",
      borderBottomColor: tabIndex === idx ? color : "transparent",
      marginBottom: "2px",
      border: "none",
      _selected: {
        boxShadow: `0px 2px 0px 0px ${color}`,
      },
      _focus: {
        boxShadow: "none",
      },
    }
    return styles
  }

  const btnStyle = {
    mt: "20px",
    width: "100%",
    h: "60px",
    colorScheme,
  }

  const onSub = async (values: any, actions: any) => {
    try {
      const { token, amount } = values
      const tokenApi = token === "junior" ? JT : ST

      if (!tokenApi) {
        return
      }

      let tx = null
      setLoading(true)
      if (isDeposit) {
        tx = await tokenApi.mint(amount, signer)
      } else {
        tx = await tokenApi.burn(amount, signer)
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
    } catch (error) {
      console.log(error)
    }
    // fetchData()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Tabs
            variant="unstyled"
            index={tabIndex}
            isFitted
            onChange={handleTabsChange}
          >
            <TabList>
              <Tab {...tabStyle(0)}>{t("deposit")}</Tab>
              <Tab {...tabStyle(1)}>{t("withdraw")}</Tab>
            </TabList>
          </Tabs>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text h={45} color="textDesc" fontSize={14}>
            {t(isDeposit ? "depositModalTip" : "withdrawModalTip")}
          </Text>
          <Formik
            initialValues={initialValues}
            onSubmit={onSub}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, values, errors, setFieldValue }) => (
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
                      }}
                      name="amount"
                    />
                    <InputRightElement>
                      <Button
                        mt="20px"
                        h="40px"
                        size="lg"
                        variant="unstyled"
                        _focus={{ boxShadow: "none" }}
                        onClick={() => {
                          // values.amount = +bals.daiBal
                          if (isDeposit) {
                            setFieldValue("amount", +bals.daiBal)
                          } else {
                            setFieldValue(
                              "amount",
                              values.token === "senior"
                                ? bals.stBal
                                : bals.jtBal,
                            )
                          }
                        }}
                      >
                        MAX
                      </Button>
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
                <Box mb={2}>
                  <Text fontSize={14} fontWeight={400}>
                    {t("expected")}
                  </Text>
                  {renderOutput(values)}
                </Box>
                <ApproveBtn
                  {...btnStyle}
                  token={isDeposit ? "DAI" : values.token}
                  contractAddr={getTokenContract(values.token)}
                >
                  <SubmitButton {...btnStyle} isLoading={loading}>
                    {t(formType)}
                  </SubmitButton>
                </ApproveBtn>
              </Box>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ConvertModal
