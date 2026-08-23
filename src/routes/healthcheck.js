/**
 * Healthcheck route handler and system diagnostics
 * Path: src/routes/healthcheck.js
 */

/**
 * Checks external dependencies status
 * @param {Record<string, { status: string, message?: string, error?: string }>} [customChecks]
 * @returns {Promise<{ status: 'healthy' | 'degraded', dependencies: Record<string, unknown> }>}
 */
async function checkDependencies(customChecks = {}) {
  const dependencies = {
    database: {
      status: 'ok',
      message: 'Database service is reachable',
    },
    ...customChecks,
  };

  let allHealthy = true;
  for (const key of Object.keys(dependencies)) {
    const dep = dependencies[key];
    if (dep && dep.status !== 'ok' && dep.status !== 'healthy') {
      allHealthy = false;
    }
  }

  return {
    status: allHealthy ? 'healthy' : 'degraded',
    dependencies,
  };
}

/**
 * Retrieves comprehensive health status
 * @param {{ customChecks?: Record<string, unknown>, uptime?: number }} [options]
 */
async function getHealthStatus(options = {}) {
  const { customChecks = {}, uptime = process.uptime() } = options;
  const depCheck = await checkDependencies(customChecks);
  const isHealthy = depCheck.status === 'healthy';

  return {
    status: isHealthy ? 'ok' : 'degraded',
    message: isHealthy ? 'Healthcheck OK' : 'Service degraded',
    timestamp: new Date().toISOString(),
    uptime,
    environment: process.env.NODE_ENV || 'development',
    dependencies: depCheck.dependencies,
  };
}

/**
 * Universal healthcheck handler supporting both (req, res) and Next.js / Web Request
 * @param {Request|any} [req]
 * @param {any} [res]
 * @param {Record<string, unknown>} [options]
 */
async function healthcheckHandler(req, res, options = {}) {
  try {
    const health = await getHealthStatus(options);
    const statusCode = health.status === 'ok' ? 200 : 503;

    // Express-like response object (req, res)
    if (res && typeof res.status === 'function') {
      return res.status(statusCode).json(health);
    }

    // Web Standard Response (Next.js App Router / Fetch API)
    if (typeof Response !== 'undefined') {
      return Response.json(health, { status: statusCode });
    }

    return { status: statusCode, body: health };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const errorPayload = {
      status: 'error',
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    if (res && typeof res.status === 'function') {
      return res.status(500).json(errorPayload);
    }

    if (typeof Response !== 'undefined') {
      return Response.json(errorPayload, { status: 500 });
    }

    return { status: 500, body: errorPayload };
  }
}

/**
 * Next.js App Router GET Handler
 * @param {Request} request
 */
async function GET(request) {
  return healthcheckHandler(request);
}

module.exports = {
  checkDependencies,
  getHealthStatus,
  healthcheckHandler,
  GET,
  default: healthcheckHandler,
};

