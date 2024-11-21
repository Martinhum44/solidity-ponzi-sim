import React, { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import Web3Button from "./Web3Button";
import getValue from "./getValue";

function App() {
  const addr = "0x608B2bF8b590ff77D893ffF5Ef0576Fb94Aca2dD";
  const ABI = [
    {
      "inputs": [],
      "name": "add",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_count",
          "type": "uint256"
        }
      ],
      "name": "set",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sub",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const [counter, setCount] = useState(0); 
  const [userAddress, setUserAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [whatToSet, setWhatToSet] = useState(0);

  useEffect(() => {
    if (contract) {
      getValue("get", contract)
        .then(value => {
          setCount(value);
        })
    }
  }, [contract]);

  const handleSetCallback = () => {
    getValue("get", contract)
      .then(value => {
        setCount(value);
      })
  };

  return (
    <>
      <ConnectWallet
        contractAddress={addr}
        contractABI={ABI}
        callback={(account, contract) => {
          setUserAddress(account);
          setContract(contract);
        }}
        handleChange={(account) => setUserAddress(account)}
      />
      <Web3Button
        contract={contract}
        address={userAddress}
        function="add"
        text="Add"
        callback={handleSetCallback}
      />
      <div style={{display:"flex", justifyContent:"center"}}>
      <input
        type="number"
        value={whatToSet}
        style={{width: "300px",
          border: "none",
          fontFamily: "Inter, Arial, Helvetica, sans-serif",
          height: "50px",
          margin: "0",
          borderRadius: "10px",
          fontSize: "20px",
          backgroundColor: "#d5d2cd",
          display: "inline"}}
        onChange={(e) => setWhatToSet(Number(e.target.value))} 
      />
      </div>
      <Web3Button
        contract={contract}
        address={userAddress}
        function="set"
        text="Set"
        params={[whatToSet]}
        callback={handleSetCallback}
      />
      <div style={{display:"flex", justifyContent:"center"}}>
      <h1 style={{ fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif" }}>{String(counter)}</h1>
      </div>
    </>
  );
}

export default App;
