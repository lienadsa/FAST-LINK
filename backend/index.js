import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import axios from 'axios';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import connect from 'connect-pg-simple';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.APP_PORT;


const { Pool } = pg;
const PgSession = connect(session);


const pool = new Pool({
  user: process.env.PG_USER, 
  host: process.env.PG_HOST, 
  database: process.env.PG_DATABASE, 
  password: process.env.PG_PASSWORD, 
  port: process.env.PG_PORT,
  pool_mode: process.env.PG_POOL_MODE
});


app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Only set CORS headers if request is from allowed origin
  if (origin === process.env.FRONTEND_BASE_URL) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200).end();
  }
  
  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(session({
  store: new PgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 604800000, httpOnly: true,
    sameSite: 'none',
    secure: true }
}));

pool.connect()
  .then(() => console.log('Connected to Supabase ✅'))
  .catch(err => console.error('Connection error:', err)); 

app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "wrong password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});



app.post('/signup', (req, res) => {
  console.log("request recieved at signup");
  const email = req.body.email;

  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, hash]
      );
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error during sign-up:", err);
      res.status(500).json({ message: err.message });
    }
  });
});

app.post("/login", (req, res, next) => {
  console.log("Log In route accessed");
 

  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ message: err.message + "1"  });
    if (!user) return res.status(401).json({ message: info.message + "2" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: err.message + "3"  });
      return res.status(200).json({ success: true, userId: user.id });
    });
  })(req, res, next);
});

app.get('/dashboard', async (req, res) => {
  console.log("Dashboard route accessed " + req.query.user_id );
   if (req.isAuthenticated()) {
     if (req.user.id.toString() === req.query.user_id) {
     try {
    const result = await pool.query(
      'SELECT * FROM releases WHERE user_id = $1',
      [req.query.user_id]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ success: true, data: result.rows });
    } else {
      res.status(200).json({ success: true, message: "No releases found" });
    }
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: err.message });
  } 
   }
    else {
      return res.status(403).json({ message: "Forbidden", success: false });
  }
} else {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
});

app.get('/retrieve', async (req, res) => {
  console.log("Retrieve route accessed " + req.query.user_id + " " + req.query.release_id);
  try {
    const result = await pool.query(
      'SELECT title, imageurl, spotifylink, applemusiclink, soundcloudlink, youtubelink FROM releases WHERE user_id = $1 AND release_id = $2',
      [req.query.user_id, req.query.release_id]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Release not found" });
    }
  } catch (err) {
    console.error("Error fetching release info:", err);
    res.status(500).json({ message: err.message, success: false });
  }
});

app.get('/delete', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM releases WHERE user_id = $1 AND release_id = $2',
      [req.query.user_id, req.query.release_id]
    );
    console.log("Release deleted successfully");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting release:", err);
    res.status(500).json({ message: err.message, success: false });
  }
});

app.post('/api/deezer/track/:isrc', async (req, res) => {
  const isrc = req.params.isrc;
  try {
    const response = await axios.get(`https://api.deezer.com/2.0/track/isrc:${isrc}`); 
    if (response.data.error === undefined) {
      const user_id = req.body.user_id;
      const title = response.data.title;
      const artist = response.data.contributors[0].name;
      const artwork = response.data.album.cover_xl;
      const spotifylink = `https://open.spotify.com/search/${encodeURIComponent(artist + ' ' + title)}`;
      const applelink = `https://music.apple.com/us/search?term=${encodeURIComponent(artist + ' ' + title)}`;
      const soundcloudlink = `https://soundcloud.com/search?q=${encodeURIComponent(artist + ' ' + title)}`;
      const youtubelink = `https://www.youtube.com/results?search_query=${encodeURIComponent(artist + ' ' + title)}`;
      const views = 0;
      await pool.query(
        'INSERT INTO releases (user_id, isrc, title, imageurl, spotifylink, applemusiclink, soundcloudlink, youtubelink, views) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [user_id, isrc, title, artwork, spotifylink, applelink, soundcloudlink, youtubelink, views]
      );

      console.log("Release inserted successfully");
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Error verifying ISRC:" + error.message);
    res.status(500).json({ message: error.message, success: false });
  }
});

app.post('/views', async (req, res) => {
  const { user_id, release_id } = req.body;

  try {
    await pool.query(
      'UPDATE releases SET views = views + 1 WHERE user_id = $1 AND release_id = $2',
      [user_id, release_id]
    );
    console.log("Views updated successfully");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating views:", err);
    res.status(500).json({ message: err.message, success: false });
  }
});

app.post('/stats', async (req, res) => {
  const { platformlinkName, user_id, release_id } = req.body;

  try {
    await pool.query(
      `UPDATE releases SET ${platformlinkName} = ${platformlinkName} + 1 WHERE user_id = $1 AND release_id = $2`,
      [user_id, release_id]
    );
    console.log("Stats updated successfully");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating stats:", err);
    res.status(500).json({ message: err.message, success: false });
  }
});

app.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: err.message });

    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: err.message });
      console.log("User logged out successfully");
      res.clearCookie('connect.sid');
      res.status(200).json({ success: true });
    });
  });
});


app.post('/isauthenticated', (req, res) => {
  console.log("isAuthenticated route accessed");
   if (req.isAuthenticated()) {
    console.log("skipped authentication, user already logged in");
    return res.status(200).json({ success: true, userId: req.user.id });
  } else {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
