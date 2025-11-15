# Contributing to DummyImage

Thank you for your interest in contributing to DummyImage! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dummyimage.git
   cd dummyimage
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Local Development Server**
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:8787`

## Testing Your Changes

### Manual Testing

You can test the service manually by making HTTP requests:

```bash
# Basic image
curl http://localhost:8787/600x400

# With colors
curl http://localhost:8787/600x400/ff0000/ffffff

# With custom text
curl http://localhost:8787/600x400/cccccc/969696/Hello%20World
```

### Browser Testing

Open `examples.html` in your browser to see visual examples of the generated images.

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code patterns
- Keep functions small and focused

## Submitting Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Keep changes focused and minimal
   - Test thoroughly
   - Update documentation if needed

3. **Commit Your Changes**
   ```bash
   git commit -m "Description of your changes"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues

## Feature Ideas

Some ideas for contributions:

- Add support for PNG/JPEG output (would require additional libraries)
- Add more text formatting options (font family, weight, etc.)
- Add support for gradients
- Add support for patterns or textures
- Implement request rate limiting
- Add analytics/metrics

## Questions?

Feel free to open an issue for any questions or discussions about contributing!
