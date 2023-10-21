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
          534351: '0xa21BD128d7c507bf2F6b78181A9A99e86a23E593',
          11155111: '0x0959f7dD732631B7600fcCe67312920d4F5ECB9c',
        },
        BasicEther: {
          31337: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          534351: '0xf32E8f56626F87A0bf5e93154CA3a51D45123dc0',
          11155111: '0x0b6b25a06A2EE6c560BB33EbDbECA831f2D67836'
        },
        BasicToken: {
          31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          534351: '0xB944AFeF3821062B4B813D5aCaE833Eca223db09',
          11155111: '0x11FB53694e42972925940836a1E3EC71cA584936'
        },
        Token: {
          31337: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
          534351: '0xA95579514dB88a1F7a561E46bEdBDA1C676E76A4',
          11155111: '0x7ef7024B76791BD1f31Ac482724c76f0e24a2dD0'
        }
      },
    }),
  ],
})
