pragma solidity ^0.4.17;

contract Lottery{

    address public manager;
    address[] public players;
    address public winner;

    function Lottery() public{
        manager =  msg.sender;
    }

    function getManager() public view returns (address){
        return manager;
    }

    //投注彩票
    function enter() public payable {
        require(msg.value == 1 ether);
        players.push(msg.sender);
    }
    //返回所有的投注彩票的人
    function  getAllPlayers() public view returns (address[]){
        return players;
    }
    function getBalance() public view returns(uint){
        return this.balance;
    }
    function getPlayersCount() public view returns(uint){
        return players.length;
    }

    function random() private view  returns (uint){
        return  uint(keccak256(block.difficulty, now, players));
    }

    //这个函数的返回值是当前交易的id
    function  pickWinner() public onlyManagerCanCall {
        uint index = random() % players.length;
        winner =  players[index];
        players = new address[](0) ;
        winner.transfer(this.balance);
    }

    function refund() public onlyManagerCanCall{

        for(uint i = 0;i<players.length;i++){
            players[i].transfer(1 ether);
        }
        players = new address[](0) ;
    }

    modifier onlyManagerCanCall(){
        require(msg.sender == manager);
        _;
    }

}