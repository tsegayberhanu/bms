const allowedOrigins = ['https://bms-3k5g.onrender.com/'];
export const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Required for cookies & auth headers
  optionsSuccessStatus: 200
};