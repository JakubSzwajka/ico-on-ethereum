

const { BN } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')

const BonkToken = artifacts.require("BonkToken")
const BonkTokenCrowdsale = artifacts.require("BonkTokenCrowdsale")

contract('BonkTokenCrowdsale', function ([_, wallet]) {
    
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
});