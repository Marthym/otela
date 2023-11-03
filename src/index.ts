import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const EXPORT_INTERVAL_MILLIS = 10_000;

export function tag(): void {
  console.debug('Start page tagging...');
  window.addEventListener('load', () => {
    console.debug('STARTING ANALYTICS');

    const meterProvider = new MeterProvider();

    meterProvider.addMetricReader(new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
      exportIntervalMillis: 10_000
    }));

    const meter = meterProvider.getMeter('otel-analytics-collector');

    const sessionDurationCounter = meter.createCounter('oa.session.duration.second', {
      description: 'Session duration in seconds',
    });

    const attributes = {
      domain: document.location.host,
      path: document.location.pathname,
    };

    const interval = setInterval(() => {
      sessionDurationCounter.add(EXPORT_INTERVAL_MILLIS / 1000, attributes);
    }, EXPORT_INTERVAL_MILLIS);

    window.addEventListener('beforeunload', async (event) => {
      event.preventDefault();
      console.debug('tagSessionDuration terminate.');
      clearInterval(interval);
      await meterProvider.forceFlush()
        .then(() => meterProvider.shutdown());
      event.returnValue = '';
    });

    const requestCounter = meter.createCounter('oa.page.enter', {
      description: 'Web site page enter',
    });

    requestCounter.add(1, attributes);
    meterProvider.forceFlush();
  });
}

// let interval;
// let meter;

// let requestCounter;

// function stopMetrics() {
//   console.log('STOPPING METRICS');
//   clearInterval(interval);
//   metrics.getMeterProvider().shutdown()
//     .then(() => metrics.disable());
// }

// function startMetrics() {
//   console.log('STARTING METRICS');

//   const meterProvider = new MeterProvider();
//   metrics.setGlobalMeterProvider(meterProvider);

//   meterProvider.addMetricReader(new PeriodicExportingMetricReader({
//     exporter: new OTLPMetricExporter(),
//     exportIntervalMillis: 2000
//   }));

//   meter = meterProvider.getMeter('example-exporter-collector');

//   requestCounter = meter.createCounter('requests', {
//     description: 'Example of a Counter',
//   });

//   const attributes = { environment: 'staging', page: document.location };

//   // interval = setInterval(() => {
//   //   requestCounter.add(1, attributes);
//   // }, 1000);
// }

// function incrementCounter() {
//     console.log('requestCounter', requestCounter);
//   if (requestCounter) {
//     console.log('+1');
//     requestCounter.add(1, { environment: 'staging', page: document.location.pathname });
//   }
// }

// const addClickEvents = () => {
//   const startBtn = document.getElementById('startBtn');

//   const stopBtn = document.getElementById('stopBtn');
//   const addBtn = document.getElementById('addBtn');
//   startBtn.addEventListener('click', startMetrics);
//   stopBtn.addEventListener('click', stopMetrics);
//   addBtn.addEventListener('click', incrementCounter);
// };

// window.addEventListener('load', addClickEvents);
