import { CommunicationProtocolEnum, DaprServer, HttpMethod } from "dapr-client";
import { DaprInvokerCallbackContent } from "dapr-client/types/DaprInvokerCallback.type";
import express from "express"
import http from "http"

const daprHost = "127.0.0.1";
const daprPort = "50050"; // Dapr Sidecar Port of this Example Server
const serverHost = "127.0.0.1"; // App Host of this Example Server
const serverPort = "50051"; // App Port of this Example Server
const daprServer = new DaprServer(serverHost, serverPort, daprHost, daprPort, CommunicationProtocolEnum.HTTP)

async function daprSetup() {
    await daprServer.start()
    daprServer.invoker.listen("status", async (data: DaprInvokerCallbackContent) => {
        console.log(JSON.stringify(data, null, 2))
        return { status: "healthy and online" }
    }, { method: HttpMethod.GET })
        .catch(error => console.log(error))
}

daprSetup().catch(e => {
    console.error(e);
    process.exit(1);
})

const app = express()
const server = new http.Server(app)

app.get("/:isalive", async (req, res) => {
    res.status(200).json({ message: "it's alive" })
})

server.listen(4002)

// az containerapp create \
//   --name app-node-back \
//   --resource-group $RESOURCE_GROUP \
//   --environment $CONTAINERAPPS_ENVIRONMENT \
//   --image emplregistry.azurecr.io/node-back \
//   --target-port 4002 \
//   --ingress 'external' \
//   --min-replicas 1 \
//   --max-replicas 1 \
//   --enable-dapr \
//   --dapr-app-port 50050 \
//   --dapr-server-port 50051 \
//   --dapr-app-id node-back \
//   --secrets "storage-account-name=${STORAGE_ACCOUNT},storage-account-key=${STORAGE_ACCOUNT_KEY}" \
//   --registry-login-server $REGISTRY_LOGIN_SERVER \
//   --registry-username $REGISTRY_USERNAME \
//   --registry-password $REGISTRY_PASSWORD
