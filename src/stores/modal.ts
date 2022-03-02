import { atom } from "recoil"

export enum AppModal {
  SwitchNetwork,
}

type ModalState = {
  currentModal?: AppModal
}

export const initialState: ModalState = {}

export const AppModalState = atom({
  key: "modal", // unique ID (with respect to other atoms/selectors)
  default: initialState, // default value (aka initial value)
})
