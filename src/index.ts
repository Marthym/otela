import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import Bowser from 'bowser';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { Attributs } from './types/Attributs.type';

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

const attributes: Attributs = {
    title: document.title,
    navigator: browser.browser.name ?? 'Unknown',
    os: browser.os.name ?? 'Unknown',
    platform: browser.platform.type ?? 'Unknown',
};
if (document.referrer && document.referrer.length > 0) {
    attributes.referrer = document.referrer;
}
const span = provider.getTracer(document.location.host)
    .startSpan(decodeURI(document.location.pathname), {
        attributes: attributes,
        kind: SpanKind.CLIENT,
    });

window.addEventListener('load', async () => {
    console.log('load');
    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
});

