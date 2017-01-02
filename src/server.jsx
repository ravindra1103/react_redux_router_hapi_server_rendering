import { Server } from "hapi";
import h2o2 from "h2o2";
import inert from "inert";
import React from "react";
import ReactDOM from "react-dom/server";
import { RouterContext, match } from "react-router";
import configureStore from "./store.jsx";
import RadiumContainer from './containers/RadiumContainer.jsx';
import { Provider } from 'react-redux';
import routesContainer from "./routes.jsx";
import url from "url";
import CookieAuth from 'hapi-auth-cookie';
import Boom from 'boom';
import Bcrypt from 'bcrypt';
let routes = routesContainer;

/**
* Create Redux store, and get intitial state.
*/
const store = configureStore();
const initialState = store.getState();
/**
* Start Hapi server
*/
var envset = {
  production: process.env.NODE_ENV === 'production'
};

const hostname = envset.production ? (process.env.HOSTNAME || process['env'].HOSTNAME) : "localhost";
var port = envset.production ? (process.env.PORT || process['env'].PORT) : 3000;
const server = new Server();

server.connection({host: hostname, port: port});

server.register(
  [
    h2o2,
    inert,
    CookieAuth
  ],
  (err) => {
    if (err) {
      throw err;
    }
    var Users = {
      future: {
        username: 'future',
        password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkVUhEZxQCrExQaxzhcdR2xMmpSJiG',   // 'studio'
        name: 'Future Studio',
        id: '1'
      }
    };
    server.auth.strategy('session', 'cookie', true, {
      password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
      cookie: 'future-studio-hapi-tutorials-cookie-auth-example',
      isSecure: false
    });

  server.route({
    method:  "GET",
    path:    "/{params*}",
    config: {
      auth: 'session',
      handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
          return reply.file("static" + request.path);
        }
      }
    }
  });

  server.route({
    method:  "GET",
    path:    "/index",
    config: {
      auth: false,
      handler: function(request, reply) {
        return reply.file("static" + request.path);
      }
    }
  });
  server.route({
    method:  "GET",
    path:    "/logo.svg",
    config: {
      auth: false,
      handler: function(request, reply) {
        return reply.file("static" + request.path);
      }
    }
  });
  server.route({
    method:  "POST",
    path:    "/login",
    config: {
      auth: false,
      handler: function(request, reply) {
        console.log("handle in login");
        var password = request.payload.password;
        var username = request.payload.username;
        var user = Users[ username ];
        return Bcrypt.compare(password, user.password, function (err, isValid) {
          if (isValid) {
            console.log("user authentication successful");
            request.server.log('info', 'user authentication successful');
            request.cookieAuth.set(user);
            return reply.redirect("/home");
          } else {
            return reply.redirect("/");
          }
        });
        return reply.redirect("/");
      }
    }
  });
  server.route({
    method:  "GET",
    path:    "/logout",
    config: {
      auth: 'session',
      handler: function (request, reply) {
        console.log("handle in logout");
        if (request.cookieAuth) {
          request.cookieAuth.clear();
          console.log("logged out successfully");
        }
        return reply.redirect("/");
      }
    }
  });
  /**
  * Endpoint that proxies all GitHub API requests to https://api.github.com.
  */
server.route({
  method: "GET",
  path: "/api/github/{path*}",
  handler: {
    proxy: {
      passThrough: true,
      mapUri (request, callback) {
        callback(null, url.format({
          protocol: "https",
          host:     "api.github.com",
          pathname: request.params.path,
          query:    request.query
        }));
      },
      onResponse (err, res, request, reply, settings, ttl) {
        reply(res);
      }
    }
  }
});
    server.start(() => {
      console.info("==> Server is listening");
      console.info("==> Go to " + server.info.uri.toLowerCase());
    });
  });




  /**
  * Catch dynamic requests here to fire-up React Router.
  */
server.ext("onPreResponse", (request, reply) => {
  if (typeof request.response.statusCode !== "undefined") {
    return reply.continue();
  }

  match({routes, location: request.path}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      reply.redirect(redirectLocation.pathname + redirectLocation.search);
      return;
    }
    if (error || !renderProps) {
      reply.continue();
      return;
    }
    const reactString = ReactDOM.renderToString(
        <Provider store={store}>
          <RadiumContainer radiumConfig={{userAgent: request.headers['user-agent']}}>
            <RouterContext {...renderProps} />
          </RadiumContainer>
        </Provider>
      );
    const webserver = __PRODUCTION__ ? "" : `//${hostname}:8080`;
    let output = (
        `<!doctype html>
        <html lang="en-us">
          <head>
            <meta charset="utf-8">
              <title>Hapi Universal Redux</title>
              <link rel="shortcut icon" href="/favicon.ico">
            </head>
            <body>
              <div id="react-root">${reactString}</div>
              <script>
                window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
                window.__UA__ = ${JSON.stringify(request.headers['user-agent'])}
              </script>
              <script src=${webserver}/dist/client.js></script>
            </body>
          </html>`
        );
    reply(output);
  });
});

if (__DEV__) {
  if (module.hot) {
    console.log("[HMR] Waiting for server-side updates");

    module.hot.accept("./routes", () => {
      routes = require("./routes");
    });

    module.hot.addStatusHandler((status) => {
      if (status === "abort") {
        setTimeout(() => process.exit(0), 0);
      }
    });
  }
}
