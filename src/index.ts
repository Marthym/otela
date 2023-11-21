import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import Bowser from 'bowser';

export function tag(target?: string): void {
    console.debug('Start page tagging...');
    const provider = new WebTracerProvider();
    const exporter = (target) ?
        new OTLPTraceExporter({
            url: target,
        }) :
        new OTLPTraceExporter();
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

    provider.register({
        contextManager: new ZoneContextManager(),
    });

    const browser = Bowser.parse(window.navigator.userAgent);
    const span = provider.getTracer(document.location.pathname).startSpan('documentLoad');
    span.setAttributes({
        title: document.title,
        domain: document.location.host,
        path: document.location.pathname,
        navigator: browser.browser.name,
        os: browser.os.name,
        platform: browser.platform.type,
    });

    window.addEventListener('load', async () => {
        console.debug('STARTING ANALYTICS');
        span.end();
    });
}
