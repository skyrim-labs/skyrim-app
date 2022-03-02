import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
} from "@chakra-ui/react"
import { investPoolApi } from "../../utils/api"

import { t } from "../../i18n"
import { _fetchData } from "@ethersproject/web"
import store from "../../stores/account"
import { formatBalance } from "../../utils"

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  cb?: () => void
}

const HistoryModal = (props: Props) => {
  const { isOpen, onClose } = props

  const JTPool = investPoolApi("junior")
  const STPool = investPoolApi("senior")
  const { address } = store.useState("address")
  const [records, setRecords] = useState([])

  const fetchData = async () => {
    if (!JTPool || !STPool) {
      return
    }

    const jtRes = await JTPool.queryInterestList(address)
    const stRes = await STPool.queryInterestList(address)
    const records = jtRes.concat(stRes)
    console.log(records) // todo check reward
    // @ts-ignore
    setRecords(records)
  }

  useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const handleReceive = () => {
    console.log("recevie")
  }

  const renderRows = () => {
    return records.map((rec: any, idx) => {
      const { decode, data, topics } = rec
      const res = decode(data, topics)
      return (
        <Tr fontSize="12px" key={idx} fontWeight={400} color="tableText">
          <Td pt="25px">{rec.blockNumber}</Td>
          <Td pt="25px">{rec.token}</Td>
          <Td pt="25px">{formatBalance(res.amount)}</Td>
          <Td pt="25px">{rec.event}</Td>
        </Tr>
      )
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      autoFocus={false}
      isCentered
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Table variant="unstyled" size="sm">
            <Thead borderBottom="1px solid #D9DEE1">
              <Tr h="66px" fontSize="12px" fontWeight={600} color="tableTitle">
                <Th>{t("height")}</Th>
                <Th>{"Token"}</Th>
                <Th>{t("amount")}</Th>
                <Th>{t("opt")}</Th>
              </Tr>
            </Thead>
            <Tbody>{renderRows()}</Tbody>
          </Table>
          <Center pt="32px" mb={4}>
            <Button
              w="330px"
              h="44px"
              colorScheme="grass"
              onClick={() => onClose()}
            >
              {t("close")}
            </Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default HistoryModal
