"""Notification microservice - entry point.

Run:  python -m app.main            (port 8084, or the PORT variable)
"""
import os
from contextlib import asynccontextmanager

import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI

from app.routers import notification

# Same variable is used for Eureka AND uvicorn -> several instances possible
PORT = int(os.getenv("PORT", "8084"))
EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://localhost:8761/eureka")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- startup: register in Eureka ----
    await eureka_client.init_async(
        eureka_server=EUREKA_SERVER,
        app_name="notification",      # shown as NOTIFICATION in the dashboard
        instance_port=PORT,
        instance_host="127.0.0.1",
        instance_ip="127.0.0.1",
    )
    yield
    # ---- shutdown: unregister from Eureka ----
    await eureka_client.stop_async()


app = FastAPI(
    title="Notification Microservice API",
    version="1.0.0",
    description=(
        "Notification microservice (Python / FastAPI, no database). "
        "Only the hello endpoint is implemented; the notification logic is to be developed by students."
    ),
    contact={"name": "Badia Abouhdid"},
    servers=[{"url": f"http://localhost:{PORT}", "description": "Local"}],
    # Same URLs as the other microservices of the project
    docs_url="/swagger-ui",       # Swagger UI
    openapi_url="/v3/api-docs",   # OpenAPI JSON
    redoc_url="/redoc",           # alternative documentation
    lifespan=lifespan,            # <-- NEW: Eureka register / unregister
)

app.include_router(notification.router)

# TODO (students): if you add other routers, include them here.


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)