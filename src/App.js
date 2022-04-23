import React, { useEffect, useState } from 'react';
import getWeb3 from './utils/getWeb3';

import NewContract from '../src/build/abi/NewContract.json';
import MainMenu from './components/Menu';

import { Button, Container, Form, Divider, Image } from 'semantic-ui-react';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [web3, setWeb3] = useState({});

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      if (web3) {
        const getAccounts = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();
        // get contract data on this network
        const newData = await NewContract.networks[getNetworkId];
        // check contract deployed networks
        if (newData) {
          // get contract deployed address
          const contractAddress = newData.address;
          // create a new instance of the contract - on that specific address
          const contractData = await new web3.eth.Contract(
            NewContract.abi,
            contractAddress
          );

          setContract(contractData);
        } else {
          alert('Smart contract not deployed to selected network');
        }
        setWeb3(web3);
        setAccounts(getAccounts);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className='App'>
      <MainMenu account={accounts[0]} />

      <Divider horizontal>§</Divider>
      <Container></Container>
    </div>
  );
};

export default App;
