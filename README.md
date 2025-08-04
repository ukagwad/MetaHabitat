# MetaHabitat

A blockchain-based virtual real estate development platform that empowers communities to simulate, plan, govern, and invest in sustainable urban environments — all on-chain.

---

## Overview

MetaHabitat consists of ten main smart contracts that together form a decentralized, transparent, and participatory ecosystem for virtual urban development:

1. **Land Registry Contract** – Issues and manages virtual land NFTs mapped to geospatial plots.  
2. **Land Auction Contract** – Facilitates the initial and secondary sale of land via dynamic auctions.  
3. **Zoning DAO Contract** – Enables the community to vote on land use zoning proposals.  
4. **Development Proposal Contract** – Allows landowners to submit infrastructure plans for public approval.  
5. **Sustainability Oracle Contract** – Integrates environmental scoring for proposed developments.  
6. **Builder Registry Contract** – Verifies builders and manages escrow-based construction milestones.  
7. **Habitat Token Contract** – A utility token used for governance, staking, and rewards.  
8. **Rewards Vault Contract** – Distributes staking and participation incentives.  
9. **Identity Registry Contract** – Provides sybil-resistant identity verification for citizens and builders.  
10. **Dispute Resolution Contract** – Handles arbitration over zoning, construction, and governance issues.

---

## Features

- **NFT-based land ownership** tied to a virtual grid or geo-coordinates  
- **Dynamic auctions** for fair land distribution  
- **Community zoning governance** with DAO voting  
- **Development proposal workflows** with sustainability reviews  
- **Environmental oracle scoring** integrated into decision-making  
- **Verified builder ecosystem** with milestone-based escrow payments  
- **Token economy** for participation, staking, and incentives  
- **Reward systems** for eco-conscious and active citizens  
- **Unique identity enforcement** to ensure governance fairness  
- **On-chain dispute resolution** for conflicts over land or projects  

---

## Smart Contracts

### Land Registry Contract
- Mint, transfer, and manage unique virtual land plots  
- Link metadata including zoning, coordinates, and ownership history  

### Land Auction Contract
- Sell new land plots using Dutch or English auction formats  
- Set reserve prices and track bidding transparently  

### Zoning DAO Contract
- Community voting on land use changes (residential, commercial, public)  
- Weighted voting based on staked tokens or land ownership  

### Development Proposal Contract
- Submit infrastructure plans with cost, timeline, and sustainability data  
- Community vote to approve or reject based on zone rules and scores  

### Sustainability Oracle Contract
- Fetch off-chain data for carbon, energy, or water impact  
- Assign sustainability scores to proposals for eco-incentives  

### Builder Registry Contract
- Verify real or virtual builders with identity/KYC  
- Hold project funds in escrow and release upon verified milestones  

### Habitat Token Contract
- Mint and manage platform utility tokens  
- Use for staking, rewards, and DAO voting rights  

### Rewards Vault Contract
- Distribute tokens to participants based on voting, proposals, or sustainability  
- Dynamic reward curves to encourage ongoing engagement  

### Identity Registry Contract
- Ensure sybil-resistant participation using third-party identity services  
- Required for voting, proposal creation, and builder approval  

### Dispute Resolution Contract
- Submit and vote on disputes (e.g. faulty builds, invalid votes)  
- Enforce penalties or reversals on-chain via DAO consensus  

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/metahabitat.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

---

## Usage

Each smart contract is designed to work independently but achieves full potential through integration. Example usage flows:

- Citizens acquire land via Land Auction Contract, then use Zoning DAO to update land usage.
- Developers submit a building plan through Development Proposal Contract, scored by the Sustainability Oracle, and executed by verified builders from the Builder Registry.
- Voters and eco-conscious developers receive token incentives from the Rewards Vault.

> See the /contracts directory for function definitions, parameters, and deployment notes.

---

## License

MIT License