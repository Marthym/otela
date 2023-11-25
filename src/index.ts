import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import Bowser from 'bowser';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';

const provider = new WebTracerProvider({
    resource: new Resource({
        'service.name': document.location.host,
    }),
});

const browser = Bowser.parse(window.navigator.userAgent);

export function tag(target?: string): void {
    const exporter = (target) ?
        new OTLPTraceExporter({ url: target }) :
        new OTLPTraceExporter();
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

    const span = provider.getTracer(document.location.pathname).startSpan('documentLoad', {
        attributes: {
            title: document.title,
            domain: document.location.host,
            path: document.location.pathname,
            navigator: browser.browser.name,
            os: browser.os.name,
            platform: browser.platform.type,
            referrer: document.referrer,
        },
        kind: SpanKind.CLIENT,
    });

    window.addEventListener('load', async () => {
        span.setStatus({ code: SpanStatusCode.OK });
        span.end();
    });
}
