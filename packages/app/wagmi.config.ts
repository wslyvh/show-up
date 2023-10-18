import { defineConfig } from '@wagmi/cli'
import { actions, hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/abis.ts',
  contracts: [],
  plugins: [
    actions({
      getContract: true,
      readContract: true,
      prepareWriteContract: true,
      watchContractEvent: false,
    }),
    hardhat({
      project: '../protocol',
      deployments: {
        Registry: {
          31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          534351: '0x088c088217611a54991AFbEf3D77020D3Ad7CbA3',
          11155111: '0xfD4712Ed09b1d98354dC0153fd3eF7e374F71443',
        },
        BasicEther: {
          31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          534351: '0xeFB0f24E6f5bE8a969488dbA2f0D6d99eAF342cd',
          11155111: '0xC798B6C3A99a87fE4beFb24d4599b1caA6D6DAff'
        },
        BasicToken: {
          31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          534351: '0x555B9c3B79EF437776F7E0833c234c802D741771',
          11155111: '0x317f09eCeBB6Db0d143cD7EF164F0FA1B6fC38b3'
        },
        Token: {
          31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          534351: '0xA0831CF780DBc6B80f8cBf0da388f38f268A414e',
          11155111: '0x3C67cE8eA670B4f180d581eC4cef79750D2d482f'
        }
      },
    }),
  ],
})
