package com.jb4dc.gateway.webserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = "com.jb4dc",excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
        com.jb4dc.feb.dist.webserver.rest.frame.FrameRest.class,
        com.jb4dc.feb.dist.webserver.rest.JBuild4DCYamlRest.class,
        com.jb4dc.feb.dist.webserver.rest.session.LogoutRest.class,
        //com.jb4dc.feb.dist.webserver.rest.session.UserRest.class,
        com.jb4dc.feb.dist.webserver.controlleradvice.ExceptionControllerAdvice.class,
        com.jb4dc.base.tools.BeanUtility.class
}))
public class ApplicationJb4dcGateWayWebServer {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationJb4dcGateWayWebServer.class, args);
    }
}
