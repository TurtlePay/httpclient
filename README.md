# TurtlePay® HTTPClient Helper Library

![Prerequisite](https://img.shields.io/badge/node-%3E%3D12-blue.svg) [![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/TurtlePay/httpclient#readme) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/TurtlePay/httpclient/graphs/commit-activity) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/TurtlePay/httpclient/blob/master/LICENSE) [![Twitter: TurtlePay](https://img.shields.io/twitter/follow/TurtlePay.svg?style=social)](https://twitter.com/TurtlePay)

[![NPM](https://nodeico.herokuapp.com/@turtlepay/httpclient.svg)](https://npmjs.com/package/@turtlepay/httpclient)

#### Master Build Status
[![Build Status](https://github.com/turtlepay/httpclient/workflows/CI%20Build%20Tests/badge.svg?branch=master)](https://github.com/turtlepay/httpclient/actions)

#### Development Build Status
[![Build Status](https://github.com/turtlepay/httpclient/workflows/CI%20Build%20Tests/badge.svg?branch=development)](https://github.com/turtlepay/httpclient/actions)

## Overview

Provides an easy to use HTTP/s Client interface that is meant to be extended from

## Prerequisites

- node >= 12

## Documentation

Full library documentation is available at [https://httpclient.turtlepay.dev](https://httpclient.turtlepay.dev)

## Install

### Using Yarn

```sh
yarn add @turtlepay/httpclient
```

### Using NPM

```sh
npm install @turtlepay/httpclient
```

## Usage

```typescript
import { HTTPClient } from '@turtlepay/httpclient';

class APIInterface extends HTTPClient {
    public async info (): Promise<{major_version: number}> {
        return this.get<{major_version: number}>('info');
    }
}

(async() => {
    const client = new APIInterface('blockapi.turtlepay.io', 443, true);
    
    console.log(await client.info());
})
```

## Run tests

```sh
yarn test
```

## Author

👤 **TurtlePay® Development Team**

* Twitter: [@TurtlePay](https://twitter.com/TurtlePay)
* Github: [@TurtlePay](https://github.com/TurtlePay)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/TurtlePay/httpclient/issues).

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2020 [TurtlePay® Development Team](https://github.com/TurtlePay).

This project is [MIT](https://github.com/TurtlePay/httpclient/blob/master/LICENSE) licensed.
