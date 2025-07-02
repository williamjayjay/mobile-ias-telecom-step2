import { showMessage } from "react-native-flash-message";

const showMessageError = (errorMessage: string, duration: number = 2600) => {
  showMessage({
    message: errorMessage,
    type: "danger",
    animated: true,
    icon: "danger",
    duration: duration,
    hideOnPress: true,
    statusBarHeight: 48
  })
}

const showMessageSuccess = (successMessage: string) => {
  showMessage({
    message: successMessage,
    type: "success",
    animated: true,
    icon: "success",
    duration: 2000,
    hideOnPress: true,
    statusBarHeight: 48,
  });
};


export { showMessageError, showMessageSuccess }
