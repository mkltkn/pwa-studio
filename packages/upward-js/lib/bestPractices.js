const connect = require('connect');
const shrinkRay = require('shrink-ray-current');
const helmet = require('helmet');
// TODO: Any other zero-conf best practices should go here.
function bestPractices() {
    const bestPracticeMiddlewares = connect();
    bestPracticeMiddlewares.use(shrinkRay());
    bestPracticeMiddlewares.use(helmet());
    return bestPracticeMiddlewares;
}

module.exports = bestPractices;
