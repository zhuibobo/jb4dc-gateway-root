package com.jb4dc.gateway.webserver.rest.frame;

import com.jb4dc.base.service.general.JB4DCSessionUtility;
import com.jb4dc.base.service.po.MenuPO;
import com.jb4dc.base.service.provide.IFramePageProvide;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import com.jb4dc.gateway.webserver.remote.AppRuntimeRemote;
import com.jb4dc.gateway.webserver.remote.MenuRuntimeRemote;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/9
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping(value = "/Gateway/Rest/Frame/MyFrame")
public class FrameRest {
    Logger logger= LoggerFactory.getLogger(FrameRest.class);

    @Autowired
    private MenuRuntimeRemote menuRuntimeRemote;

    @Autowired
    private AppRuntimeRemote appRuntimeRemote;

    @RequestMapping(value = "GetMyMenu")
    public Mono<JBuild4DCResponseVo> getMyMenu(ServerHttpRequest serverHttpRequest,String appId) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSessionForGateWay(serverHttpRequest);
        return menuRuntimeRemote.getMyAuthMenusBySystemIdRT(jb4DCSession.getUserId(),appId,serverHttpRequest);
    }

    @RequestMapping(value = "GetApp")
    public Mono<JBuild4DCResponseVo> getAppSSO(ServerHttpRequest serverHttpRequest,String appId) throws JBuild4DCGenerallyException {
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSessionForGateWay(serverHttpRequest);
        return appRuntimeRemote.getAppSSO(appId,serverHttpRequest);
    }

    @RequestMapping(value = "GetMyAuthorityApp")
    public Mono<JBuild4DCResponseVo> getMyAuthorityApp(ServerHttpRequest serverHttpRequest) throws JBuild4DCGenerallyException {
        JB4DCSession jb4DCSession= JB4DCSessionUtility.getSessionForGateWay(serverHttpRequest);
        return appRuntimeRemote.getHasAuthorityAppSSO(jb4DCSession.getUserId(),serverHttpRequest);
        //JB4DCSession jb4DCSession= JB4DCSessionUtility.getSessionForGateWay(serverHttpRequest);
        //if(frameMenu==null){
            //logger.error("请在项目中提供IFrameMenu的实现类,并声明为bean!");
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,)
            //throw JBuild4DCGenerallyException.getInterfaceNotBeanException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"com.jb4dc.base.service.extend.IFramePageProvide");
        //}
        //return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,frameMenu.getMyFrameAuthorityApp(jb4DCSession.getUserId()));
    }

    @RequestMapping(value = "GetMyFrameLogoutUrl")
    public JBuild4DCResponseVo getMyFrameLogoutUrl(ServerHttpRequest serverHttpRequest) throws JBuild4DCGenerallyException {
        /*JB4DCSession jb4DCSession= JB4DCSessionUtility.getSessionForGateWay(serverHttpRequest);
        if(frameMenu==null){
            //logger.error("请在项目中提供IFrameMenu的实现类,并声明为bean!");
            //throw new JBuild4DCGenerallyException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,)
            throw JBuild4DCGenerallyException.getInterfaceNotBeanException(JBuild4DCGenerallyException.EXCEPTION_PLATFORM_CODE,"com.jb4dc.base.service.extend.IFramePageProvide");
        }
        return JBuild4DCResponseVo.success(JBuild4DCResponseVo.GETDATASUCCESSMSG,frameMenu.getMyFrameLogoutUrl(jb4DCSession.getUserId()));*/
        return null;
    }
}
