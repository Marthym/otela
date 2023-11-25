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
const _ota = window._ota = window._ota || {};
const host = (_ota.t) ? _ota.t : document.location.host;
const path = (_ota.p) ? _ota.p : '/v1/traces';
const exporter = new OTLPTraceExporter({ url: `//${host}${path}` });
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

