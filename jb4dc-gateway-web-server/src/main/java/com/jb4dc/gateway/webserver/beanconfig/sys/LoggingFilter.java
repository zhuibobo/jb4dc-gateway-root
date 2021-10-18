package com.jb4dc.gateway.webserver.beanconfig.sys;

import org.reactivestreams.Publisher;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.core.io.buffer.PooledDataBuffer;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpResponseDecorator;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {
    org.slf4j.Logger log= LoggerFactory.getLogger(LoggingFilter.class);

    private static final Set<String> LOGGABLE_CONTENT_TYPES = new HashSet<>(Arrays.asList(
            MediaType.APPLICATION_JSON_VALUE.toLowerCase(),
            MediaType.APPLICATION_JSON_UTF8_VALUE.toLowerCase(),
            MediaType.TEXT_PLAIN_VALUE,
            MediaType.TEXT_XML_VALUE
    ));

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange, GatewayFilterChain chain
    ) {
        // First we get here request in exchange
        ServerHttpRequestDecorator requestMutated = new ServerHttpRequestDecorator(exchange.getRequest()) {
            @Override
            public Flux<DataBuffer> getBody() {
                Logger requestLogger = new Logger(getDelegate());
                if(LOGGABLE_CONTENT_TYPES.contains(String.valueOf(getHeaders().getContentType()).toLowerCase())) {
                    return super.getBody().map(ds -> {
                        requestLogger.appendBody(ds.asByteBuffer());
                        return ds;
                    }).doFinally((s) -> requestLogger.log());
                } else {
                    requestLogger.log();
                    return super.getBody();
                }
            }
        };

        ServerHttpResponseDecorator responseMutated = new ServerHttpResponseDecorator(exchange.getResponse()) {
            @Override
            public Mono<Void> writeWith(Publisher<? extends DataBuffer> body) {
                Logger responseLogger = new Logger(getDelegate());
                if(LOGGABLE_CONTENT_TYPES.contains(String.valueOf(getHeaders().getContentType()).toLowerCase())) {
                    return join(body).flatMap(db -> {
                        responseLogger.appendBody(db.asByteBuffer());
                        responseLogger.log();
                        return getDelegate().writeWith(Mono.just(db));
                    });
                } else {
                    responseLogger.log();
                    return getDelegate().writeWith(body);
                }
            }
        };
        return chain.filter(exchange.mutate().request(requestMutated).response(responseMutated).build());
    }

    private Mono<? extends DataBuffer> join(Publisher<? extends DataBuffer> dataBuffers) {
        Assert.notNull(dataBuffers, "'dataBuffers' must not be null");
        return Flux.from(dataBuffers)
                .collectList()
                .filter((list) -> !list.isEmpty())
                .map((list) -> list.get(0).factory().join(list))
                .doOnDiscard(PooledDataBuffer.class, DataBufferUtils::release);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    class Logger {
        private StringBuilder sb = new StringBuilder();

        Logger(ServerHttpResponse response) {
            sb.append("\n");
            sb.append("---------- Response ----------").append("\n");
            sb.append("Headers      :").append(response.getHeaders().toSingleValueMap()).append("\n");
            sb.append("Status code  :").append(response.getStatusCode()).append("\n");
        }

        Logger(ServerHttpRequest request) {
            sb.append("\n");
            sb.append("---------- Request ----------").append("\n");
            sb.append("Url          :").append(request.getURI().toString()).append("\n");
            sb.append("Headers      :").append(request.getHeaders().toSingleValueMap()).append("\n");
            sb.append("Method       :").append(request.getMethod()).append("\n");
            sb.append("Client       :").append(request.getRemoteAddress()).append("\n");
        }

        void appendBody(ByteBuffer byteBuffer) {
            sb.append("Body         :").append(StandardCharsets.UTF_8.decode(byteBuffer)).append("\n");
        }

        void log() {
            sb.append("---------------------------------------").append("\n");
            log.info(sb.toString());
        }
    }
}