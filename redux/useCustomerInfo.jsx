import Purchases from "react-native-purchases";
import React from 'react'
import Config from "./config";

const useCustomerInfo = () => {
    const [customerInfo, setCustomerInfo] = React.useState(null);

    const getCustomerInfo = async () => {
        const APIKeys = {
            apple: Config.RevenueCat_API_KEY.apple,
            google: Config.RevenueCat_API_KEY.google
        };

        Purchases.setDebugLogsEnabled(true);
        if (Platform.OS == "android") {
            await Purchases.configure({ apiKey: APIKeys.google });
        } else {
            await Purchases.configure({ apiKey: APIKeys.apple });
        }

        let customerInfo = await Purchases.getCustomerInfo();
        setCustomerInfo(customerInfo);
    }

    return [customerInfo, getCustomerInfo]
}

export default useCustomerInfo