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
          11155111: '0x6abEaB74bc741ce8daf2e4614DB7485C19c8acc4',
          84532: '0x70cD0FB06F21aA528b311189A998d03C47CbC056',
        },
        RecipientEther: {
          11155111: '0x73eB044D5Da49384c65b744a0E6CFF3f6B735C03',
          84532: '0x0164c5C19e890D5D63c85B6D9585Aa38E1a2B015',
        },
        RecipientToken: {
          11155111: '0x584269c84C40a142E6b9C5c9c7D31B9a24E9F6D0',
          84532: '0x495A11d9Dd1D348C0AeD41c1B289A34d52637E91',
        },
        SplitEther: {
          11155111: '0x08b2Bb2BA7b3437aD2EC5CC2F5AbB5223c342260',
          84532: '0xF8481548A8C38B8c1B178Be802E6399397361617',
        },
        SplitToken: {
          11155111: '0xb1c9D6FFc183EeCf11722f28B3c42b45164e8Df1',
          84532: '0x66d1306A2DFc1f2446174BDE3d2eE203476da4eB',
        },
      },
    }),
  ],
})
