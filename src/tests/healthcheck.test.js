const { describe, it } = require('node:test');
const assert = require('node:assert');
const {
  getHealthStatus,
  checkDependencies,
  healthcheckHandler,
  GET,
} = require('../routes/healthcheck.js');

describe('Healthcheck Endpoint and Service Tests', () => {
  it('exports the healthcheck module functions successfully', () => {
    assert.strictEqual(typeof getHealthStatus, 'function');
    assert.strictEqual(typeof checkDependencies, 'function');
    assert.strictEqual(typeof healthcheckHandler, 'function');
    assert.strictEqual(typeof GET, 'function');
  });

  describe('getHealthStatus()', () => {
    it('returns 200 OK semantics with healthy status and metadata', async () => {
      const health = await getHealthStatus();

      assert.strictEqual(health.status, 'ok');
      assert.strictEqual(health.message, 'Healthcheck OK');
      assert.ok(health.timestamp, 'timestamp should be present');
      assert.ok(!isNaN(Date.parse(health.timestamp)), 'timestamp should be a valid ISO date');
      assert.strictEqual(typeof health.uptime, 'number');
      assert.ok(health.uptime >= 0, 'uptime should be a positive number');
      assert.ok(health.dependencies, 'dependencies object should be present');
      assert.strictEqual(health.dependencies.database.status, 'ok');
      assert.strictEqual(health.dependencies.database.message, 'Database service is reachable');
    });

    it('returns degraded status when an external dependency is degraded', async () => {
      const health = await getHealthStatus({
        customChecks: {
          database: {
            status: 'error',
            error: 'Connection timeout',
          },
        },
      });

      assert.strictEqual(health.status, 'degraded');
      assert.strictEqual(health.message, 'Service degraded');
      assert.strictEqual(health.dependencies.database.status, 'error');
    });
  });

  describe('checkDependencies()', () => {
    it('returns healthy status when all dependencies are ok', async () => {
      const result = await checkDependencies();

      assert.strictEqual(result.status, 'healthy');
      assert.ok(result.dependencies.database);
      assert.strictEqual(result.dependencies.database.status, 'ok');
    });

    it('returns degraded status when a dependency status is not ok or healthy', async () => {
      const result = await checkDependencies({
        externalApi: {
          status: 'down',
          message: 'Third-party API unreachable',
        },
      });

      assert.strictEqual(result.status, 'degraded');
      assert.strictEqual(result.dependencies.externalApi.status, 'down');
    });
  });

  describe('healthcheckHandler()', () => {
    it('handles Express-style (req, res) responses with 200 OK', async () => {
      let statusCode = null;
      let jsonBody = null;

      const req = {};
      const res = {
        status(code) {
          statusCode = code;
          return {
            json(body) {
              jsonBody = body;
              return { statusCode, body };
            },
          };
        },
      };

      await healthcheckHandler(req, res);

      assert.strictEqual(statusCode, 200);
      assert.strictEqual(jsonBody.status, 'ok');
      assert.strictEqual(jsonBody.message, 'Healthcheck OK');
      assert.strictEqual(jsonBody.dependencies.database.status, 'ok');
    });

    it('handles Express-style responses with 503 when dependencies are degraded', async () => {
      let statusCode = null;
      let jsonBody = null;

      const req = {};
      const res = {
        status(code) {
          statusCode = code;
          return {
            json(body) {
              jsonBody = body;
              return { statusCode, body };
            },
          };
        },
      };

      await healthcheckHandler(req, res, {
        customChecks: {
          database: {
            status: 'down',
            message: 'Firestore unavailable',
          },
        },
      });

      assert.strictEqual(statusCode, 503);
      assert.strictEqual(jsonBody.status, 'degraded');
      assert.strictEqual(jsonBody.message, 'Service degraded');
    });

    it('handles Next.js / Web standard Request returning Response object', async () => {
      const req = new Request('http://localhost:3000/healthcheck');
      const response = await healthcheckHandler(req);

      assert.ok(response instanceof Response);
      assert.strictEqual(response.status, 200);

      const data = await response.json();
      assert.strictEqual(data.status, 'ok');
      assert.strictEqual(data.message, 'Healthcheck OK');
      assert.strictEqual(data.dependencies.database.status, 'ok');
    });
  });

  describe('GET() Next.js App Router route handler', () => {
    it('returns a 200 OK Response for GET /healthcheck', async () => {
      const req = new Request('http://localhost:3000/healthcheck');
      const response = await GET(req);

      assert.ok(response instanceof Response);
      assert.strictEqual(response.status, 200);

      const data = await response.json();
      assert.strictEqual(data.status, 'ok');
      assert.strictEqual(data.message, 'Healthcheck OK');
      assert.ok(data.timestamp);
      assert.ok(typeof data.uptime === 'number');
    });
  });
});
