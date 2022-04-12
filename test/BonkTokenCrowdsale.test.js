

const { BN, ether } = require('@openzeppelin/test-helpers')
const { expect, assert } = require('chai');

const BonkToken = artifacts.require("BonkToken")
const BonkTokenCrowdsale = artifacts.require("BonkTokenCrowdsale")

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('BonkTokenCrowdsale', function ([_, wallet, investor_1, investor_2]) {
    
    beforeEach(async function () {

        this.name = 'BonkToken';
        this.symbol = 'BNK';
        this.decimals = new BN(18);

        this.token = await BonkToken.new(
            this.name,
            this.symbol,
            this.decimals
        );


        this.rate = new BN(1000);
        this.wallet = wallet;

        this.crowdsale = await BonkTokenCrowdsale.new(
            this.rate,
            this.wallet,
            this.token.address
        );
        
        await this.token.addMinter(this.crowdsale.address);
        await this.token.transferOwnership(this.crowdsale.address);
    });

    describe('crowdsale', function () {
        
        it('tracks the rate', async function () {
            expect(await this.crowdsale.rate()).
            to.be.bignumber.equal(this.rate);
        });
        
        it('track the rate', async function () {
            expect(await this.crowdsale.wallet()).
            to.equal(this.wallet);
        });
        
        it('tracks the token', async function () {
            expect(await this.crowdsale.token()).
                to.equal(this.token.address);
        });
    });

    describe('minted crowdsale', function () {
        it('mints token after purchase', async function () {
            const originalTotalSupply = await this.token.totalSupply();
            await this.crowdsale.sendTransaction({ value: ether("1"), from: investor_1 });
            const newTotalSupply = await this.token.totalSupply();

            expect(newTotalSupply > originalTotalSupply).to.be.true;
        });
    });

    describe('accepting payments', function () {
        it('should accept payments', async function () {
            await this.crowdsale.sendTransaction({ value: ether("1"), from: investor_1 }).should.be.fulfilled; 
            await this.crowdsale.buyTokens(investor_1, { value: ether("1"), from: investor_2 }).should.be.fulfilled;
        });
    });
});