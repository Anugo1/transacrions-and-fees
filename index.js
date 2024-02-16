// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Generate a new keypair
    const from = Keypair.generate();

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

     // Get balance of 'from' and 'to' wallets before airdrop
     const fromBeforeBalance = await connection.getBalance(from.publicKey);
     const toBeforeBalance = await connection.getBalance(to.publicKey);

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("Airdrop completed for the Sender account");

     // Get balance of 'from' and 'to' wallets after airdrop
     const fromAfterAirdropBalance = await connection.getBalance(from.publicKey);
     const toAfterAirdropBalance = await connection.getBalance(to.publicKey);

     

        
   

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: LAMPORTS_PER_SOL / 100
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is', signature);

        // Get balance of 'from' and 'to' wallets after sending SOL
    const fromAfterSendBalance = await connection.getBalance(from.publicKey);
    const toAfterSendBalance = await connection.getBalance(to.publicKey);

     // Display balances
     console.log("Balance of 'from' before airdrop:", fromBeforeBalance / LAMPORTS_PER_SOL);
     console.log("Balance of 'to' before airdrop:", toBeforeBalance / LAMPORTS_PER_SOL);
     console.log("Balance of 'from' after airdrop:", fromAfterAirdropBalance / LAMPORTS_PER_SOL);
     console.log("Balance of 'to' after airdrop:", toAfterAirdropBalance / LAMPORTS_PER_SOL);
     console.log("Balance of 'from' after sending SOL:", fromAfterSendBalance / LAMPORTS_PER_SOL);
     console.log("Balance of 'to' after receiving SOL:", toAfterSendBalance / LAMPORTS_PER_SOL);
}

transferSol();