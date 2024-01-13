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
          10: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
          8453: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
          84532: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
          11155111: '0x27d81f79D12327370cdB18DdEa03080621AEAadC',
        },
      },
    }),
  ],
})
