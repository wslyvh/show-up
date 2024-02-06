import { Chain, createPublicClient, http } from "viem";
import { normalize } from "viem/ens";
import { baseSepolia, sepolia, optimism, mainnet, base } from "viem/chains";
import { TruncateMiddle } from "./mapping";
import { addEnsContracts, ensPublicActions } from "@ensdomains/ensjs";
import { getName } from "@ensdomains/ensjs/public";

export function GetClient(chainId: number) {
  let chain: Chain = optimism;
  if (chainId == 10) chain = optimism;
  if (chainId == 8453) chain = base;
  if (chainId == 11155111) chain = sepolia;
  if (chainId == 84532) chain = baseSepolia;

  return createPublicClient({
    chain: chain,
    transport: http(),
  });
}

export async function GetEnsProfile(address: string) {
  const client = createPublicClient({
    chain: addEnsContracts(mainnet),
    transport: http(),
  }).extend(ensPublicActions);

  let name = TruncateMiddle(address);
  try {
    // console.log("Get ENS Name", address);
    const nameResult = await getName(client, {
      address: address as any,
    });

    if (nameResult) {
      name = nameResult.name;
      // console.log("Get records for", name);
      const ensAvatar = await client.getEnsAvatar({
        name: normalize(name),
      });
      const records = await client.getRecords({
        name: nameResult.name,
        coins: ["ETH"],
        texts: [
          "name",
          "description",
          "url",
          "location",
          "avatar",
          "email",
          "com.twitter",
          "com.github",
          "com.discord",
          "com.telegram",
        ],
      });

      // Parse records
      const description =
        records.texts.find((r) => r.key === "description")?.value ?? null;
      const url = records.texts.find((r) => r.key === "url")?.value ?? null;
      const avatar =
        records.texts.find((r) => r.key === "avatar")?.value ?? null;
      const email = records.texts.find((r) => r.key === "email")?.value ?? null;
      const twitter =
        records.texts
          .find((r) => r.key === "com.twitter")
          ?.value?.replace("https://twitter.com/", "") ?? null;
      const github =
        records.texts
          .find((r) => r.key === "com.github")
          ?.value?.replace("https://github.com/", "") ?? null;
      const discord =
        records.texts.find((r) => r.key === "com.discord")?.value ?? null;
      const telegram =
        records.texts
          .find((r) => r.key === "com.telegram")
          ?.value?.replace("https://t.me/", "") ?? null;

      // Parse records
      return {
        id: address,
        name: name,
        avatar: ensAvatar ?? avatar,
        description: description,
        website: url,
        email: email,
        twitter: twitter,
        github: github,
        discord: discord,
        telegram: telegram,
      };
    }
  } catch (e) {
    // ignore
    console.log("Error fetching ENS Records", e);
  }

  return {
    id: address,
    name: name,
    avatar: null,
    description: null,
    website: null,
    email: null,
    twitter: null,
    github: null,
    discord: null,
    telegram: null,
  };
}
