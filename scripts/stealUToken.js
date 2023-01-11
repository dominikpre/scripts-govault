"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var hardhat_1 = require("hardhat");
var constants_1 = require("./constants");
var axios_1 = require("axios");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var SIMULATE_API, DAI_ADDRESS, _signers, signers, contracts, _a, token, _b, _c, _i, _d, tx, _e, bBefore, uAmt, TX_DATA, transaction, opts, resp;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    SIMULATE_API = "https://api.tenderly.co/api/v1/account/Ease/project/tokenomics/simulate";
                    DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
                    return [4 /*yield*/, hardhat_1.ethers.getSigners()];
                case 1:
                    _signers = _f.sent();
                    signers = {};
                    signers.whale = _signers[0];
                    signers.bot = _signers[1];
                    signers.otherAccounts = _signers.slice(7);
                    contracts = {};
                    _a = signers;
                    return [4 /*yield*/, hardhat_1.ethers.getSigner(constants_1.MAINNET_ADDRESSES.accounts.rewardsBot)];
                case 2:
                    _a.bot = _f.sent();
                    _b = [];
                    for (_c in constants_1.MAINNET_ADDRESSES.contracts)
                        _b.push(_c);
                    _i = 0;
                    _f.label = 3;
                case 3:
                    if (!(_i < _b.length)) return [3 /*break*/, 13];
                    token = _b[_i];
                    console.log(constants_1.MAINNET_ADDRESSES.contracts[token]);
                    // impersonate whale
                    return [4 /*yield*/, hardhat_1["default"].network.provider.send("hardhat_impersonateAccount", [constants_1.MAINNET_ADDRESSES.contracts[token].whale])];
                case 4:
                    // impersonate whale
                    _f.sent();
                    _d = signers;
                    return [4 /*yield*/, hardhat_1.ethers.getSigner(constants_1.MAINNET_ADDRESSES.contracts[token].whale)];
                case 5:
                    _d.whale = _f.sent();
                    return [4 /*yield*/, signers.otherAccounts[0].sendTransaction({ to: signers.whale.address, value: hardhat_1.ethers.utils.parseEther("0.5") })];
                case 6:
                    tx = _f.sent();
                    // console.log("ETH to whale tx:", tx)
                    _e = contracts;
                    return [4 /*yield*/, hardhat_1.ethers.getContractAt("MockERC20", constants_1.MAINNET_ADDRESSES.contracts[token].address)];
                case 7:
                    // console.log("ETH to whale tx:", tx)
                    _e.uToken = (_f.sent());
                    return [4 /*yield*/, contracts.uToken.balanceOf(signers.bot.address)
                        // send all uToken from whale to bot
                    ];
                case 8:
                    bBefore = _f.sent();
                    return [4 /*yield*/, contracts.uToken.balanceOf(signers.whale.address)];
                case 9:
                    uAmt = _f.sent();
                    if (token == "aCRV") {
                        uAmt = uAmt.div(10);
                    }
                    else if (token == "cvxcrvRenWBTC" ||
                        token == "cvxMIM_3LP3CRV_f") {
                        //TODO: call transferFrom(to, from, amt)
                        console.log("xxxxxxSKIPxxxxxxx", token);
                        return [3 /*break*/, 12];
                    }
                    if (uAmt.toString() == "0") {
                        console.log("whale has 0 uTokens");
                        process.exit(1);
                    }
                    return [4 /*yield*/, contracts.uToken.populateTransaction["transfer"](signers.bot.address, uAmt)];
                case 10:
                    TX_DATA = _f.sent();
                    transaction = {
                        network_id: '1',
                        from: signers.whale,
                        input: TX_DATA,
                        to: DAI_ADDRESS,
                        block_number: null,
                        // tenderly specific
                        save: true
                    };
                    opts = {
                        headers: {
                            'X-Access-Key': process.env.TENDERLY_ACCESS_KEY || ""
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].post(SIMULATE_API, transaction, opts)];
                case 11:
                    resp = _f.sent();
                    console.log(resp.data);
                    _f.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 3];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()["catch"](function (error) {
    console.error(error);
    process.exitCode = 1;
});
