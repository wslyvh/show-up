
import {
  ShowHubContract_Canceled_loader,
  ShowHubContract_Canceled_handler,
  ShowHubContract_CheckedIn_loader,
  ShowHubContract_CheckedIn_handler,
  ShowHubContract_ConditionModuleWhitelisted_loader,
  ShowHubContract_ConditionModuleWhitelisted_handler,
  ShowHubContract_Created_loader,
  ShowHubContract_Created_handler,
  ShowHubContract_Funded_loader,
  ShowHubContract_Funded_handler,
  ShowHubContract_OwnershipTransferred_loader,
  ShowHubContract_OwnershipTransferred_handler,
  ShowHubContract_Registered_loader,
  ShowHubContract_Registered_handler,
  ShowHubContract_Settled_loader,
  ShowHubContract_Settled_handler,
  ShowHubContract_Updated_loader,
  ShowHubContract_Updated_handler,
} from "../generated/src/Handlers.gen";

import { ConditionModuleEntity, RecordEntity } from "../generated/src/Types.gen";

ShowHubContract_ConditionModuleWhitelisted_loader(({ event, context }) => {
  context.ConditionModule.load(event.params.conditionModule);
})

ShowHubContract_ConditionModuleWhitelisted_handler(({ event, context }) => {
  let entity = context.ConditionModule.get(event.params.conditionModule)
  if (entity == null) {
    entity = {
      id: event.params.conditionModule,
      createdAt: BigInt(event.params.timestamp),
      createdBy: event.params.sender,
      blockNumber: BigInt(event.blockNumber),
      transactionHash: event.transactionHash,

      name: 'ConditionModule',
      whitelisted: event.params.whitelisted,
    }
  }

  entity = {
    ...entity,
    whitelisted: event.params.whitelisted,
  }
  context.ConditionModule.set(entity)
})
