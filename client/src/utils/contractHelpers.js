export function getContract(contractJSON, library, chainId) {
  if (!contractJSON) {
    throw Error(`JSON file empty`);
  }
  const deployedNetwork = contractJSON.networks[chainId];
  return new library.eth.Contract(
    contractJSON.abi,
    deployedNetwork && deployedNetwork.address
  );
}
