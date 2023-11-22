import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import Bowser from 'bowser';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';

export function tag(service: string, target?: string): void {
    console.debug('Start page tagging...');
    const provider = new WebTracerProvider({
        resource: new Resource({
            'service.name': service,
        }),
    });
    const exporter = (target) ?
        new OTLPTraceExporter({ url: target }) :
        new OTLPTraceExporter();
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

    provider.register({
        contextManager: new ZoneContextManager(),
    });

    const browser = Bowser.parse(window.navigator.userAgent);
    const span = provider.getTracer(document.location.pathname).startSpan('documentLoad', {
        attributes: {
            service_name: document.location.host,
            title: document.title,
            domain: document.location.host,
            path: document.location.pathname,
            navigator: browser.browser.name,
            os: browser.os.name,
            platform: browser.platform.type,
        },
        kind: SpanKind.CLIENT,
    });

    window.addEventListener('load', async () => {
        console.debug('...end tagging');
        span.setStatus({ code: SpanStatusCode.OK });
        span.end();
    });
}
