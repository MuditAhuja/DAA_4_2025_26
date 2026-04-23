# TSP Visualizer - Project Description

The **Traveling Salesman Problem (TSP) Visualizer** is an interactive, web-based educational tool designed to help users understand, visualize, and compare different algorithmic approaches to solving the classic Traveling Salesman Problem. 

The Traveling Salesman Problem asks the following question: *"Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the origin city?"* Since this is an NP-Hard problem, no known algorithm can find the perfect solution quickly for a large number of cities. 

### Key Objectives
*   **Educational Visualization**: Provide a step-by-step visual representation of how algorithms traverse nodes and evaluate paths.
*   **Algorithm Comparison**: Showcase the trade-offs between exact algorithms (Brute Force) which are slow but perfect, and heuristic/meta-heuristic algorithms (Nearest Neighbor, 2-Opt, Simulated Annealing) which are fast but approximate.
*   **Interactivity**: Allow the user to construct their own custom datasets by adding or dragging cities around a 2D canvas dynamically.

### Highlights
The visualizer offers a premium dark-themed interface, highly optimized canvas rendering, and the ability to control animation speed in real-time. It actively traces convergence data on a dynamic line graph, plotting the shortest distance found over algorithmic iterations to clearly demonstrate how heuristics refine solutions over time. 

Built completely in pure HTML, CSS, and JavaScript, it requires no external libraries or backend servers, making it lightweight and instantly accessible.
