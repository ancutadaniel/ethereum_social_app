const NewContract = artifacts.require("NewContract");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("NewContract", function (/* accounts */) {
  it("should assert true", async function () {
    await NewContract.deployed();
    return assert.isTrue(true);
  });
});
