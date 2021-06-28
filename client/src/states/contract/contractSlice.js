import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  owner: null,
  status: 0,
  userVoterData: {
    hasVoted: false,
    isRegistered: false,
    votedProposalId: 0,
  },
  whitelistedList: [],
};

export const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    fetchOwner: (state, action) => {
      state.owner = action.payload;
    },
    updateWorkflowStatus: (state, action) => {
      state.status = action.payload;
    },
    fetchUserVoterData: (state, action) => {
      state.userVoterData = action.payload;
    },
    fetchWhitelistedList: (state, action) => {
      state.whitelistedList = action.payload;
    },
    addWhitelistAddress: (state, action) => {
      state.whitelistedList.push(action.payload.newWhitelist);
      if (action.payload.isAlsoOwner) {
        state.userVoterData.isRegistered = action.payload.isAlsoOwner;
      }
    },
    addUserHasVote: (state, action) => {
      state.userVoterData.hasVoted = action.payload.hasVoted;
      state.userVoterData.votedProposalId = parseInt(action.payload.proposalId);
    },
  },
});

export const {
  fetchOwner,
  updateWorkflowStatus,
  fetchUserVoterData,
  fetchWhitelistedList,
  addWhitelistAddress,
  addUserHasVote,
} = contractSlice.actions;

export default contractSlice.reducer;
