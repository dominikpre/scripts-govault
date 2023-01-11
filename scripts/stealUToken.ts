import hre, { ethers } from "hardhat";

import { MockERC20 } from "../src/types/MockERC20";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contracts, Signers } from "./types";
import { MAINNET_ADDRESSES } from "./constants";
import axios from "axios";

async function main() {

  // dotenv.config();
// const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

const SIMULATE_API = `https://api.tenderly.co/api/v1/account/Ease/project/tokenomics/simulate`

const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";





  const _signers: SignerWithAddress[] = await ethers.getSigners();
  const signers = {} as Signers;
  signers.whale = _signers[0];
  signers.bot = _signers[1];
  signers.otherAccounts = _signers.slice(7);
  const contracts = {} as Contracts;

  signers.bot = await ethers.getSigner(MAINNET_ADDRESSES.accounts.rewardsBot)

  let token: keyof typeof MAINNET_ADDRESSES.contracts;
  for (token in MAINNET_ADDRESSES.contracts) {
    console.log(MAINNET_ADDRESSES.contracts[token])
    
    // impersonate whale
    await hre.network.provider.send("hardhat_impersonateAccount", [MAINNET_ADDRESSES.contracts[token].whale]);
    signers.whale = await ethers.getSigner(MAINNET_ADDRESSES.contracts[token].whale);

    // Transfer eth to whale
    const tx = await signers.otherAccounts[0].sendTransaction({ to: signers.whale.address, value: ethers.utils.parseEther("0.5") });
    // console.log("ETH to whale tx:", tx)

    contracts.uToken = <MockERC20>(
      await ethers.getContractAt("MockERC20", MAINNET_ADDRESSES.contracts[token].address)
    );

    // bots uBalance before
    const bBefore = await contracts.uToken.balanceOf(signers.bot.address) 
    // send all uToken from whale to bot
    let uAmt = await contracts.uToken.balanceOf(signers.whale.address)
    

    if (token == "aCRV") {
      uAmt = uAmt.div(10)
    } else if (
      token == "cvxcrvRenWBTC" ||
      token == "cvxMIM_3LP3CRV_f"
    ) {
      //TODO: call transferFrom(to, from, amt)
      console.log("xxxxxxSKIPxxxxxxx", token)
      continue
    }   
    if (uAmt.toString() == "0") {
      console.log("whale has 0 uTokens")
      process.exit(1)
    }

    // tx data obtained using other means
    const TX_DATA = await contracts.uToken.populateTransaction["transfer"](signers.bot.address, uAmt);

    const transaction = {
        network_id: '1',
        from: signers.whale,
        input: TX_DATA,
        to: DAI_ADDRESS,
        block_number: null,
        // tenderly specific
        save: true
    }

    const opts = {
        headers: {
            'X-Access-Key': process.env.TENDERLY_ACCESS_KEY || "",
        }
    }
    const resp = await axios.post(SIMULATE_API, transaction, opts);
    console.log(resp.data);



    // const tx2 = await contracts.uToken.connect(signers.whale).transfer(signers.bot.address, uAmt);
    // // console.log("uToken to bot tx:", tx2)

    // const bAfter = await contracts.uToken.balanceOf(signers.bot.address)
    // console.log("Balance before and after:")
    // console.log(bBefore.toString())
    // console.log(bAfter.toString())
    // if(bBefore.toString() == bAfter.toString()){
    //   console.log("-------------------------------utoken transfer unsuccesfull!-------------------------------")
    //   // process.exit(1)
    // }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
