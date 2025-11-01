import { app } from './server';

const PORT: number = parseInt(process.env.PORT || '5001', 10);

// Start server
app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});