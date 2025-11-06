import dotenv from 'dotenv';

// Load environment variables from .env file FIRST
// Must be before any other imports that use env vars
dotenv.config();

import { app } from './app';

const PORT: number = parseInt(process.env.PORT || '5001', 10);


app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});
