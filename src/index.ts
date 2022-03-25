import { CommunicationProtocolEnum, DaprServer, HttpMethod } from "dapr-client";
import { DaprInvokerCallbackContent } from "dapr-client/types/DaprInvokerCallback.type";


const daprHost = "127.0.0.1";
const daprPort = "50050"; // Dapr Sidecar Port of this Example Server
const serverHost = "127.0.0.1"; // App Host of this Example Server
const serverPort = "50051"; // App Port of this Example Server
const daprServer = new DaprServer(serverHost, serverPort, daprHost, daprPort, CommunicationProtocolEnum.GRPC)

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
