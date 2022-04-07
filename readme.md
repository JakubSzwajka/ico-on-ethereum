

ICO on ethereum network. Based on some yt tutorial

## dependencies

```
    truffle version
```

Truffle v5.5.7 (core: 5.5.7)
Ganache v^7.0.3
Solidity - 0.8.13 (solc-js)
Node v17.8.0
Web3.js v1.5.3


## Some commands/dependencies

**Ganache CLI**

Run development blockchain

```
ganache-cli
```

**Truffle**

To init basic project

```
    truffle init
```

To compile 

```
    truffle compile
```

To migrate 

``` 
    truffle migrate
```

truffle console

```
    truffle console 
```

Then in console
``` 
    # deployed token to network
    BonkToken.deployed( ).then((t) => {token = t})

    token.address
    
    token.name

    token.symbol
```

**openzeppelin-solidity**


```
    npm install openzeppelin-solidity --save-dev
```


## notes 

* had a problem migrating contract to ganache cli when running it with: ``ganache-cli``. After specifing port and host, connection works