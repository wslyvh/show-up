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
        },
        BasicEther: {
          31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        },
        BasicToken: {
          31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        },
        Token: {
          31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
        }
      },
    }),
  ],
})
