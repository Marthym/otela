# Otela

OpenTelemetry for Web Analytics.

Otela provides a means of measuring the audience of a static website via a Grafana stack, thanks to the use of OpenTelemetry.

## Installation

```html
<!-- Otela -->
<script>
    var _ota=window._ota=window._ota||{};_ota.t="your.opentelemetry.server";
    (function(){
        var t=document,e=t.createElement("script"),a=t.getElementsByTagName("script")[0];
        e.async=!0;e.src="/otela.js";a.parentNode.insertBefore(e,a)
    })();
</script>
<!-- End Otela Code -->
```

## Build

```shell
npm ci
npm run build
```
