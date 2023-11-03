import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader, AggregationTemporality } from '@opentelemetry/sdk-metrics';

const EXPORT_INTERVAL_MILLIS = 10_000;

export function tag(target?: string): void {
  console.debug('Start page tagging...');
  window.addEventListener('load', () => {
    console.debug('STARTING ANALYTICS');

    const meterProvider = new MeterProvider();
    const exporter = (target !== undefined) ? new OTLPMetricExporter({temporalityPreference: AggregationTemporality.DELTA}) : new OTLPMetricExporter({ url: target, temporalityPreference: AggregationTemporality.DELTA });
    meterProvider.addMetricReader(new PeriodicExportingMetricReader({ exporter: exporter, exportIntervalMillis: 3_600_000 }));

    const meter = meterProvider.getMeter('otel-analytics-collector');
    const sessionDurationCounter = meter.createCounter('oa.session.duration.second', {
      description: 'Session duration in seconds',
    });

    console.debug(document.location);
    const attributes = {
      domain: document.location.host,
      path: document.location.pathname,
    };

    const interval = setInterval(() => {
      sessionDurationCounter.add(EXPORT_INTERVAL_MILLIS / 1000, attributes);
      meterProvider.forceFlush();
    }, EXPORT_INTERVAL_MILLIS);

    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      console.debug('tagSessionDuration terminate.');
      clearInterval(interval);
      await meterProvider.forceFlush()
        .then(() => meterProvider.shutdown());
      event.returnValue = '';
    });

    const requestCounter = meter.createCounter('oa.page.visit', {
      description: 'Web site page visit',
    });

    requestCounter.add(1, attributes);
    meterProvider.forceFlush();
  });
}
