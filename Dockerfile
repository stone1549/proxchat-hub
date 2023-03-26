FROM node:current

ENV NODE_ENV=development
ENV PORT=9001
ENV KAFKA_BROKERS=yapyapyap-yapyapyap-kafka-1:9092,yapyapyap-yapyapyap-kafka-2:9092,yapyapyap-yapyapyap-kafka-3:9092
ENV TOKEN_SECRET=SECRET!

WORKDIR /proxchat-hub/
COPY . .

RUN yarn install

CMD ["yarn", "start"]

