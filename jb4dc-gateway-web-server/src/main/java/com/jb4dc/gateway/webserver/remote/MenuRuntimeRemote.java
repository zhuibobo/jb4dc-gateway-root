package com.jb4dc.gateway.webserver.remote;

import com.jb4dc.base.service.general.JB4DCSessionCenter;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gateway.webserver.rest.frame.FrameRest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class MenuRuntimeRemote {
    Logger logger= LoggerFactory.getLogger(MenuRuntimeRemote.class);

    @Autowired
    private WebClient webClient;

    public Mono<JBuild4DCResponseVo> getMyAuthMenusBySystemIdRT(String userId, String systemId, ServerHttpRequest serverHttpRequest){
        String cookieSessionId=serverHttpRequest.getCookies().get(JB4DCSessionCenter.WebClientCookieSessionKeyName).get(0).getValue();
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("userId", userId);
        map.add("systemId", systemId);
        /*Mono<JBuild4DCResponseVo> mono = webClient
                .get() // GET 请求
                .uri("http://JB4DC-SSO-WEB-SERVER/SSOSystem/Rest/SSO/Mu/Menu/GetMyAuthMenusBySystemIdRT")  // 请求路径
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(map))
                .cookie(JB4DCSessionCenter.WebClientCookieSessionKeyName,cookieSessionId)
                .retrieve()
                .bodyToMono(JBuild4DCResponseVo.class);*/
        Mono<JBuild4DCResponseVo> mono = webClient
                .get() // GET 请求
                .uri("http://JB4DC-SSO-WEB-SERVER/SSOSystem/Rest/SSO/Mu/Menu/GetMyAuthMenusBySystemIdRT?userId="+userId+"&systemId="+systemId)  // 请求路径
                .cookie(JB4DCSessionCenter.WebClientCookieSessionKeyName,cookieSessionId)
                .retrieve()
                .bodyToMono(JBuild4DCResponseVo.class);
        return mono;
    }
}
