const { Eureka } = require('eureka-js-client');
const app = require('./app');

const PORT = Number(process.env.PORT) || 8083;

// ---- Client Eureka ----
const eurekaClient = new Eureka({
  instance: {
    app: 'MEETING',
    instanceId: `meeting:${PORT}`,          // unique par instance
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    homePageUrl: `http://localhost:${PORT}/swagger-ui`,
    statusPageUrl: `http://localhost:${PORT}/info`,
    healthCheckUrl: `http://localhost:${PORT}/health`,
    port: { '$': PORT, '@enabled': true },
    vipAddress: 'meeting',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});

app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

  // Enregistrement dans Eureka une fois le serveur démarré
  eurekaClient.start((error) => {
    console.log(error ? `Erreur Eureka : ${error}` : 'Enregistré dans Eureka (MEETING)');
  });
});

// ---- Désenregistrement propre à l'arrêt (Ctrl+C) ----
process.on('SIGINT', () => {
  eurekaClient.stop(() => process.exit());
});