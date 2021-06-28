export const serializeProposalDescription = (string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

export const serializeProposal = (proposal) => {
  return {
    description: proposal.description,
    voteCount: parseInt(proposal.voteCount),
  };
};

export const serializeVoter = (voter) => {
  return {
    hasVoted: voter.hasVoted,
    isRegistered: voter.isRegistered,
    votedProposalId: parseInt(voter.votedProposalId),
  };
};
