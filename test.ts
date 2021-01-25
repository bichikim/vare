const testsContext = require.context('./packages/vare/__tests__', true, /spec.ts$/)

testsContext.keys().forEach(testsContext)
