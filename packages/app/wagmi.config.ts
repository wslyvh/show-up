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
          11155111: '0x31154816A0d880915B5D4c38d476326b69FFf011'
        },
        BasicEther: {
          31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          11155111: '0x2bA34b3D60CB325C224faeA4Bd1BC9815C9a60f9'
        },
        BasicToken: {
          31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          11155111: '0x00E0F139108303444bD4808e05f28ed88B34e1b6'
        },
        Token: {
          31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          11155111: '0x08A0926023D4dD51eAc65031fd4ba5c1B06A052E'
        }
      },
    }),
  ],
})
