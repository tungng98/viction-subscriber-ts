import { BigNumber, ethers } from 'ethers';

const RPC_PROVIDER_URL = 'http://localhost:8545';
const WS_PROVIDER_URL = 'ws://localhost:8546';

(async function main() {
	var wsProvider = new ethers.providers.WebSocketProvider(WS_PROVIDER_URL);
	wsProvider._websocket.on('open', function() {
		console.log('Websocket connected');
	});
	wsProvider._websocket.on('close', function() {
		console.log('Websocket disconnected');
	});
	wsProvider._subscribe('block', ['newHeads'], newHeadsHandler);
})()

async function newHeadsHandler(head: {[Name: string]: string }) {
	const blockNumber = BigNumber.from(head['number']);
	console.log(`New Block: ${head['number']} (${blockNumber.toBigInt()})`);

	const httpProvider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER_URL);
	const block = await httpProvider.getBlock(head['number']);
	console.log(`Got Block: ${head['number']} (${blockNumber.toBigInt()}): ${block.hash}`);

	saveTransactions(block.transactions);
}

async function saveTransactions(txHashes: string[]) {
	// TODO: Save to DB
}

async function processTransactionJob() {
	// TODO: Load from DB
	const txHashes: string[] = [];
	for(const txHash of txHashes) {
		await processTransaction(txHash);
	}
}

async function processTransaction(txHash: string) {
	const httpProvider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER_URL);
	const txTrace = httpProvider.send('debug_traceTransaction', [txHash, {
		"tracer":"callTracer",
		"timeout":"300s"
	}]);
	// TODO: process trace result
}
