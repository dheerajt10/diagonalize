import json
from web3 import Web3
from eth_account import Account

# --- 1. Configuration ---
# Your Sepolia testnet RPC URL
RPC_URL = "https://sepolia.drpc.org"

MNEMONIC = "oxygen crazy oppose seek park lazy goat burst joy leisure jump normal"

# The address of your deployed ProfileStorage contract
CONTRACT_ADDRESS = "0x7a2BF42f8f910670714067112aDf5474eC61f88c"

CONTRACT_ABI = json.loads(
    """
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "key",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "company",
				"type": "string"
			}
		],
		"name": "ProfileSet",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_company",
				"type": "string"
			}
		],
		"name": "setProfile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "profiles",
		"outputs": [
			{
				"internalType": "string",
				"name": "username",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "company",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
"""
)


def store_profile(key_to_store, username_to_store, company_to_store):
    """
    Connects to the blockchain, creates a transaction to call setProfile,
    signs it, and sends it.
    """
    Account.enable_unaudited_hdwallet_features()

    my_account = Account.from_mnemonic(MNEMONIC)

    w3 = Web3(Web3.HTTPProvider(RPC_URL))

    if not w3.is_connected():
        print("❌ Failed to connect to the Ethereum node!")
        return

    print(f"✅ Connected to RPC: {RPC_URL}")
    print(f"👤 Using wallet address: {my_account.address}")

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=CONTRACT_ABI
    )


    print(f"\n🚀 Preparing to store data for key '{key_to_store}'...")
    print(f"   - Username: {username_to_store}")
    print(f"   - Company: {company_to_store}")

    # --- 4. Build, Sign, and Send the Transaction ---
    try:
        # Get the nonce (number of transactions sent from the address)
        nonce = w3.eth.get_transaction_count(my_account.address)

        # Build the transaction to call the `setProfile` function
        tx = contract.functions.setProfile(
            key_to_store, username_to_store, company_to_store
        ).build_transaction(
            {
                "chainId": 11155111,  # Sepolia chain ID
                "gas": 200000,
                "gasPrice": w3.eth.gas_price,
                "nonce": nonce,
            }
        )

        # Sign the transaction with the private key
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=my_account.key)

        # Send the signed transaction to the network
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        print(f"\n📦 Transaction sent! Waiting for confirmation...")
        print(f"   Transaction Hash: {tx_hash.hex()}")

        # Wait for the transaction to be mined
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        print("\n🎉 Transaction confirmed!")
        print(f"   Block Number: {tx_receipt["blockNumber"]}")
        print(f"   Gas Used: {tx_receipt["gasUsed"]}")
        print(f"   View on Etherscan: https://sepolia.etherscan.io/tx/{tx_hash.hex()}")

    except Exception as e:
        print(f"\n🚨 An error occurred: {e}")

def read_profile(key_to_read):
	"""
	Reads the profile (username, company) for a given key from the contract's map.
	"""
	w3 = Web3(Web3.HTTPProvider(RPC_URL))
	if not w3.is_connected():
		print("❌ Failed to connect to the Ethereum node!")
		return None

	contract = w3.eth.contract(
		address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=CONTRACT_ABI
	)

	try:
		profile = contract.functions.profiles(key_to_read).call()
		username, company = profile[0], profile[1]
		print(f"Profile for key '{key_to_read}':")
		print(f"  Username: {username}")
		print(f"  Company: {company}")
		return {"username": username, "company": company}
	except Exception as e:
		print(f"\n🚨 An error occurred while reading profile: {e}")
		return None


if __name__ == "__main__":
	store_profile(
		key_to_store="user001",
		username_to_store="alex",
		company_to_store="metacorp"
	)
