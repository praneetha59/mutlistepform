const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint: Check email uniqueness
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Simulated 1-second network latency
  setTimeout(() => {
    const isTaken = ['taken@example.com', 'test@test.com'].includes(email.toLowerCase());
    if (isTaken) {
      return res.status(200).json({ available: false, message: 'This email is already in use' });
    }
    return res.status(200).json({ available: true });
  }, 1000);
});

// Endpoint: Check coupon/promo code
app.post('/api/check-promo', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Promo code is required' });
  }

  const cleanCode = code.trim().toUpperCase();

  // Simulated 1.2-second network latency
  setTimeout(() => {
    if (cleanCode === 'SAVE10') {
      return res.status(200).json({ valid: true, discount: 0.1 });
    } else if (cleanCode === 'SAVE20') {
      return res.status(200).json({ valid: true, discount: 0.2 });
    } else {
      return res.status(200).json({ valid: false, message: 'Invalid promo code' });
    }
  }, 1200);
});

// Endpoint: Submit the registration form
app.post('/api/submit-form', (req, res) => {
  const formData = req.body;

  if (!formData || !formData.email) {
    return res.status(400).json({ error: 'Form data is incomplete' });
  }

  // Simulated 1.5-second network latency
  setTimeout(() => {
    // For testing error boundaries, fail if email is fail@example.com
    if (formData.email.toLowerCase() === 'fail@example.com') {
      return res.status(500).json({ error: 'Server error: Database insertion failed' });
    }

    console.log('Form data submitted successfully:', formData);
    return res.status(200).json({ 
      success: true, 
      message: 'Subscription completed successfully!' 
    });
  }, 1500);
});

app.listen(PORT, () => {
  console.log(`Mock API Server is running on port ${PORT}`);
});
