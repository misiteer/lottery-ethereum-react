//部署智能合约到真实的rankeby网络
const Web3 = require('web3');
const {interface,bytecode} = require('./compile');
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "put setup mechanic reject trial cloth sign timber recycle clock agree police";
const provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/3d001125fb2344309c9afca64c974444");
const web3 = new Web3(provider);

deploy =async ()=>{
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    const result =await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data:bytecode
        }).send({
            from:accounts[0],
            gas:'3000000'
        });
    console.log('address:'+result.options.address);

    console.log('------------------一条华丽的分割线----------------------');
    console.log(interface);
};
deploy();