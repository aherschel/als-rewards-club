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
    }
  };
}

export function response(context) {
  return context.result.body;
}
  