
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { Issuer } = require("openid-client");

const app = express();  
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));
let client;

(async () => {
  const issuer = await Issuer.discover(
    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`
  );

  client = new issuer.Client({
    client_id: process.env.AZURE_CLIENT_ID,
    client_secret: process.env.AZURE_CLIENT_SECRET,
    redirect_uris: [process.env.BASE_URL + "/callback"],
    response_types: ["code"]
  });
})();
app.get("/login", (req, res) => {
  const state = Math.random().toString(36).substring(2);
  req.session.state = state;

  const url = client.authorizationUrl({
    scope: "openid profile email",
    state: state
  });

  res.redirect(url);
});
app.get("/callback", async (req, res) => {
  try {
    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      process.env.BASE_URL + "/callback",
      params,
      { state: req.session.state }
    );

    // 🔥 Decode ID token
    const idToken = tokenSet.id_token;

    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString()
    );

    req.session.user = payload;

    res.redirect("/");
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Login failed");
  }
});
app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(`
      <h2>Welcome ${req.session.user.name}</h2>
      <p>Email: ${req.session.user.preferred_username}</p>
      <a href="/login">Login again</a>
    `);
  } else {
    res.send('<a href="/login">Login with Azure</a>');
  }
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

/*
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { Issuer } = require("openid-client");

const app = express();

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));

let client;

(async () => {
  const issuer = await Issuer.discover(process.env.OKTA_ISSUER);
  client = new issuer.Client({
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uris: [process.env.BASE_URL + "/callback"],
    response_types: ["code"]
  });
})();

app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(`
      <h2>Welcome ${req.session.user.name}</h2>
      <p>Email: ${req.session.user.email}</p>
      <a href="/dashboard">Go to Dashboard</a><br/>
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send('<a href="/login">Login with SSO</a>');
  }
});
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
const isAdmin = req.session.user.email.includes("admin");

if (isAdmin) {
  res.send("Admin Dashboard");
} else {
  res.send("User Dashboard");
}
  res.send(`
    <h2>Dashboard 🔐</h2>
    <p>Only logged-in users can see this</p>
    <a href="/">Home</a>
  `);
});


app.get("/login", (req, res) => {
  const state = Math.random().toString(36).substring(2);

  req.session.state = state;

  const url = client.authorizationUrl({
    scope: "openid profile email",
    state: state
  });

  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  try {
    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      process.env.BASE_URL + "/callback",
      params,
      {
        state: req.session.state
      }
    );

    const userinfo = await client.userinfo(tokenSet.access_token);

    req.session.user = userinfo;

    res.redirect("/");
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Login failed");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
*/