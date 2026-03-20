# Otela

<img src="./assets/otela.svg" alt="Size Limit CLI" align="right" style="float: right; margin: auto; width: 100px">

Vector for Web Analytics.

Otela provides a means of measuring the audience of a static website via a Grafana stack.

## Installation

```html
<!-- Otela -->
<script>
    var _ota=window._ota=window._ota||{};_ota.t="your.analytics.server";
    (function(){
        var t=document,e=t.createElement("script"),a=t.getElementsByTagName("script")[0];
        e.async=!0;e.src="https://github.com/Marthym/otela/releases/download/1.1.0/otela.js";a.parentNode.insertBefore(e,a)
    })();
</script>
<!-- End Otela Code -->
```

## Build

```shell
npm ci
npm run build
```

## Development & Testing

### Using Docker Compose

The project includes a complete testing stack with Docker Compose, featuring:

- **Grafana** (port 3000) - Visualization dashboard
  - Username: `admin`
  - Password: `admin`
- **Prometheus** - Metrics storage
- **Loki** - Log aggregation
- **Vector** - Data pipeline for web analytics
- **Nginx** (port 8080) - Web server for testing

#### Starting the Stack

```shell
docker-compose up -d
```

#### Accessing Services

- Grafana Dashboard: http://localhost:3000
- Test Website: http://localhost:8080

#### Stopping the Stack

```shell
docker-compose down
```

To remove volumes as well:

```shell
docker-compose down -v
```

#### Viewing Logs

```shell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f vector
docker-compose logs -f grafana
```

### Configuration Files

The Docker Compose setup uses configuration files located in `.compose/`:

- `.compose/grafana/provisioning/` - Grafana datasources and dashboards
- `.compose/prometheus/` - Prometheus configuration
- `.compose/vector/` - Vector pipeline configuration
- `.compose/nginx/conf.d/` - Nginx web server configuration
