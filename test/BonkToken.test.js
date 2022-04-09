const BonkToken = artifacts.require('BonkToken');
const { BN } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')

contract('BonkToken', accounts => {

    const _name = 'Bonk Token';
    const _symbol = 'BNK'; 
    const _decimals = new BN(18); 

    describe('token attributes', function () {

        beforeEach(async function () {
            this.token = await BonkToken.new(_name, _symbol, _decimals); 
        })

        it('has the correct name', async function () {
            expect(await this.token.name()).to.equal(_name)
        })
        
        it('has the correct symbol', async function () {
            expect(await this.token.symbol()).to.equal(_symbol)
        })
        
        it('has the correct decimals', async function () {
            expect(await this.token.decimals()).to.be.bignumber.equal(_decimals)
        })
    })

})