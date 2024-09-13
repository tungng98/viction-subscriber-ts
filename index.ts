import { BigNumber, ethers } from 'ethers';

(async function main() {
	var wsProvider = new ethers.providers.WebSocketProvider('ws://localhost:8546');
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

	const httpProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
	const block = await httpProvider.getBlock(head['number']);
	console.log(`Got Block: ${head['number']} (${blockNumber.toBigInt()}): ${block.hash}`);
}
