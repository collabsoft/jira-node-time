import Resolver from '@forge/resolver';

const resolver = new Resolver();

// Dummy sample API definition
resolver.define('getText', (req) => {
    console.log(req);

    return 'Hello, world!';
});

export const handler = resolver.getDefinitions();

