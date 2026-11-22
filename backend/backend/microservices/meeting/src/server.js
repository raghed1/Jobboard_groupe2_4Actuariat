
const app = require('./app');
const { Eureka } = require('eureka-js-client');

const PORT = process.env.PORT || 8083;

// Configuration du client Eureka
const eurekaClient = new Eureka({
  instance: {
    app: 'MEETING',
    instanceId: `localhost:MEETING:${PORT}`,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',

    port: {
      '$': Number(PORT),
      '@enabled': 'true'
    },

    vipAddress: 'MEETING',
    statusPageUrl: `http://localhost:${PORT}/`,

    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },

  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/'
  },

  // Authentification HTTP Basic
  requestMiddleware: (requestOpts, done) => {
    requestOpts.auth = {
      user: 'eureka',
      password: 'eureka123'
    };
    done(requestOpts);
  }
});

// Démarrage du serveur Express
app.listen(PORT, () => {
  console.log(`Meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

  // Enregistrement auprès de Eureka
  eurekaClient.start();
  console.log('Meeting is registering with Eureka...');
});
