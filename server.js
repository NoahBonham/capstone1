const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const prisma = require("./prisma");
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const morgan = require("morgan");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.post("/api/auth/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  
  if (existingUser) {
    return res.status(409).json({ error: 'Username or email already in use.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'user registered successfully.', userId: newUser.id });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'username or email and password are required.' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
});


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/api/users/me", authenticateToken, async (req, res, next) => {
  try {
      const userId = req.user.userId;
      const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, username: true } 
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      res.json(user);
  } catch (err) {
      next(err);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.get("/api/stocks", authenticateToken, async (req, res, next) => {
  try {
    const stocks = await prisma.stock.findMany();
    res.json(stocks);
  } catch (err) {
    next(err);
  }
});

app.get("/api/reviews", authenticateToken, async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});



app.get("/api/users/stocks", authenticateToken, async (req, res, next) => {
  try {
      const userId = req.user.userId; 
      const stocks = await prisma.stock.findMany({
          where: { userId },
      });
      res.json(stocks);
  } catch (err) {
      next(err);
  }
});

app.post("/api/users/stocks", authenticateToken, async (req, res, next) => {
  try {
      const { tikr } = req.body;
      const userId = req.user.userId;

      const stock = await prisma.stock.create({
          data: {
              userId,
              tikr,
          },
      });
      res.json(stock);
  } catch (err) {
      next(err);
  }
});



app.delete("/api/users/:userId/stocks/:id", authenticateToken, async (req, res, next) => {
  try {
    const id = +req.params.id;

    const stockExists = await prisma.stock.findFirst({ where: { id } });
    if (!stockExists) {
      return next({
        status: 404,
        message: `Could not find stock with id ${id}.`,
      });
    }
    await prisma.stock.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/users/:userId", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.review.deleteMany({ where: { userId } });
    await prisma.stock.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});


app.post("/api/users/reviews", authenticateToken, async (req, res, next) => {
  try {
    const { content, tikr } = req.body;
    const userId = req.user.userId;

    const review = await prisma.review.create({
      data: {
        userId,
        content,
        tikr,
      },
    });
    res.json(review);
  } catch (err) {
    next(err);
  }
});

app.get("/api/users/:id/reviews", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: { comments: true },
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});


app.delete("/api/users/reviews/:id", authenticateToken, async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (review.userId !== req.user.userId) {
      return res.status(403).json({ message: "You can only delete your own reviews." });
    }

    await prisma.comment.deleteMany({
      where: { reviewId },
    });

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});


app.post("/api/reviews/:reviewId/comments", authenticateToken, async (req, res, next) => {
  try {
      const reviewId = +req.params.reviewId;
      const { content } = req.body;
      const userId = req.user.userId; 

      const comment = await prisma.comment.create({
          data: {
              reviewId,
              content,
              userId, 
          },
      });
      res.json(comment);
  } catch (err) {
      next(err);
  }
});


app.delete("/api/reviews/:reviewId/comments/:commentId", authenticateToken, async (req, res, next) => {
  const { reviewId, commentId } = req.params;

  try {
      const comment = await prisma.comment.findUnique({
          where: { id: parseInt(commentId) }
      });

      if (!comment) {
          return res.status(404).json({ message: "Comment not found." });
      }

      if (comment.userId !== req.user.userId) {
          return res.status(403).json({ message: "You can only delete your own comments." });
      }

      await prisma.comment.delete({
          where: { id: parseInt(commentId) }
      });

      res.sendStatus(204);
  } catch (err) {
      next(err);
  }
});

app.get("/api/reviews/:reviewId/comments", authenticateToken, async (req, res, next) => {
  try {
    const reviewId = +req.params.reviewId;
    const comments = await prisma.comment.findMany({
      where: { reviewId },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error.';
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});