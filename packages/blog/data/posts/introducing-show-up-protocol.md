---
title: Introducing Show Up Protocol
description: Show Up—an onchain RSVP and Event management protocol that reshapes event participation, by introduceing a novel staking mechanism that aligns the incentives.
date: 2023-12-04T12:05:26.138Z
---

## Sup 😎👋

In a space buzzing with events and gatherings, the excitement can sometimes be overshadowed by a common challenge—no-shows. Event organizers invest time, effort, and resources into creating memorable experiences, only to face the disappointment of empty seats. This not only impacts the organizer but also affects the overall atmosphere and dynamics for other attendees. A typical coordination problem.

Enter [Show Up](https://www.showup.events/)—an onchain RSVP and Event management protocol designed to reshape event participation. It introduces a novel staking mechanism that aligns the incentives between event organizers and attendees.

- Higher event participation for event hosts
- Reward active participation for attendees
- A decentralized, open and permissionless protocol

win/win for everyone 🤝

![Show Up Protocol](/images/sup.png)

### How does it work?

The Show Up Protocol is a set of decentralized, open, and permissionless smart contracts built on the Ethereum protocol. These contracts manage commitments and the conditions for keeping them. It is currently deployed on Optimism (and Sepolia testnet). The event metadata is stored on IPFS, ensuring the platform has no control over your events, funds, or payments.

As an event organizer, you decide the deposit fee, which can be in Ether or any ERC20 token. Once an event is created, it cannot be edited, although you can cancel an event at any time. Anyone can register for your event once published if they pay the deposit fee. The event host keeps track and manages check-ins. At the end of the event, the host settles the event, automatically distributing the funds among all checked attendees.

More information on the protocol can be found on [Github](https://github.com/wslyvh/show-up/tree/main/packages/protocol).

## Use-cases

The Show Up App (mobile PWA) focuses specifically on RSVP and reducing no-shows for events. It is not a full-fledged ticketing solution but works great for:

- Requesting a registration fee for a hackathon to incentivize project submissions.
- Educational bootcamps, courses, or workshops to foster dedicated and motivated participants.
- Creating engaged communities by transforming simple RSVPs into a meaningful commitments.

The protocol is fully open and permissionless, allowing the creation of commitments and events outside the App. The protocol uses a modular set of condition modules designed to be extensible, facilitating various other needs and use-cases, including:

- **Fitness challenges**: Individuals stake on fitness goals, promoting healthier lifestyles.
- **Habit tracking**: Rewarding positive habits and personal growth.
- **Language learning groups**: Encouraging consistency and dedication to regular practice sessions.
- **Skill development**: Users commit to developing new skills or hobbies, from learning a musical instrument to mastering a programming language.

The modularity of Show Up's commitment-driven protocol makes it a valuable tool across diverse contexts, encouraging commitment, participation, and achievement.

## Security

Show Up is completly open-source and available on Github. While Show Up Protocol has been thoughtfully designed, built and reviewed by external developers, it has not been audited yet. Please check the contracts and documentation and use at your own risk. Depending on the deposit fees, the risk per event should be relatively low.

### Optimism

- Registry [0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2](https://optimistic.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
- BasicEther [0x33FF944E8504B674835A5BEd88f10f11bEC92c2c](https://optimistic.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
- BasicToken [0x33132fE88fe8316881474b551CA2DDD277A320a0](https://optimistic.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)

### Sepolia

- Registry [0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2](https://sepolia.etherscan.io/address/0x7Cc8E0633021b9DF8D2F01d9287C3b8e29f4eDe2)
- BasicEther [0x33FF944E8504B674835A5BEd88f10f11bEC92c2c](https://sepolia.etherscan.io/address/0x33FF944E8504B674835A5BEd88f10f11bEC92c2c)
- BasicToken [0x33132fE88fe8316881474b551CA2DDD277A320a0](https://sepolia.etherscan.io/address/0x33132fE88fe8316881474b551CA2DDD277A320a0)

## Links

- Website https://www.showup.events/
- Testnet https://test.showup.events/
- Github https://github.com/wslyvh/show-up

### Acknowledgements

![Friendship Ended with Kickback](/images/friendship-ended-with-kickback.jpg)

Show Up has been built on the ideas and experiences from [@wearekickback](https://twitter.com/wearekickback/) 👏
