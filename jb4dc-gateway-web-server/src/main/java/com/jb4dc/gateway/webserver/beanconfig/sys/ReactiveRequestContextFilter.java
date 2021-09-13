package com.jb4dc.gateway.webserver.beanconfig.sys;

import com.jb4dc.base.service.general.JB4DCSessionCenter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
public class ReactiveRequestContextFilter implements WebFilter {
    //@Autowired
    //RequestDataBean requestDataBean;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest serverHttpRequest = exchange.getRequest();
        //String cookieSessionId=serverHttpRequest.getCookies().get(JB4DCSessionCenter.WebClientCookieSessionKeyName).get(0).getValue();
        //requestDataBean.setCookieId(cookieSessionId);
        return chain.filter(exchange);
    }
}
