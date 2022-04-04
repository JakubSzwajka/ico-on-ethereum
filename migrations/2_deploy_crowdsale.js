const BonkToken = artifacts.require("./BonkToken.sol");

module.exports = function (deployer) {
    const _name = "Bonk Token";
    const _symbol = "BNK";
    deployer.deploy(BonkToken, _name, _symbol);
};
