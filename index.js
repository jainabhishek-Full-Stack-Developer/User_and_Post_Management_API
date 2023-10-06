const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const emailValidator = require('email-validator');
const cookieParser = require('cookie-parser');


const app = express();
app.use(bodyParser.json());
app.use(cookieParser());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_post',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});



// User Sign-Up API
app.post('/api/signup', (req, res) => {
  const { name, email } = req.body;

  if (!name) {
    return res.status(400).json({ status: 400, message: 'Name is required.' });
  }

  if (!email) {
    return res.status(400).json({ status: 400, message: 'Email is required.' });
  }

  if (!emailValidator.validate(email)) {
    return res.status(400).json({ status: 400, message: 'Invalid email format.' });
  }

  db.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error checking email existence:', err);
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    }

    const userCount = results[0].count;

    if (userCount > 0) {
      return res.status(400).json({ status: 400, message: 'Email already registered.' });
    }

    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (insertErr, result) => {
      if (insertErr) {
        console.error('Error inserting user:', insertErr);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
      }
      else {
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        const expirationDate = new Date(Date.now() + oneDayInMilliseconds);
        res.cookie('email', email, { expires: expirationDate, httpOnly: true });
        return res.status(200).json({ status: 200, message: 'Successful user sign-up.' });
      }

    });
  });
});



//Create Post API
app.post('/api/posts', (req, res) => {
  const { userId, content } = req.body;

  if (!userId) {
    return res.status(400).json({ status: 400, message: 'User ID  required.' });
  }

  if (!content) {
    return res.status(400).json({ status: 400, message: 'Content cannot be empty' });
  }

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err);
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: 404, message: 'User ID not found.' });
    }


    db.query('INSERT INTO posts (userId, content) VALUES (?, ?)', [userId, content], (err) => {
      if (err) {
        console.error('Error inserting post:', err);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
      }

      return res.status(200).json({ status: 200, message: 'Successfully created.' });
    });
  });
});


// Delete Post API
app.delete('/api/deletepost/:postId', (req, res) => {
  const postId = req.params.postId;
  const userEmail = req.cookies.email;

  db.query('SELECT userId FROM posts WHERE id = ?', [postId], (err, result) => {
    if (err) {
      console.error('Error checking post ownership:', err);
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ status: 404, message: 'Post ID not found.' });
    }


    db.query('SELECT id FROM users WHERE email = ?', [userEmail], (emailErr, emailResult) => {
      if (emailErr) {
        console.error('Error fetching user email:', emailErr);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
      }

      if (emailResult.length === 0) {
        return res.status(404).json({ status: 404, message: 'User not found for the post.' });
      }

      const postOwnerid = emailResult[0].id;

      db.query('DELETE FROM posts WHERE id = ? and userId = ?', [postId, postOwnerid], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Error deleting post:', deleteErr);
          return res.status(500).json({ status: 500, message: 'Internal server error' });
        }

        if (deleteResult.affectedRows === 0) {
          return res.status(403).json({ status: 403, message: 'Unauthorized to delete this post.' });
        }

        return res.status(200).json({ status: 200, message: 'Successful post deletion.' });
      });
    });
  });
});

// Fetch User's Posts API
app.get('/api/posts/:userId', (req, res) => {
  const userId = req.params.userId;


  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, userResults) => {
    if (err) {
      console.error('Error checking user existence:', err);
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ status: 404, message: 'User ID not found.' });
    }


    db.query('SELECT id AS postId, content FROM posts WHERE userId = ?', [userId], (err, postResults) => {
      if (err) {
        console.error('Error fetching posts:', err);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
      }

      if (postResults.length === 0) {
        return res.status(404).json({ status: 404, message: 'No posts found for this user.' });
      }

      return res.status(200).json({ status: 200, posts: postResults });
    });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
