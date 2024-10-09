# StorSwift Power Voting

## 1. Overview

Power Voting dApp is implemented according to [Filecoin Community Voting Specs](https://docs.google.com/document/d/13910NE-O3mUQ6rztt6f3xe7hwW_aS-xaPW_zHuTpBW4/edit#heading=h.4kbcnjlru68f). It utilizes Drand Timelock technology to achieve fair and private voting. It supports voting for multiple roles such as Token Holders, Storage Providers, Clients and Developers, and casts the votes of different roles to uniform voting power.

## 2. Problem

In the community voting process governed by DAO, since the voting data of other community members can be seen before the vote counting time, the community members will be affected by the existing voting data before voting, and some members will even take advantage of a large number of voting rights in their hands to vote at the end of the voting process to make the voting results are reversed, resulting in unfair voting.

In the centralized voting process, since the vote counting power is in the hands of the centralized organization, it will cause problems such as vote fraud and black box operation of vote counting, resulting in the voting results being manipulated by others, which cannot truly reflect the wishes of the community.

## 3. Solution

Power Voting dApp stores voting information on the blockchain, and all voting operations are executed on the chain, which is open and transparent. 

When community members vote, they use the timelock technology to lock the voting content, and voting content cannot be viewed until the voting expiration time reaches, so that no one can know the voting information of other members before voting expiration time reaches. 

After the counting time arrives, any voting participant can initiate a vote count without being affected by any centralized organization.

## 4. Timelock

When creating a proposal, the creator will enter a voting expiration time, and Power Voting dApp will store the proposal content and voting expiration time together on the blockchain. When user votes on a proposal, Power Voting dApp will call Drand Timelock API to encrypt user's voting data and store the encrypt data into contract, the encrypt data won't be decrypt until the proposal expiration time. When proposal expiration time reached, Power Voting dApp will call Drand Timelock API to decrypt user's voting data to count the proposal. Power Voting dApp will lock all users' voting content and not allow anyone to query voting content until voting expiration time, to make sure no one can know the voting information of other members before voting expiration time reaches.

## 5. Voting Power Snapshot

Power Oracle will request raw data from FileCoin, GitHub and other data sources to calculate role identity and voting power and save them into Power Oracle contracts. SP and Client respectively invoke the `PowerAPI.minerRawPower(filActorld)` and `DataCapAPI.balance(filActorld)` interfaces to retrieve power. Power Oracle contracts will store 60 days history of voting power. When users vote, only the percentage is recorded, not the actual voting power. During the vote counting process, a random weight will be selected from the 60 days history and multiplied by the percentage to calculate the vote.

## 6. Power Voting Flowchart

![](img/flowchart.png)

## 7. Power Voting Sequence Chart

![](img/timing_diagram.png)

## 8. UCAN Design

![](img/ucan1.png)
![](img/ucan2.png)

