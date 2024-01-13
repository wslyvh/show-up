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
        ShowHub: {
          11155111: '0x896Ae5df06B9f8e14CB0d5d607Fc40b1E57E27a3',
          84532: '0x2B52D9d2c1854dEaB06D16283Bfa710AAb9fE568',
        },
      },
    }),
  ],
})
