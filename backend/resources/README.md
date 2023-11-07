# Resource README

This API relies on a file-based DX for adding new bedrock enabled resolvesr to the API. This enables most iteration just by updating the `schema.graphql` and `bedrock-resolvers/*` files.

## Adding a resolver

First, start by adding a customer query/mutation/subscription to the `schema.graphql` file, e.g.

```graphql
type Query {
  generateTacoRecipe(prompt: String!): String! @aws_cognito_user_pools
}
```

Second, add a filename, which matches the query/mutation/subscription fieldname to the `bedrock-resolvers` directory, e.g.

```js
// bedrock-resolvers/generateTacoRecipe.js
export function request() {
  return {
    resourcePath: '/models/cohere.command-text-v14/invoke',
    method: 'POST',
    params: {
      headers: {
        'content-type': 'application/json',
        accept: '*/*',
      },
      body: {
        prompt: 'Write a LinkedIn post about starting a career in tech:',
        max_tokens: 100,
        temperature: 0.8,
        p: 0.01,
        k: 0,
        stop_sequences: [],
        return_likelihood: 'NONE',
      },
    },
  };
}

export function response(context) {
  return context.result.body;
} 
```

Then next synth/deploy should pick this up!.

## Updating a resolver

It should be simple as updating the `bedrock-resolvers` file you wish to modify.
