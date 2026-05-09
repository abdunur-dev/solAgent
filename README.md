# 🤖 SolAgent

**SolAgent** is an AI-driven, cyberpunk-themed Solana wallet interface that allows users to seamlessly interact with the Solana Devnet using natural language commands. 

Instead of navigating complex menus, you simply chat with the agent to perform on-chain operations. SolAgent parses your intent, builds the necessary transactions, and securely requests your wallet's signature before executing anything on-chain.

## ✨ Features

- **🗣️ Natural Language Interface**: Chat with the agent to perform on-chain actions.
- **💰 Devnet Faucet**: Request free Devnet SOL directly from the agent (`"Airdrop 2 SOL"`).
- **💰 Receive Tokens**: Easily display your public address to receive assets (`"Show my address"`).
- **💸 Send Tokens**: Transfer SOL to any valid address (`"Send 0.5 SOL to [address]"`).
- **🔄 Swap Tokens**: Execute mock token swaps via on-chain Memo (`"Swap 1 SOL to USDC"`).
- **🥩 Staking**: Stake SOL with validators (`"Stake 2 SOL"`).
- **🔮 Prediction Markets**: Place mock bets and predictions on-chain (`"Predict 1 SOL on BTC > 100k"`).
- **📊 Portfolio Overview**: Check your SOL and SPL token balances.
- **📜 Transaction History**: View your recent on-chain activity.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism UI
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Blockchain**: [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) & Solana Wallet Adapter
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed, and a Solana wallet (like [Phantom](https://phantom.app/) or [Solflare](https://solflare.com/)) installed in your browser. Ensure your wallet network is set to **Devnet**.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdunur-dev/solAgent.git
   cd "Project Title"
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 💡 How It Works

1. **Connect Wallet**: Click the "Connect Wallet" button on the landing page to authenticate your Solana wallet.
2. **Chat with SolAgent**: Once inside the dashboard, type a command in the chat interface.
3. **Confirm Actions**: The agent will parse your command, build the Solana transaction, and present a Confirmation Card.
4. **Sign & Execute**: Click "Confirm" to open your wallet extension, sign the transaction, and wait for on-chain confirmation!

## 📜 Example Commands

- `"What is my balance?"`
- `"Show my address"`
- `"Airdrop 2 SOL"`
- `"Send 1.5 SOL to HJE15qdoqv3hDpc57LCoovsXNANqHAUieQUb6m5PMhVq"`
- `"Swap 5 SOL to USDC"`
- `"Stake 10 SOL"`
- `"Predict 2 SOL that Solana reaches $250"`
- `"Show my transaction history"`
