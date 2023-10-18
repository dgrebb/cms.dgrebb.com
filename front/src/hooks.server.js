import { PUBLIC_ENV, PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { minify } from 'html-minifier-terser';
import { dev, building } from '$app/environment';

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  environment: PUBLIC_ENV,
  tracesSampleRate:
    PUBLIC_ENV === 'production' ? 0.5 : PUBLIC_ENV === 'staging' ? 0.25 : 0,
  replaysSessionSampleRate:
    PUBLIC_ENV === 'production' ? 0.5 : PUBLIC_ENV === 'staging' ? 0.25 : 0,
  replaysOnErrorSampleRate:
    PUBLIC_ENV === 'production' ? 0.5 : PUBLIC_ENV === 'staging' ? 0.25 : 0,
  integrations: [],
  beforeSend(event) {
    if (event.user) {
      delete event.user.ip;
    }
    if (event.server_name) {
      delete event.server_name;
    }
    return event;
  },
});

export function handleError({ error, event }) {
  Sentry.captureException(error, { extra: { event } });

  console.log('Error:');
  console.log(error);

  return {
    message: 'Whoops!',
    code: error?.code ?? 'UNKNOWN',
  };
}

const minification_options = {
  collapseWhitespace: true,
  collapseInlineTagWhitespace: false,
  removeComments: false,
  minifyCSS: true,
  minifyJS: true,
};

export async function handle({ event, resolve }) {
  let response = resolve(event);

  if (!dev && building) {
    response = await resolve(event, {
      transformPageChunk: ({ html }) => minify(html, minification_options),
    });
  }

  return response;
}
