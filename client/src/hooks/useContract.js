import VOTING_CONTRACT from "../contracts/Voting.json";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { getContract } from "../utils/contractHelpers";

export function useContract() {
  const { library, chainId } = useWeb3React();
  return useMemo(() => {
    if (!library) return null;
    try {
      return getContract(VOTING_CONTRACT, library, chainId);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [library, chainId, VOTING_CONTRACT]);
}
