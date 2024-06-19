// SDK
// import { NodeSDK } from '@opentelemetry/sdk-node';
// const sdk = new NodeSDK();
// sdk.start();

// Metrics and Traces
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { CollectorTraceExporter, OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { HostMetrics } = require('@opentelemetry/host-metrics');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const collectorOptions = {
  concurrencyLimit: 1, // an optional limit on pending requests
};

const metricExporter = new OTLPMetricExporter(collectorOptions);
const meterProvider = new MeterProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'test-jun-19',
  })});

meterProvider.addMetricReader(new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 1000,
}));

// Now, start recording data
const meter = meterProvider.getMeter('example-meter');
const counter = meter.createCounter('metric_name');
counter.add(10, { 'key': 'value' });

const hostMetrics = new HostMetrics({ meterProvider, name: 'example-host-metrics-jun-17' });
hostMetrics.start();

const traceExporter = new OTLPTraceExporter();
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'test-host-jun-19',
  }),
});
// const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
provider.register();

registerInstrumentations({
  instrumentations: [
    new PgInstrumentation(),
    new HttpInstrumentation(),
    getNodeAutoInstrumentations({
      // load custom configuration for http instrumentation
      '@opentelemetry/instrumentation-http': {
        applyCustomAttributesOnSpan: (span) => {
          span.setAttribute('foo2', 'bar2');
        },
      },
    }),
  ],
});

// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import {
//   PeriodicExportingMetricReader,
//   ConsoleMetricExporter,
// } from '@opentelemetry/sdk-metrics';

// const sdk = new NodeSDK({
//   traceExporter: new ConsoleSpanExporter(),
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new ConsoleMetricExporter(),
//   }),
//   instrumentations: [getNodeAutoInstrumentations()],
// });

// sdk.start();

// TRACES
// const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
// const { CollectorTraceExporter, C } = require('@opentelemetry/exporter-collector');
// const { Resource } = require('@opentelemetry/resources');
// const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
// const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
// const { registerInstrumentations } = require('@opentelemetry/instrumentation');
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// const exporterC = new CollectorTraceExporter();
// const provider = new NodeTracerProvider({
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: 'test-1',
//   }),
// });
// provider.addSpanProcessor(new SimpleSpanProcessor(exporterC));
// provider.register();

// registerInstrumentations({
//   instrumentations: [
//     getNodeAutoInstrumentations({
//       // load custom configuration for http instrumentation
//       '@opentelemetry/instrumentation-http': {
//         applyCustomAttributesOnSpan: (span) => {
//           span.setAttribute('foo2', 'bar2');
//         },
//       },
//     }),
//   ],
// });


// HOST
// const { Resource } = require('@opentelemetry/resources');
// const { HostMetrics } = require('@opentelemetry/host-metrics');
// const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
// const exporterP = new PrometheusExporter(
//   {
//     startServer: true
//   }, () => {
//     console.log('prometheus scrape endpoint: http://localhost:9464/metrics')
//   }
// );

// const meterProvider = new MeterProvider({
//   resource: new Resource({
//     [SEMRESATTRS_SERVICE_NAME]: 'my-test',
//   })});
// // const meterProvider = new MeterProvider();
// meterProvider.addMetricReader(exporterP);

// const hostMetrics = new HostMetrics({ meterProvider, name: 'example-host-metrics' });
// hostMetrics.start();

///

// const { HostMetrics } = require('@opentelemetry/host-metrics');
// const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
// const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
// const collectorOptions = {
//   concurrencyLimit: 1, // an optional limit on pending requests
// };
// const metricExporter = new OTLPMetricExporter(collectorOptions);
// const meterProvider = new MeterProvider({
//   resource: new Resource({
//     [SEMRESATTRS_SERVICE_NAME]: 'my-test-2',
//   })});

// meterProvider.addMetricReader(new PeriodicExportingMetricReader({
//   exporter: metricExporter,
//   exportIntervalMillis: 1000,
// }));

// // Now, start recording data
// const meter = meterProvider.getMeter('example-meter');
// const counter = meter.createCounter('metric_name');
// counter.add(10, { 'key': 'value' });

// const hostMetrics = new HostMetrics({ meterProvider, name: 'example-host-metrics' });
// hostMetrics.start();

//////////////////////

// Logs
// const logsAPI = require('@opentelemetry/api-logs');
// const {
//   LoggerProvider,
//   SimpleLogRecordProcessor,
//   ConsoleLogRecordExporter,
// } = require('@opentelemetry/sdk-logs');

// // To start a logger, you first need to initialize the Logger provider.
// const loggerProvider = new LoggerProvider();
// // Add a processor to export log record
// loggerProvider.addLogRecordProcessor(
//   new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
// );

// //  To create a log record, you first need to get a Logger instance
// const logger = loggerProvider.getLogger('default');

// // emit a log record
// logger.emit({
//   severityNumber: logsAPI.SeverityNumber.INFO,
//   severityText: 'INFO',
//   body: 'this is a log record body',
//   attributes: { 'log.type': 'LogRecord' },
// });


// Test metrics DB
// const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
// const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
// const collectorOptions = {
//   concurrencyLimit: 1, // an optional limit on pending requests
// };
// const metricExporter = new OTLPMetricExporter(collectorOptions);
// const meterProvider = new MeterProvider({
//   resource: new Resource({
//     [SEMRESATTRS_SERVICE_NAME]: 'my-test-custom-metric',
//   })});

// meterProvider.addMetricReader(new PeriodicExportingMetricReader({
//   exporter: metricExporter,
//   exportIntervalMillis: 1000,
// }));

// // Now, start recording data
// const meter = meterProvider.getMeter('example-meter');
// const counter = meter.createCounter('metric_name');
// counter.add(10, { 'key': 'value' });
