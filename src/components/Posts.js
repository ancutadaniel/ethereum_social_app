import { Button, Card, Image } from 'semantic-ui-react';
import Identicon from 'identicon.js';

import './Post.css';

const Posts = ({ posts, web3, contract, showPosts, accounts }) => {
  const options = {
    foreground: [0, 0, 0, 255], // rgba black
    background: [181, 204, 24, 100], // rgba white
    margin: 0.2, // 20% margin
    size: 420, // 420px square
    format: 'svg', // format
  };

  const handleTip = async (id) => {
    try {
      const tip = web3.utils.toWei('0.1', 'ether');
      await contract.methods.tipPost(id).send({
        from: accounts[0],
        value: tip,
      });
      showPosts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card.Group>
      {posts
        .sort((a, b) => (a.tipAmount < b.tipAmount ? 1 : -1))
        .map((item) => {
          const { id, content, tipAmount, author } = item;
          return (
            <Card key={id}>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src={`data:image/svg+xml;base64,${new Identicon(
                    author,
                    options
                  ).toString()}`}
                />
                <Card.Header className='header'>{author}</Card.Header>
                <Card.Meta>Author address</Card.Meta>
                <Card.Description>{content}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='content_extra'>
                  <p>TIPS: {web3.utils.fromWei(tipAmount)} ETH</p>
                  <Button basic color='green' onClick={() => handleTip(id)}>
                    Tip Post 0.1 ETH
                  </Button>
                </div>
              </Card.Content>
            </Card>
          );
        })}
    </Card.Group>
  );
};

export default Posts;
