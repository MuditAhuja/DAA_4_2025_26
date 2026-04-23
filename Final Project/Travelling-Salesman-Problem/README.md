# Traveling Salesman Problem (TSP) Visualizer

An interactive, responsive web application for visualizing various algorithms solving the Traveling Salesman Problem (TSP). 

The application offers a beautiful interface, dynamic step-by-step canvas rendering, and real-time statistics to help visualize how different algorithmic strategies tackle one of computer science's most famous optimization problems.

![TSP Visualizer Concept](https://upload.wikimedia.org/wikipedia/commons/1/10/Travelling_salesman_problem_solved_with_simulated_annealing.gif) *(Example of TSP convergence)*

## Features

- **Interactive Canvas:** Click to place cities, drag to reposition them, or right-click to delete them.
- **Real-Time Visualization:** Watch the algorithms execute step-by-step. Toggle the animation on/off or adjust the speed dynamically.
- **Multiple Algorithms:**
  - **Nearest Neighbor (Greedy):** A fast heuristic that simply connects to the closest unvisited city.
  - **2-Opt Heuristic:** A local search algorithm that iteratively untangles intersections to improve paths.
  - **Simulated Annealing:** A meta-heuristic mimicking the cooling of metal, excellent for avoiding local minima in large datasets.
  - **Brute Force (Exact):** Evaluates all possible permutations to guarantee the absolute optimal path. (Capped at 11 cities for performance safety).
- **Convergence Graph:** An overlaid dynamic chart plots distance improvements against algorithm iterations.
- **Import / Export:** Save your city coordinate configurations as JSON to test the exact same dataset across different algorithms.

## Installation & Usage

Because this visualizer is built using Vanilla JavaScript and standard HTML5/CSS3, no backend environment or package manager is needed.

1. **Clone or Download the Repository:**
   Download the folder containing `index.html`, `styles.css`, and `app.js`.
2. **Run the Application:**
   Simply double-click the `index.html` file to open it in your preferred modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.).

## How to Interact

1. **Generating Cities:** Use the sidebar to generate a specific number of randomly distributed cities, or click anywhere on the main canvas to manually place them.
2. **Selection:** Choose your desired algorithm from the dropdown menu.
3. **Control Flow:** Click **Start** to begin the simulation. You can **Pause** midway or click **Reset** to clear the algorithmic state while keeping your cities intact.
4. **Animation Speed:** Slide the "Animation Speed" bar. Moving it to the right computes thousands of iterations per second, while moving it to the left allows you to examine individual node evaluations.

## Project Structure

- `index.html`: The structural backbone of the UI, sidebar controls, and the canvas elements.
- `styles.css`: Styling engine including CSS variables, premium dark-mode layout, and responsive flexboxes.
- `app.js`: The algorithmic engine. Contains the JS Generators `function*` handling asynchronous algorithm steps, HTML DOM interactions, and the `requestAnimationFrame` drawing loop.

## Technologies Used

- **HTML5 Canvas:** For high-performance 2D rendering.
- **Vanilla JavaScript (ES6+):** Utilizes Generator functions (`function*` and `yield`) to manage non-blocking algorithmic animation loops.
- **CSS3:** For glassmorphism UI elements, styling, and transitions.

## License

This project is open-source and free to use for educational and demonstrative purposes.
