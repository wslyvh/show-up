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
          11155111: '0x15F14dC83AD5824458343c63e3BCa145e2fE8758'
        },
        BasicEther: {
          31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          11155111: '0xBe0566F7C61cBf6e51424cd64c29C2BE7306622d'
        },
        BasicToken: {
          31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          11155111: '0xbB2B38Cc273a875C7CC9d35c5b8A34dCedED036a'
        },
        Token: {
          31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          11155111: '0xB0a1AB0541Cfb5FAB9603D35c99049c07d7cAB9a'
        }
      },
    }),
  ],
})
