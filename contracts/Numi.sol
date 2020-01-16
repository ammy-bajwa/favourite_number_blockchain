pragma solidity >=0.4.22 <0.6.0;

contract Numi {
   mapping(address => uint) public users;
   function setUser(address _userAddress, uint _num) public returns(bool){
       users[_userAddress] = _num;
       return true;
   }
}