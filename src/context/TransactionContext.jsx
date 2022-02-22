import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
import Web3 from  "web3";


import { contractABI, contractAddress } from "../utils/constants";
export const TransactionContext = React.createContext();

const { ethereum } = window;

// const createEthereumContract = () => {

//  console.log("ABI is ",contractABI);
//  console.log("Contract address is ",contractAddress);
//   let web3=new Web3(ethereum);
//   let transactionsContract=new web3.eth.Contract(contractABI,contractAddress);
//   // const provider = new ethers.providers.Web3Provider(ethereum);
//   // const signer = provider.getSigner();
//   // const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

//   return transactionsContract;
// };




export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        // const transactionsContract = createEthereumContract();

        // const availableTransactions = await transactionsContract.getAllTransactions();

        let web3=new Web3(ethereum);
        let transactionsContract=new web3.eth.Contract(contractABI,contractAddress);
        let availableTransactions =await transactionsContract.methods.getAllTransactions().call();

 
        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount:web3.utils.fromWei(transaction.amount)
          // amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } 
    catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {

        let web3=new Web3(ethereum);
        let transactionsContract=new web3.eth.Contract(contractABI,contractAddress);
        let currentTransactionCount =await transactionsContract.methods.getTransactionCount().call();


        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
console.log(accounts);
      setCurrentAccount(accounts[0]);
      getAllTransactions();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;

        setIsLoading(true);

         let web3=new Web3(ethereum);
         let transactionsContract=new web3.eth.Contract(contractABI,contractAddress);

  

  let nonce=await web3.eth.getTransactionCount(currentAccount);
  console.log("First nonce is ",nonce);
  let gasPrice=await web3.eth.getGasPrice();
  const netWorkId=await web3.eth.net.getId();
  const value=web3.utils.toWei(amount,"ether");

  // console.log("Latest gas price is ",gasPrice)

  var rawTransaction = {
    from: `${currentAccount}`,
    nonce,
    gasPrice,
    gas:21000,
    to: `${addressTo}`,
    value,
    chainId:netWorkId
};

let hash=await web3.eth.sendTransaction(rawTransaction)

console.log(hash.transactionHash);


        const tx = transactionsContract.methods.addToBlockchain(addressTo, value, message, keyword);
        const data=tx.encodeABI();  

        const gas=await tx.estimateGas({from:currentAccount});
        nonce=await web3.eth.getTransactionCount(currentAccount);
        gasPrice=await web3.eth.getGasPrice();
        // console.log("Second nonce is ",nonce);
        // console.log("Gass used for calling add to is ",gas);

          var rawTranst= {
    from: `${currentAccount}`,
    nonce,
    gasPrice,
    gas,
    to: `${contractAddress}`,
    data,
    chainId:netWorkId
};
   
let has=await web3.eth.sendTransaction(rawTranst)

console.log(has.transactionHash);
        console.log("Calling");
let result =await transactionsContract.methods.getAllTransactions().call();
console.log(result);

console.log("Finished");
              
        setIsLoading(false);

        let currentTransactionCount =await transactionsContract.methods.getTransactionCount().call();


        setTransactionCount(currentTransactionCount);
      } else {
        console.log("No ethereum object ");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      throw new Error("transaction Failed");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,


      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};