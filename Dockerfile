FROM node:16.13.0-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
# RUN dapr run --app-id node-back --app-port 50051 --app-protocol grpc --dapr-grpc-port 50050

CMD [ "node", "dist/index.js" ]