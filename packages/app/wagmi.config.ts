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
          11155111: '0xd599039AcD9bd440D175E089A05752ed21e1b65f',
          84532: '0x2015332B900685104889Ef6c0BE07146F342D888',
        },
        RecipientEther: {
          11155111: '0x689E2B03e094a35EA226c8AEe4920489DAc1c1F8',
          84532: '0x078C641cDcb39C66b9C5AD39a15931961380E081',
        },
        RecipientToken: {
          11155111: '0x78dd14a571d4e98b1ED48F8Bc3DDcBfBBb77f8Bc',
          84532: '0x624702d53F3A5a3B0778460B09e5079f8D47Ac3c',
        },
        SplitEther: {
          11155111: '0x6d6F49504C421e84568F4E986A64bA777fcc8867',
          84532: '0x04EfaAafE4c2193b03229362A824D27ce5bEcC22',
        },
        SplitToken: {
          11155111: '0xb2BC931abdE8eE679e771B0f9b6198A6f2F7E4dA',
          84532: '0x3A6960494F84F68eB30d0f35DeFBFd03109c2185',
        },
      },
    }),
  ],
})
