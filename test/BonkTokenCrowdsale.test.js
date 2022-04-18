

const { BN, ether, expectRevert, time} = require('@openzeppelin/test-helpers')
const { expect } = require('chai');
const BonkToken = artifacts.require("BonkToken")
const BonkTokenCrowdsale = artifacts.require("BonkTokenCrowdsale")

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('BonkTokenCrowdsale', function ([_, wallet, investor_1, investor_2]) {
    
    beforeEach(async function () {
        // token config
        this.name = 'BonkToken';
        this.symbol = 'BNK';
        this.decimals = new BN(18);

        this.token = await BonkToken.new(
            this.name,
            this.symbol,
            this.decimals
        );

        // Crowdsale config
        this.rate = new BN(1000);
        this.wallet = wallet;
        this.cap = ether("100");

        this.investorMinCap = ether("0.002");
        this.investorHardCap = ether("50");

        this.openingTime = +await time.latest() + +time.duration.days(1); 
        this.closingTime = this.openingTime + +time.duration.weeks(1);

        this.crowdsale = await BonkTokenCrowdsale.new(
            this.rate,
            this.wallet,
            this.token.address,
            this.cap,
            this.openingTime, 
            this.closingTime
        );

        await this.crowdsale.addWhitelisted(investor_1);
        await this.crowdsale.addWhitelisted(investor_2);

        await this.token.addMinter(this.crowdsale.address);
        await this.token.transferOwnership(this.crowdsale.address);

        await time.increase(time.duration.days(2))
    });

    describe('crowdsale', function () {
        
        it('tracks the rate', async function () {
            expect(await this.crowdsale.rate()).
                to.be.bignumber.equal(this.rate);
        });
        
        it('tracks the wallet', async function () {
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

    describe('capped crowdsale', function () {
        it('has the correct hard cap', async function () {
            const cap = await this.crowdsale.cap();
            cap.should.be.bignumber.equal(this.cap);
        });
    });

    describe('accepting payments', function () {
        it('should accept payments', async function () {
            await this.crowdsale.sendTransaction({ value: ether("1"), from: investor_1 }).should.be.fulfilled; 
            await this.crowdsale.buyTokens(investor_1, { value: ether("1"), from: investor_2 }).should.be.fulfilled;
        });
    });


    describe('buyTokens()', function () {
        describe('when the contribution is less then the minimum cap', function () {
            it('rejects the transaction', async function () {
                const value = this.investorMinCap - 1; 
                await expectRevert(this.crowdsale.buyTokens(investor_2, { value: value, from: investor_2 })
                ,'Total contribution too low'); 
            });
        });

        describe('when the investor has already met the minimum cap', function () {
            it('allows the investor to contribute below the minimum cap', async function () {
                // first valid contribution 
                const alreadyMadeContribution = ether("1");
                await this.crowdsale.buyTokens(
                    investor_1,
                    {
                        value: alreadyMadeContribution,
                        from: investor_1
                    }
                );
                
                // second valid contribution of amount below minCap
                const contributionBelowMinCap = 1; 
                await this.crowdsale.buyTokens(
                    investor_1,
                    {
                        value: contributionBelowMinCap,
                        from: investor_1
                    }
                ).should.be.fulfilled; 
            });
        });
            
        describe('when the total contributions exceed the investor hard cap', function () {
            it('rejects the transaction', async function () {
                // first valid contribution 
                const alreadyMadeContribution = ether("2");
                await this.crowdsale.buyTokens(
                    investor_1,
                    {
                        value: alreadyMadeContribution,
                        from: investor_1
                    }
                );
                
                const contributionToExceedHardCap = ether("49");
                await expectRevert(this.crowdsale.buyTokens(
                    investor_1,
                    {
                        value: contributionToExceedHardCap,
                        from: investor_1
                    }
                ), 'Total contribution exceeded'); 
            });
        });

        describe('when the contribution is within the valid range', function () {
            it('succeseds & updates the contribution amoiunt', async function () {
                await this.crowdsale.buyTokens(
                    investor_1,
                    {
                        value: ether("2"),
                        from: investor_1
                    }
                ).should.be.fulfilled;

                const contribution = await this.crowdsale.getUserContribution(investor_1);
                contribution.should.be.bignumber.equal(ether("2"))
            });
        });


        describe('timed crowdsale', function () {
            it('is open', async function () {
                const isClosed = await this.crowdsale.hasClosed(); 
                isClosed.should.be.false; 
            }); 
        });

        describe('whitelisted crowdsale', function () {
            it('rejects contributions fron non-whitelisted investors', async function () {   

                const non_whitelist_investor = _; 
                await expectRevert(this.crowdsale.buyTokens(
                    non_whitelist_investor,
                    {
                        value: ether("1"),
                        from: non_whitelist_investor
                    }
                ), "WhitelistCrowdsale: beneficiary doesn't have the Whitelisted role");
            });
        });
    });
});