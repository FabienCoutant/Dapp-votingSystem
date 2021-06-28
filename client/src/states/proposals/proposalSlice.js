import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const initialState = {
  proposalList: [],
  winnerId: null,
};

export const proposalSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {
    fetchProposalList: (state, action) => {
      state.proposalList = action.payload;
    },
    addProposal: (state, action) => {
      state.proposalList.push(action.payload);
    },
    addProposalVote: (state, action) => {
      state.proposalList[action.payload].voteCount =
        state.proposalList[action.payload].voteCount + 1;
    },
    setWinnerProposalId: (state, action) => {
      state.winnerId = parseInt(action.payload.winnerId);
    },
  },
});

export const {
  fetchProposalList,
  addProposal,
  addProposalVote,
  setWinnerProposalId,
} = proposalSlice.actions;

export default proposalSlice.reducer;
