const app = require('./app');
const { Eureka } = require('eureka-js-client');

// Port comes from the PORT environment variable -> allows several instances
const PORT = parseInt(process.env.PORT, 10) || 8083;
const HOST = 'localhost';

const client = new Eureka({
  instance: {
    app: 'MEETING',                        // name shown in the dashboard
    instanceId: `${HOST}:meeting:${PORT}`, // must be UNIQUE for each instance
    hostName: HOST,
    ipAddr: '127.0.0.1',
    port: { '$': PORT, '@enabled': true },
    vipAddress: 'meeting',
    statusPageUrl: `http://${HOST}:${PORT}/api/meetings/hello`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',          // path used by a Spring Eureka server
  },
});

const server = app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

  // Register in Eureka once the HTTP server is up
  client.start((error) => {
    console.log(error ? `Eureka registration failed: ${error}` : 'Registered in Eureka as MEETING');
  });
});

// On Ctrl+C: unregister from Eureka, then stop the server
process.on('SIGINT', () => {
  client.stop(() => server.close(() => process.exit(0)));
});