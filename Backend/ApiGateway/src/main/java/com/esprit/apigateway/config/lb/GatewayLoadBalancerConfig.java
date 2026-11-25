package com.esprit.apigateway.config.lb;


import com.esprit.apigateway.config.lb.CandidatRandomConfig;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.context.annotation.Configuration;

@Configuration
@LoadBalancerClient(value = "candidat", configuration = CandidatRandomConfig.class)
public class GatewayLoadBalancerConfig {
}