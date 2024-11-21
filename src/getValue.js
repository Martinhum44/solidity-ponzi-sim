async function getValue(_function, _contract, _params = undefined){
    if(typeof _params !== "object" && _params){
        throw new Error("Params must be an array.")
    }

    if(typeof _contract !== "object"){
        throw new Error("Contract must be your contract object.")
    }

    if(typeof _function !== "string"){
        throw new Error("Function must be the string name of the function you want to call.")
    }

    try{
        const func = _contract.methods[_function]
        console.log(func)
        if(!_params){
            return await func().call()
        } 
        return await func(..._params).call()
    } catch(e){
        console.error(e)
    }
}

export default getValue