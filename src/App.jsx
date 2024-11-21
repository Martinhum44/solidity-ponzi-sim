import React, { useState, useEffect } from "react";
import ConnectWallet from "./ConnectWallet";
import Web3Button from "./Web3Button";
import getValue from "./getValue";
import style from "./style.module.css"

function App() {
  const addr = "0x060F6EAa781B2254DBbCFa5a5610Fb2A8FcD81b7";
  const ABI = [
    {
      "inputs": [],
      "name": "buy",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deinvest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "invest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ownerOFF",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "referer",
          "type": "address"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "balances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "currentlyInvested",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "GETH",
      "outputs": [
        {
          "internalType": "contract ERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserStruct",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address[]",
              "name": "referees",
              "type": "address[]"
            },
            {
              "internalType": "uint256",
              "name": "invested",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "referer",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "registered",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "investedTimestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct main.User",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "maxWithraw",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "WGEM",
      "outputs": [
        {
          "internalType": "contract ERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const [registered, setRegistered] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [reff, setReff] = useState("");
  const [WGEM, setWGEM] = useState(0)
  const [GETH, setGETH] = useState(0)
  const [withd, setWithd] = useState(0)
  const [invamount, setInvamount] = useState(0)
  const [invamount2, setInvamount2] = useState(0)
  const [referees, setReferees] = useState([])
  const [currentlyInvested, setCurrentlyInvested] = useState(0)
  const inputStyles = {
    width: "200px",
    border: "none",
    fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif",
    height: "50px",
    margin: "0",
    borderRadius: "10px",
    fontSize: "20px",
    backgroundColor: "#d5d2cd",
    display: "inline",
    marginBottom: "10px"
  }

  function getBal(){
    (getValue("balances", contract, [userAddress])).then(a => {
      for (var key in a){
        if(key == 0){
          setGETH(Number(a[key]))
          console.log(a[key])
        }
  
        if(key == 1){
          setWGEM(Number(a[key]))
        }
      }
    })
    
  }

  async function getCurrentlyInvested(){
    const a = (await getValue("currentlyInvested", contract, [userAddress]))
    for (var key in a){
      if(key == 0){
        setCurrentlyInvested(Number(a[key]))
      }
    }
  }

  useEffect(() => {
    async function f() {
      const a = (await getValue("getUserStruct", contract, [userAddress]))
      for (var key in a) {
        if (key === "registered") {
          setRegistered(a[key])
        }

        if (key === "referees"){
          setReferees(a[key])
        }
      }
    }
    f()
    async function g(){
      await getBal()
    }
    g()
    async function h(){
      await getCurrentlyInvested()
    }
    h()
  }, [userAddress])

  const update = () => {
    const id = setInterval(async() => {
    await getCurrentlyInvested()
  },1000)}

  const update2 = () => {const id = setInterval(async() => {
    await getCurrentlyInvested()
    getBal()
  },1000)
  return () => clearInterval(id)}

  useEffect(update2, [userAddress])

  const ur = () => setRegistered(true)

  return (
    <div style={{ textAlign: "center" }}>
      <ConnectWallet contractABI={ABI} contractAddress={addr} callback={(a, c) => {
        setUserAddress(a)
        setContract(c)
      }}
        handleChange={(a) => { setUserAddress(a) }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className={style.container} style={{ display: !registered ? "block" : "none" }}>
          <input
            value={reff}
            style={inputStyles}
            onChange={(e) => setReff((e.target.value))}
            placeholder="Referer address"
          />
          <Web3Button contract={contract} address={userAddress} callback={ur} function="register" params={[reff]} text="Register" />
        </div>
      </div>

      <div style={{ display: registered && userAddress != null ? "block" : "none" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={style.container} style={{width:"400px"}}>
            <h1 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>GETH: {String((GETH/1000000000/1000000000).toFixed(8))}</h1>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={style.container} >
            <h1 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Give ETH for GETH</h1>
            <input style={inputStyles} value={invamount} onChange={(e) => setInvamount(e.target.value)} placeholder="amount"/>
            <Web3Button contract={contract} address={userAddress} function="buy" params={[invamount]} text="Buy" callback={update} value={invamount*10**18}/>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={style.container} >
            <h1 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Invest GETH to Grow!</h1>
            <input style={inputStyles} value={invamount2} onChange={(e) => setInvamount2(e.target.value)} placeholder="GETH amount"/>
            <Web3Button contract={contract} address={userAddress} function="invest" params={[invamount2*10**18]} text="Invest" callback={update}/>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={style.container} >
            <h1 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Deinvest</h1>
            <h2 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Currently Invested: {(currentlyInvested != 0 ? (currentlyInvested/1000000000/1000000000).toFixed(8) : "Nothing")}</h2>
            <Web3Button contract={contract} address={userAddress} function="deinvest" text="Deinvest" callback={update}/>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={style.container} >
            <h1 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Referees</h1>
            <ul style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>{referees.length != 0 ? referees.map((ref) => {
              return <li><a style={{textDecoration:"none"}} href={`https://etherscan.io/address/${ref}`}>{ref}</a></li>
            }):"No Referrees"}</ul>
            <h3 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif", display: referees.length != 0 ? "block":"none"}}>WGEM balance: {(WGEM/1000000000/1000000000).toFixed(8)}</h3>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={style.container} >
            <h1 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Withdraw</h1>
            <h2 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>Maximum Possible Withdrawl: {GETH < (WGEM/3) ? (GETH/1000000000/1000000000).toFixed(8) : (WGEM/3000000000/1000000000).toFixed(8)}</h2>
            <h3 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>GETH balance: {(GETH/1000000000/1000000000).toFixed(8)}</h3>
            <h3 style={{fontFamily: "Inter, system-ui, Arial, Helvetica, sans-serif"}}>WGEM balance: {(WGEM/1000000000/1000000000).toFixed(8)}</h3>
            <input style={inputStyles} value={withd} onChange={(e) => setWithd(e.target.value)} placeholder="Withdrawl amount"/>
            <Web3Button contract={contract} address={userAddress} function="withdraw" text="Withdraw" callback={update} params={[withd*10**9*10**9]}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;