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
          10: '0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2',
          11155111: '0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2'
        },
        BasicEther: {
          10: '0x33FF944E8504B674835A5BEd88f10f11bEC92c2c',
          11155111: '0x33FF944E8504B674835A5BEd88f10f11bEC92c2c'
        },
        BasicToken: {
          10: '0x33132fE88fe8316881474b551CA2DDD277A320a0',
          11155111: '0x33132fE88fe8316881474b551CA2DDD277A320a0'
        },
      },
    }),
  ],
})
