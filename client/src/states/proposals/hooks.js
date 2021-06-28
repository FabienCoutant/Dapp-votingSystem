import { useDispatch, useSelector } from "react-redux";
import { useContract } from "../../hooks/useContract";
import { useEffect } from "react";
import { fetchProposalList, setWinnerProposalId } from "./proposalSlice";
import { serializeProposal } from "../../utils/formatProposal";

export const useFetchProposalsList = () => {
  const dispatch = useDispatch();
  const contract = useContract();
  useEffect(() => {
    const getProposalList = async () => {
      const res = await contract.methods.getProposals().call();
      const proposals = res.map((proposal) => {
        return serializeProposal(proposal);
      });
      dispatch(fetchProposalList(proposals));
    };
    if (contract !== null) {
      getProposalList();
    }
  }, [contract, dispatch]);
};

export const useFetchWinnerId = () => {
  const dispatch = useDispatch();
  const contract = useContract();
  const workflowStatus = useSelector((state) => state.contract.status);
  useEffect(() => {
    const getWinnerProposalId = async () => {
      const winnerId = await contract.methods.getWinningProposalId().call();
      dispatch(setWinnerProposalId({ winnerId }));
    };
    if (contract !== null && workflowStatus === 5) {
      getWinnerProposalId();
    }
  }, [contract, dispatch, workflowStatus]);
};
