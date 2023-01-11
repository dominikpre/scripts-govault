import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MockERC20 } from "../src/types/MockERC20";

export type Signers = {
  whale: SignerWithAddress;
  bot: SignerWithAddress;
  otherAccounts: SignerWithAddress[];
};

export type Contracts = {
  uToken: MockERC20;
}

export type Token = {
  address: string;
  whale: string;
}

export type MainnetContracts = {
  cDAI: Token;
  cUSDC: Token;
  cUSDT: Token;
  cTUSD: Token;
  aFRAX: Token;
  aDAI: Token;
  aCRV: Token;
  cvxFRAX3CRV_f: Token;
  cvxsteCRV: Token;
  cvxcrvRenWBTC: Token;
  cvxMIM_3LP3CRV_f: Token;
  cvxcrv3crypto: Token;
  cvxcrvCVXETH: Token;
  SLP_USDC_WETH: Token;
  SLP_WETH_USDT: Token;
  SLP_WBTC_WETH: Token;
  SLP_BIT_WETH: Token;
  SLP_DAI_WETH: Token;
  bauraBAL: Token;
  graviAura: Token;
  b20WBTC_80BADGER: Token;

};

export type MainnetWhales = {
  bauraBALWhale: string;
  graviAuraWhale: string;
  b20WBTC_80BADGER_Whale: string;
  SLP_USDC_WETH_Whale: string;
  SLP_WETH_USDT_Whale: string;
  SLP_WBTC_WETH_Whale: string;
  SLP_DAI_WETH_Whale: string;
  SLP_BIT_WETH_Whale: string;
}

export type MainnetAccounts = {
  rewardsBot: string;
};

export type MainnetAddresses = {
  contracts: MainnetContracts;
  accounts: MainnetAccounts;
};
