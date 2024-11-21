import React, { useState, useEffect } from "react"
import Web3 from "web3"
import PropTypes from "prop-types"

function ConnectWallet(props) {
    const web3 = new Web3(window.ethereum)
    const [clicked, setClicked] = useState(false)
    const [msg, setMsg] = useState("Connect Wallet")
    const [loggedIn, setLoggedIn] = useState(false);
    const [accounts, setAccounts] = useState([])
    const [theAccount, setTheAccount] = useState()
    const [buttonStyle, setButtonStyle] = useState({
        width: "150px",
        border: "none",
        height: "50px",
        borderRadius: "10px",
        color: props.color || "white",
        backgroundColor: props.backgroundColor || "black",
        opacity: loggedIn ? "1" : "0.8",
        fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "18px",
    })

    if (!props.contractAddress) {
        throw new Error("You must specifiy your contract's address.")
    }

    if (!props.contractABI) {
        throw new Error("You must specifiy your contract's ABI.")
    }

    if(!props.callback){
        throw new Error("You must specifiy the callback function.")
    }

    if(!props.handleChange){
        throw new Error("You must specifiy the function that will run when the accout changes.")
    }

    useEffect(() => {
        if(localStorage.getItem("accounts") != null && localStorage.getItem("accounts") != undefined && localStorage.getItem("Accounts") != null && localStorage.getItem("Accounts") != undefined){
            const accs = JSON.parse(localStorage.getItem("accounts"))
            const account = accs[0];
            setMsg(m => `${account.slice(0, 6)}...${account.slice(-5)}`);
            setTheAccount(account)
            setAccounts(accs)
            console.log(document.body.style.backgroundColor)
            setLoggedIn(true)
            const contract = new web3.eth.Contract(props.contractABI, props.contractAddress);

            console.log(account, contract)
            props.callback(account, contract);
        } 
    }, [])

    useEffect(() => {
        const changeBack = props.handleChange
        setMsg(m => theAccount != null || theAccount != undefined ? `${theAccount.slice(0, 6)}...${theAccount.slice(-5)}`:"Connect Wallet");
        setClicked(false)
        changeBack(theAccount)
    }, [theAccount])



    async function handleLogin() {
        if (window.ethereum) {
            if (!loggedIn) {
                const accs = (await window.ethereum.request({ method: "eth_requestAccounts" }));
                const account = accs[0];
                setMsg(m => `${account.slice(0, 6)}...${account.slice(-5)}`);
                const callback = props.callback;
                const contract = new web3.eth.Contract(props.contractABI, props.contractAddress);

                console.log(account, contract)

                callback(account, contract);       
                setLoggedIn(true);
                setAccounts(accs)
                setTheAccount(account)
                localStorage.setItem("accounts",JSON.stringify(accs))
            } else {
                setClicked( c => !c)
            }
        } else {
            alert("Please install a crypto wallet.");
        }
    }
    
    const mapped = accounts.map(acc => {
        console.log(acc)
        return <option value={acc} key={acc}>{acc}</option>
    })

    function handleHover(){
        setButtonStyle(style => ({...style, opacity:"0.65"}))
        console.log(accounts)
    }

    function handleLeave(){
        setButtonStyle(style => ({...style, opacity: loggedIn ? "1" : "0.8"}))
    }

    function handleDisconect(){
        localStorage.clear()
        setAccounts([])
        setMsg("Connect Wallet")
        setLoggedIn(false)
        setTheAccount(null)
        setClicked(false)
    }

    function handleSet(event){
        setTheAccount(event.target.value)
    }

    return (
        <div style={{display:"flex",justifyContent:"center"}}>
            <button style={{border:"none",borderRadius:"10px",backgroundColor:document.body.style.backgroundColor || buttonStyle.backgroundColor,  marginBottom: "10px"}}><button style={buttonStyle} onClick={handleLogin} onMouseOver={handleHover} onMouseLeave={handleLeave}>{msg}</button> 
            <div style={{display: clicked ? "block" : "none", width: "250px", height: "60px", padding:"5px", backgroundColor:"#2C2B2B", borderRadius:"10px", position:"absolute"}}>
                <select style={{fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", backgroundColor:"white", width:"95%", borderRadius:"5px", backgroundColor:"black",color:"white", border:"none", marginBottom:"15px"}} onClick={handleSet}>{mapped}</select>
                <button style={{fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", border:"none", borderRadius: "5px", backgroundColor:"red", color:"white", width:"95%"}} onClick={handleDisconect}>Disconect Wallet</button>
            </div>
            </button>
        </div>
    ) 
}

ConnectWallet.propTypes = {
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    callback: PropTypes.func,
    contractAddress: PropTypes.string,
    contractABI: PropTypes.array,
    handleChange: PropTypes.func
}

export default ConnectWallet