const SocialNetwork = artifacts.require('SocialNetwork');
const chai = require('chai');
const { assert } = require('chai');
const { default: Web3 } = require('web3');

chai.use(require('chai-as-promised')).should();

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('SocialNetwork', function (accounts) {
  let socialNetwork, post, postCount;

  before('check deploy', async () => {
    socialNetwork = await SocialNetwork.deployed();
    post = await socialNetwork.createPost('test', {
      from: accounts[0],
    });
    postCount = await socialNetwork.postCount();
  });

  describe('contract deployment', async () => {
    it('should assert true', async function () {
      await SocialNetwork.deployed();
      return assert.isTrue(true);
    });

    it('contract should have an address', async () => {
      const address = await socialNetwork.address;
      console.log(address);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.isString(address);
    });

    it('should have a name set', async () => {
      const name = await socialNetwork.name();
      console.log(name);
      assert.equal(name, 'SocialNetwork');
    });
  });

  describe('contract functions', async () => {
    it('create posts', async () => {
      assert.equal(postCount.toNumber(), 1, 'postCount should be incremented');
      // listen to event emitted
      const event = await post.logs[0].args;
      assert.equal(event.id.toNumber(), postCount.toNumber());
      assert.equal(event.content, 'test');
      assert.equal(event.author, accounts[0]);

      // Fail
      await socialNetwork.createPost('', { from: accounts[0] }).should.be
        .rejected;
    });

    it('list posts', async () => {
      const postCreated = await socialNetwork.posts(postCount);
      assert.equal(postCreated.id.toNumber(), postCount.toNumber());
      assert.equal(postCreated.content, 'test');
      assert.equal(postCreated.author, accounts[0]);
    });

    it('allow users to tip posts', async () => {
      // track the author balance
      let oldBalance;
      oldBalance = await web3.eth.getBalance(accounts[0]);
      // format balance
      oldBalance = new web3.utils.toBN(oldBalance);

      result = await socialNetwork.tipPost(postCount.toNumber(), {
        from: accounts[1],
        value: web3.utils.toWei('10', 'ether'),
      });

      // check new balance
      let newBalance;
      newBalance = await web3.eth.getBalance(accounts[0]);
      newBalance = new web3.utils.toBN(newBalance);
      // get the amount
      let addAmount;
      addAmount = await web3.utils.toWei('10', 'ether');
      addAmount = new web3.utils.toBN(addAmount);

      const expectedBalance = oldBalance.add(addAmount);

      assert.equal(
        expectedBalance.toString(),
        newBalance.toString(),
        'balance should be the same'
      );

      // check the event
      const event = await result.logs[0].args;

      assert.equal(event.id.toNumber(), postCount.toNumber());
      assert.equal(event.tipAmount, web3.utils.toWei('10', 'ether'));
      assert.equal(event.sender, accounts[1]);

      // FAIL
      await socialNetwork.tipPost(99, {
        from: accounts[1],
        value: web3.utils.toWei('5', 'ether'),
      }).should.be.rejected;
    });
  });
});
