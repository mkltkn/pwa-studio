const debug = require('debug')('upward-js:ProxyResolver');
const { URL } = require('url');
const proxyMiddleware = require('http-proxy-middleware');
const connect = require('connect');
const sharp = require('sharp');
const AbstractResolver = require('./AbstractResolver');

const AllServers = new Map();
class ProxyResolver extends AbstractResolver {
    static get resolverType() {
        return 'proxy';
    }
    static get telltale() {
        return 'target';
    }
    static get servers() {
        return AllServers;
    }
    async resolve(definition) {
        if (!definition.target) {
            throw new Error(
                `'target' URL argument is required: ${JSON.stringify(
                    definition
                )}`
            );
        }
        const toResolve = [
            this.visitor.upward(definition, 'target'),
            definition.ignoreSSLErrors
                ? this.visitor.upward(definition, 'ignoreSSLErrors')
                : false
        ];
        const [target, ignoreSSLErrors] = await Promise.all(toResolve);

        debug('resolved target %o', target);
        if (typeof target !== 'string') {
            throw new Error(
                `'target' argument to ProxyResolver must be a string URL, but was a: ${typeof target}`
            );
        }

        let server = ProxyResolver.servers.get(target);
        if (!server) {
            debug(`creating new server for ${target}`);
            const rasterImageFormats = /\.(jpg|jpeg|png|tiff)$/i;
            server = connect();
            server.use(async (req, res, next) => {
                debug(`ran through image proxy server`, req.path);
                if (rasterImageFormats.test(req.path)) {
                    debug(`matches an image at ${req.path}, running sharp`);
                    const proxyRes = await this.visitor.io.networkFetch(
                        new URL(req.path, target).href,
                        {
                            headers: {
                                'accept-encoding': 'none'
                            }
                        }
                    );
                    if (proxyRes.status >= 200 && proxyRes.status <= 400) {
                        proxyRes.body
                            .pipe(
                                sharp().jpeg({ progressive: true, quality: 50 })
                            )
                            .pipe(res);
                        return;
                    }
                }
                next();
            });
            server.use(
                proxyMiddleware({
                    target,
                    secure: !ignoreSSLErrors,
                    changeOrigin: true,
                    autoRewrite: true,
                    cookieDomainRewrite: ''
                })
            );
            ProxyResolver.servers.set(target, server);
        }

        return server;
    }
}

module.exports = ProxyResolver;
