import { configureStore } from "@reduxjs/toolkit";

import contractSlice from "./contract/contractSlice";
import proposalSlice from "./proposals/proposalSlice";

const store = configureStore({
  reducer: {
    contract: contractSlice,
    proposal: proposalSlice,
  },
});
export default store;
