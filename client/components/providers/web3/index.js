import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "@utils/loadContract";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { setupHooks } from "./hooks/setupHooks";

const Web3Context = createContext(null);

const createWeb3State = ({ web3, provider, contract, isLoading }) => ({
  web3,
  provider,
  contract,
  isLoading,
  hooks: setupHooks({ web3, provider, contract }),
});

export default function Web3Provider({ children }) {
  const [web3Api, setWeb3Api] = useState(
    createWeb3State({
      web3: null,
      provider: null,
      contract: null,
      isLoading: true,
    })
  );

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        let contract;
        try {
          contract = await loadContract("CourseMarketplace", web3);
        } catch (err) {
          console.error(err);
        }
        setWeb3Api(
          createWeb3State({
            web3,
            provider,
            contract,
            isLoading: false,
          })
        );
      } else {
        setWeb3Api({ ...web3Api, isLoading: false });
        console.error("Please install Metamask");
      }
    };
    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    const { web3, provider, isLoading } = web3Api;
    return {
      ...web3Api,
      requireInstall: !isLoading && !web3,
      connect: provider
        ? async () => {
            try {
              await provider.request({ method: "eth_requestAccounts" });
            } catch (err) {
              console.error(err);
              location.reload();
            }
          }
        : () =>
            console.error(
              "Cannot connect to Metamask, try reloading your browser"
            ),
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  return useContext(Web3Context);
};

export const useHooks = (callback) => {
  const { hooks } = useWeb3();
  return callback(hooks);
};
