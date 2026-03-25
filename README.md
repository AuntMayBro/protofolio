# Aditya Singh Bagri - Portfolio

Welcome to the source code for my personal portfolio website!

This is a modern, static Single-Page Application (SPA) built using pure native web technologies. It is entirely free of heavy frontend frameworks, relying instead on clean, modular architecture, Vanilla JavaScript, and raw CSS for maximum performance and fluid animations.

## ✨ Features

- **Blazing Fast Performance:** Zero framework bloat. Built with highly-optimized vanilla HTML, CSS, and JS.
- **Dynamic Interactions:**
  - Micro-interactions on links and buttons.
  - Interactive trailing custom cursor.
  - Hover-responsive 3D tilt effects on project cards (`rotateToMouse` logic).
- **Sensory Experience:** Integrated background audio and click-sound feedback.
- **Modern Animations:** `IntersectionObserver`-based scroll reveals and ultra-lightweight Lottie SVG animations.
- **Serverless Contact Form:** Fully functional contact form powered by the Web3Forms API, handling submissions entirely on the client side using `fetch`.

## 🛠️ Architecture

### Code Structure
To maintain scalability, the codebase adheres to strict separation of concerns:

- `index.html`: Clean, semantic HTML structure using modern HTML5 tags.
- `functions.js`: Highly modularized JavaScript handling the DOM and logic. Every distinct feature (Cursor, Audio, Forms, etc.) has an isolated `init()` function called sequentially on `DOMContentLoaded`.
- `/css/`: CSS is thoroughly modularized, preventing global scope clashes. Styles are broken down explicitly by component (e.g., `hero.css`, `projects.css`, `skills.css`).

## 🚀 Local Development

To run this project locally, simply clone the repository and serve the files statically.

```bash
# Clone the repository
git clone https://github.com/AuntMayBro/protofolio.git
cd protofolio

# Serve via Python's built-in HTTP server
python -m http.server 8000
```
Then navigate to `http://localhost:8000/` in your browser.

## 🤝 Let's Connect

Feel free to reach out if you're interested in collaboration, discussing new opportunities, or if you simply want to say hello!

- **Email:** bagriaditya00@gmail.com
- **LinkedIn:** [Aditya Singh Bagri](https://www.linkedin.com/in/aditya-singh-bagri00a0088)

---
*Built with ❤️ by Aditya Singh Bagri.*
