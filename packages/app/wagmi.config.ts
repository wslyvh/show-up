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
          11155111: '0x66d1306A2DFc1f2446174BDE3d2eE203476da4eB'
        },
        BasicEther: {
          31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          11155111: '0xc87fF3D3641728E20aa5802b29939bd05dEbc8d7'
        },
        BasicToken: {
          31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          11155111: '0x7481434AecE5fB12bb672170730e09E04E3A4FE6'
        },
        Token: {
          31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          11155111: '0xB2E0D0d0dca958B871f31b492aADaf06b0A096f4'
        }
      },
    }),
  ],
})
