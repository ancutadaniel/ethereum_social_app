// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SocialNetwork {
  string public name;
  uint public postCount = 0;
  // Post structure
  struct Post {
    uint id;
    string content; 
    uint tipAmount;
    address payable author;
  }
  // List of posts
  mapping(uint => Post) public posts;

  constructor() {
    name = "SocialNetwork";
  }

  event CreatePost (uint id, string content, uint tipAmount, address author);
  event TipPost(uint id, uint tipAmount, address sender);

  function createPost(string memory _content) public {
    require(bytes(_content).length > 3, 'content should have at least 3 characters');

    postCount += 1;
    Post memory newPost = Post(postCount, _content, 0, payable(msg.sender));
    posts[postCount] = newPost;
    emit CreatePost(postCount, _content, 0, msg.sender);
  }

  function tipPost(uint _id) public payable {
      // make sure the product has a correct id
      require(_id > 0 && _id <= postCount, 'id is not valid');
      // fetch product
      Post memory newPost = posts[_id];
      // fetch the author and transfer the ETH
      newPost.author.transfer(msg.value);
      // add the tip to post
      newPost.tipAmount += msg.value;
      // update the posts
      posts[_id] = newPost;

      // emit the event
      emit TipPost(_id, msg.value, msg.sender);
  }

}
