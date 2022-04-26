This project was bootstrapped with Create React App.

You can clone this project from here - https://github.com/ancutadaniel/ethereum_socialNetwork_app

Available Scripts

In the project directory, you can run in terminal:

### npm install

1 - Install all dependencies for this project

2 - Check and start the Ganache Blockchain locally

3 - Check Metamask to have proper network selected - RPC - http://127.0.0.1:7545 - custom network

4 - Import an account from Ganache to have ETH available for transactions

5 - After you install dependencies and prepare Ganache and Metamask you can run:

### truffle compile && truffle migrate --reset

or

### truffle migrate --reset -compile-all

6 - Run test to see that everything is ok

### truffle test

7 - You can check other information on console

### truffle console

8 - You can start the app locally running:

### npm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.

You may also see any lint errors in the console.

You should be able to create a new post and submit to blockchain

You should be able to tip the posts
