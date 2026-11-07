"use client"; // Ensures this component is only used on the client side

import { store } from "@/src/redux/store/store";
import { Provider } from "react-redux";
import AuthSessionProvider from "./AuthSessionProvider";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}><AuthSessionProvider>{children}</AuthSessionProvider></Provider>;
};

export default ReduxProvider;
