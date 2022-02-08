// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getAllDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint256 public minContribution; //in wei
    mapping(address => bool) public contributors;
    uint256 public numContributors = 0;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minContribution);
        contributors[msg.sender] = true;
        numContributors++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public payable restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage selectedReq = requests[index];

        require(contributors[msg.sender]);
        require(!selectedReq.approvals[msg.sender]);

        selectedReq.approvals[msg.sender] = true;
        selectedReq.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > numContributors / 2);
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getCampaignDetails()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minContribution,
            address(this).balance,
            requests.length,
            numContributors,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
