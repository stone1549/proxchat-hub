# proxchat-hub

proxchat-hub is a websocket server that allows connected clients to send messages to other clients within a 
certain radius of them. The server works in a distributed manner with each instance communicating with the other 
instances through Kafka. It is written in Typescript using NodeJS
---

## Prereqs
You probably want to checkout the monorepo [yapyapyap](https://www.github.com/stone1549/yapyapyap) instead

## Configuration
### Environment Variables

| Variable      | Description                                    | Possible Values         |
|---------------|------------------------------------------------|-------------------------|
 | NODE_ENV      | Controls log levels and configuration defaults | development, production |
 | PORT          | Port to run service on                         | number                  |
 | KAFKA_BROKERS | A comma separated list of kafka brokers        | host:9092,host2:9092    |
 | TOKEN_SECRET  | Secret used to sign JWT tokens                 | string                  |

## Run

    yarn install
    yarn start