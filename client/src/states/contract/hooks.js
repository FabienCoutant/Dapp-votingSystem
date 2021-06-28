import { useEffect, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { useContract } from "../../hooks/useContract";
import {
  fetchOwner,
  fetchWhitelistedList,
  fetchUserVoterData,
  updateWorkflowStatus,
} from "./contractSlice";
import { serializeVoter } from "../../utils/formatProposal";

export const useFetchOwner = () => {
  const dispatch = useDispatch();
  const contract = useContract();
  useEffect(() => {
    const getOwner = async () => {
      const res = await contract.methods.owner().call();
      dispatch(fetchOwner(res));
    };
    if (contract !== null) {
      getOwner();
    }
  }, [contract, dispatch]);
};

export const useIsOwner = () => {
  const { account } = useWeb3React();
  const owner = useSelector((state) => state.contract.owner);
  return useMemo(() => owner === account, [account, owner]);
};
export const useIsWhitelisted = () => {
  const { account } = useWeb3React();
  const isRegistered = useSelector(
    (state) => state.contract.userVoterData.isRegistered
  );
  return useMemo(() => isRegistered === account, [account, isRegistered]);
};

export const useUserData = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const contract = useContract();
  useEffect(() => {
    const getVoterData = async () => {
      const res = await contract.methods.getVoterInfoByAddress(account).call();
      dispatch(fetchUserVoterData(serializeVoter(res)));
    };
    if (contract !== null) {
      getVoterData();
    }
  }, [contract, account, dispatch]);
};

export const useFetchWhitelistedAddr = () => {
  const dispatch = useDispatch();
  const contract = useContract();
  useEffect(() => {
    const getWhitelistedAddresses = async () => {
      const res = await contract.methods.getListOfWhitelist().call();
      const whitelisted = res.filter(async (user) => {
        const r = await contract.methods.getVoterInfoByAddress(user).call();
        return r.isRegistered;
      });
      dispatch(fetchWhitelistedList(whitelisted));
    };
    if (contract !== null) {
      getWhitelistedAddresses();
    }
  }, [contract, dispatch]);
};

export const useFetchWorkflowStatus = () => {
  const dispatch = useDispatch();
  const contract = useContract();
  useEffect(() => {
    const getWorkflowStatus = async () => {
      const res = parseInt(await contract.methods.getCurrentStatus().call());
      dispatch(updateWorkflowStatus(res));
    };
    if (contract !== null) {
      getWorkflowStatus();
    }
  }, [contract, dispatch]);
};
