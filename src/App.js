import React, { useCallback, useEffect, useState } from 'react';
import getWeb3 from './utils/getWeb3';

import SocialNetwork from '../src/build/abi/SocialNetwork.json';
import MainMenu from './components/MainMenu';
import AddPost from './components/AddPost';
import Posts from './components/Posts';

import {
  Container,
  Grid,
  GridRow,
  GridColumn,
  Segment,
  Dimmer,
  Loader,
  Divider,
} from 'semantic-ui-react';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [web3, setWeb3] = useState({});

  const [posts, setPosts] = useState([]);

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      if (web3) {
        const getAccounts = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();
        // get contract data on this network
        const newData = await SocialNetwork.networks[getNetworkId];
        // check contract deployed networks
        if (newData) {
          // get contract deployed address
          const contractAddress = newData.address;
          // create a new instance of the contract - on that specific address
          const contractData = await new web3.eth.Contract(
            SocialNetwork.abi,
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

  const showPosts = useCallback(async () => {
    setLoading(true);
    try {
      const postCount = await contract.methods.postCount().call();
      let postsArr = [];

      for (let i = 1; i < postCount; i++) {
        const post = await contract.methods.posts(i).call();
        const { id, content, tipAmount, author } = post;

        postsArr.push({
          id,
          content,
          tipAmount,
          author,
        });
      }

      setPosts(postsArr);
      setLoading(false);
    } catch (error) {
      console.lor(error);
      alert(
        'Check if Smart Contract is compiled and deployed, run truffle compile && truffle migrate --reset'
      );
    }
  }, [contract.methods]);

  useEffect(() => {
    if (contract && contract?.options?.address) showPosts();
  }, [contract, contract.methods, showPosts]);

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className='App'>
      <MainMenu account={accounts[0]} />
      {loading && (
        <Container>
          <Grid columns={1}>
            <GridRow>
              <GridColumn>
                <Segment style={{ height: 150 }}>
                  <Dimmer active>
                    <Loader size='medium'>Loading</Loader>
                  </Dimmer>
                </Segment>
              </GridColumn>
            </GridRow>
          </Grid>
        </Container>
      )}
      {!loading && (
        <>
          <Container>
            <Segment>
              Posts
              <Divider />
              <Posts
                posts={posts}
                web3={web3}
                contract={contract}
                accounts={accounts}
                showPosts={showPosts}
              />
            </Segment>
          </Container>
          <Divider horizontal>Or</Divider>
          <Container>
            <Segment>
              Add New Post
              <Divider />
              <AddPost
                contract={contract}
                accounts={accounts}
                showPosts={showPosts}
              />
            </Segment>
          </Container>
        </>
      )}
    </div>
  );
};

export default App;
