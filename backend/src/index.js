const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorMiddleware } = require('./middlewares/error.middleware');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Routes Placeholder
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const swapRoutes = require('./routes/swap.routes');
const ratingRoutes = require('./routes/rating.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swap-request', swapRoutes);
app.use('/api/feedback', ratingRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
