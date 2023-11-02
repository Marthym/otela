const { DiagConsoleLogger, DiagLogLevel, diag, metrics } = require('@opentelemetry/api');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

// Optional and only needed to see the internal diagnostic logging (during development)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

let interval;
let meter;

let requestCounter;

function stopMetrics() {
  console.log('STOPPING METRICS');
  clearInterval(interval);
  metrics.getMeterProvider().shutdown()
    .then(() => metrics.disable());
}

function startMetrics() {
  console.log('STARTING METRICS');

  const meterProvider = new MeterProvider();
  metrics.setGlobalMeterProvider(meterProvider);

  meterProvider.addMetricReader(new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter(),
    exportIntervalMillis: 2000
  }));

  meter = meterProvider.getMeter('example-exporter-collector')

  requestCounter = meter.createCounter('requests', {
    description: 'Example of a Counter',
  });

  const attributes = { environment: 'staging', page: document.location };

  // interval = setInterval(() => {
  //   requestCounter.add(1, attributes);
  // }, 1000);
}

function incrementCounter() {
    console.log('requestCounter', requestCounter);
  if (requestCounter) {
    console.log('+1');
    requestCounter.add(1, { environment: 'staging', page: document.location.pathname });
  }
}

const addClickEvents = () => {
  const startBtn = document.getElementById('startBtn');

  const stopBtn = document.getElementById('stopBtn');
  const addBtn = document.getElementById('addBtn');
  startBtn.addEventListener('click', startMetrics);
  stopBtn.addEventListener('click', stopMetrics);
  addBtn.addEventListener('click', incrementCounter);
};

window.addEventListener('load', addClickEvents);
