
"""Notification microservice - entry point."""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
import py_eureka_client.eureka_client as eureka_client

from app.routers import notification

PORT = int(os.getenv("PORT", "8084"))


@asynccontextmanager
async def lifespan(app: FastAPI):

    # Enregistrement auprès de Eureka au démarrage
    await eureka_client.init_async(
        eureka_server="http://eureka:eureka123@localhost:8761/eureka/",
        app_name="NOTIFICATION",
        instance_port=PORT,
    )

    print("NOTIFICATION registered with Eureka")

    yield

    # Arrêt du client Eureka
    await eureka_client.stop_async()
    print("NOTIFICATION disconnected from Eureka")


app = FastAPI(
    title="Notification Microservice API",
    version="1.0.0",
    lifespan=lifespan,
    description=(
        "Notification microservice (Python / FastAPI, no database). "
        "Only the hello endpoint is implemented; the notification logic is to be developed by students."
    ),
    contact={"name": "Badia Abouhdid"},
    servers=[{"url": f"http://localhost:{PORT}", "description": "Local"}],
    docs_url="/swagger-ui",
    openapi_url="/v3/api-docs",
    redoc_url="/redoc",
)

app.include_router(notification.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
