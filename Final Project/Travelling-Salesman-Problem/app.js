document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let cities = [];
    let bestPath = [];
    let bestDistance = Infinity;
    let currentPath = [];
    let isRunning = false;
    let isPaused = false;
    let iterations = 0;
    let startTime = 0;
    let timeTaken = 0;
    let generator = null;
    let graphData = []; 
    let frameCount = 0;

    // Canvas Elements
    const canvas = document.getElementById('tsp-canvas');
    const ctx = canvas.getContext('2d');
    const graphCanvas = document.getElementById('graph-canvas');
    const graphCtx = graphCanvas.getContext('2d');
    
    // Handle Resizing
    function resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        graphCanvas.width = graphCanvas.parentElement.clientWidth;
        graphCanvas.height = graphCanvas.parentElement.clientHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Distance Utility Functions
    function dist(city1, city2) {
        const dx = city1.x - city2.x;
        const dy = city1.y - city2.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function calcPathDistance(path) {
        let d = 0;
        for(let i=0; i<path.length-1; i++) d += dist(path[i], path[i+1]);
        if(path.length > 1) d += dist(path[path.length-1], path[0]);
        return d;
    }

    // Algorithms (implemented as Generators to allow step-by-step animation)
    
    // 1. Nearest Neighbor (Greedy)
    function* nearestNeighborAlgo() {
        if (cities.length < 2) return;
        
        let unvisited = [...cities];
        let currentCity = unvisited.shift(); 
        let path = [currentCity];
        
        while (unvisited.length > 0) {
            let nearestIdx = -1;
            let minDist = Infinity;
            
            for (let i = 0; i < unvisited.length; i++) {
                let d = dist(currentCity, unvisited[i]);
                
                // Show current consideration
                currentPath = [...path, unvisited[i]];
                iterations++;
                yield; 
                
                if (d < minDist) {
                    minDist = d;
                    nearestIdx = i;
                }
            }
            
            currentCity = unvisited.splice(nearestIdx, 1)[0];
            path.push(currentCity);
            
            let d = calcPathDistance(path);
            if (d < bestDistance || bestDistance === Infinity) {
                bestDistance = d;
                bestPath = [...path];
                graphData.push({ iteration: iterations, distance: bestDistance });
            }
        }
        
        // Connect back to start
        bestPath = [...path];
        bestDistance = calcPathDistance(bestPath);
        graphData.push({ iteration: iterations, distance: bestDistance });
        currentPath = [];
    }

    // 2. Simulated Annealing with 2-opt neighborhood
    function* simulatedAnnealingAlgo() {
        if (cities.length < 2) return;
        
        // Start with a random path
        let current = [...cities];
        for(let i = current.length-1; i>0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [current[i], current[j]] = [current[j], current[i]];
        }
        
        let currentDist = calcPathDistance(current);
        bestPath = [...current];
        bestDistance = currentDist;
        graphData.push({ iteration: 0, distance: bestDistance });
        
        let temp = 10000;
        let coolingRate = 0.9999; 
        
        while(temp > 0.1) {
            let newPath = [...current];
            let idx1 = Math.floor(Math.random() * newPath.length);
            let idx2 = Math.floor(Math.random() * newPath.length);
            if (idx1 > idx2) [idx1, idx2] = [idx2, idx1];
            
            // 2-opt swap (reverse segment)
            let left = idx1, right = idx2;
            while(left < right) {
                [newPath[left], newPath[right]] = [newPath[right], newPath[left]];
                left++;
                right--;
            }
            
            let newDist = calcPathDistance(newPath);
            
            // Acceptance criteria
            if (newDist < currentDist) {
                current = newPath;
                currentDist = newDist;
                if (currentDist < bestDistance) {
                    bestPath = [...current];
                    bestDistance = currentDist;
                    graphData.push({ iteration: iterations, distance: bestDistance });
                }
            } else {
                let acceptanceProb = Math.exp((currentDist - newDist) / temp);
                if (Math.random() < acceptanceProb) {
                    current = newPath;
                    currentDist = newDist;
                }
            }
            
            currentPath = current;
            iterations++;
            temp *= coolingRate;
            yield;
        }
        currentPath = [];
    }

    // 3. Brute Force (Lexicographical order)
    function* bruteForceAlgo() {
        if (cities.length < 2) return;
        if (cities.length > 11) {
            alert("Brute force is only feasible for up to 11 cities! Please reduce the number of cities or use another algorithm.");
            return;
        }
        
        // Fix city 0 as start to reduce permutations by N factor
        let order = cities.map((_, i) => i).slice(1);
        bestDistance = Infinity;
        
        while(true) {
            let currentP = [cities[0], ...order.map(i => cities[i])];
            let d = calcPathDistance(currentP);
            
            if (d < bestDistance) {
                bestDistance = d;
                bestPath = [...currentP];
                graphData.push({ iteration: iterations, distance: bestDistance });
            }
            currentPath = currentP;
            iterations++;
            yield;
            
            if (order.length === 0) break;

            // Generate next permutation
            let largestI = -1;
            for (let i = 0; i < order.length - 1; i++) {
                if (order[i] < order[i + 1]) largestI = i;
            }
            if (largestI === -1) break; // Reached last permutation
            
            let largestJ = -1;
            for (let j = 0; j < order.length; j++) {
                if (order[largestI] < order[j]) largestJ = j;
            }
            
            [order[largestI], order[largestJ]] = [order[largestJ], order[largestI]];
            
            let left = largestI + 1;
            let right = order.length - 1;
            while(left < right) {
                [order[left], order[right]] = [order[right], order[left]];
                left++;
                right--;
            }
        }
        currentPath = [];
    }

    // 4. 2-Opt Heuristic
    function* twoOptAlgo() {
        if (cities.length < 2) return;
        
        // Start with a greedy nearest neighbor path to give 2-opt a decent starting point
        let unvisited = [...cities];
        let current = [unvisited.shift()];
        
        while (unvisited.length > 0) {
            let nearestIdx = -1;
            let minDist = Infinity;
            for (let i = 0; i < unvisited.length; i++) {
                let d = dist(current[current.length - 1], unvisited[i]);
                if (d < minDist) {
                    minDist = d;
                    nearestIdx = i;
                }
            }
            current.push(unvisited.splice(nearestIdx, 1)[0]);
        }
        
        let currentDist = calcPathDistance(current);
        bestPath = [...current];
        bestDistance = currentDist;
        graphData.push({ iteration: 0, distance: bestDistance });
        
        let improved = true;
        
        while (improved) {
            improved = false;
            
            for (let i = 0; i < current.length - 1; i++) {
                for (let j = i + 1; j < current.length; j++) {
                    let newPath = [...current];
                    let left = i;
                    let right = j;
                    while (left < right) {
                        [newPath[left], newPath[right]] = [newPath[right], newPath[left]];
                        left++;
                        right--;
                    }
                    
                    let newDist = calcPathDistance(newPath);
                    currentPath = newPath;
                    iterations++;
                    yield; // Show consideration of swap
                    
                    if (newDist < currentDist) {
                        current = newPath;
                        currentDist = newDist;
                        bestPath = [...current];
                        bestDistance = currentDist;
                        graphData.push({ iteration: iterations, distance: bestDistance });
                        improved = true;
                    }
                }
            }
        }
        currentPath = [];
    }

    // Render Canvas
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw best path (green)
        if (bestPath.length > 1) {
            ctx.beginPath();
            ctx.moveTo(bestPath[0].x, bestPath[0].y);
            for(let i=1; i<bestPath.length; i++) {
                ctx.lineTo(bestPath[i].x, bestPath[i].y);
            }
            ctx.closePath();
            ctx.strokeStyle = '#10b981'; 
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        // Draw currently evaluating path (orange/yellow)
        if (currentPath.length > 1 && document.getElementById('toggle-animation').checked) {
            ctx.beginPath();
            ctx.moveTo(currentPath[0].x, currentPath[0].y);
            for(let i=1; i<currentPath.length; i++) {
                ctx.lineTo(currentPath[i].x, currentPath[i].y);
            }
            if (currentPath.length === cities.length) {
                ctx.closePath();
            }
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Draw cities (white dots)
        for (let i=0; i<cities.length; i++) {
            ctx.beginPath();
            ctx.arc(cities[i].x, cities[i].y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#f8fafc';
            ctx.fill();
            
            // Highlight starting city if applicable
            if(i === 0 && bestPath.length > 0 && cities[0] === bestPath[0]) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    // Render Convergence Graph
    function drawGraph() {
        graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
        if(graphData.length < 1) return;
        
        // Draw axes
        graphCtx.strokeStyle = '#64748b';
        graphCtx.lineWidth = 1;
        graphCtx.beginPath();
        graphCtx.moveTo(25, 10);
        graphCtx.lineTo(25, graphCanvas.height - 20);
        graphCtx.lineTo(graphCanvas.width - 10, graphCanvas.height - 20);
        graphCtx.stroke();
        
        let maxDist = Math.max(...graphData.map(d => d.distance));
        let minDist = Math.min(...graphData.map(d => d.distance));
        
        // Dynamic padding for Y axis
        let padding = (maxDist - minDist) * 0.1;
        if (padding === 0) padding = 10;
        maxDist += padding;
        minDist = Math.max(0, minDist - padding);
        
        let maxIter = Math.max(iterations, graphData[graphData.length-1].iteration);
        if (maxIter === 0) maxIter = 1;
        
        // Plot graph lines
        graphCtx.beginPath();
        for(let i=0; i<graphData.length; i++) {
            let x = 25 + (graphData[i].iteration / maxIter) * (graphCanvas.width - 35);
            let y = graphCanvas.height - 20 - ((graphData[i].distance - minDist) / (maxDist - minDist)) * (graphCanvas.height - 30);
            if(i===0) graphCtx.moveTo(x, y);
            else graphCtx.lineTo(x, y);
        }
        
        // Connect to current iteration
        let lastY = graphCanvas.height - 20 - ((graphData[graphData.length-1].distance - minDist) / (maxDist - minDist)) * (graphCanvas.height - 30);
        let currentX = 25 + (iterations / maxIter) * (graphCanvas.width - 35);
        graphCtx.lineTo(currentX, lastY);
        
        graphCtx.strokeStyle = '#3b82f6';
        graphCtx.lineWidth = 2;
        graphCtx.stroke();

        // Draw min/max text
        graphCtx.fillStyle = '#94a3b8';
        graphCtx.font = '10px sans-serif';
        graphCtx.fillText(Math.round(maxDist), 2, 15);
        graphCtx.fillText(Math.round(minDist), 2, graphCanvas.height - 22);
    }

    // Main Simulation Loop
    function loop() {
        if (isRunning && !isPaused && generator) {
            let speed = parseInt(document.getElementById('speed-slider').value);
            let showAnimation = document.getElementById('toggle-animation').checked;
            
            if (!showAnimation) {
                // Run computation as fast as possible within a 15ms timebox to avoid freezing UI
                let start = performance.now();
                while(performance.now() - start < 15) { 
                    let result = generator.next();
                    if (result.done) {
                        finishSimulation();
                        break;
                    }
                }
            } else {
                let stepsPerFrame = 1;
                let frameDelay = 0;
                
                // Map slider (1-100) to steps or delay
                if (speed < 50) {
                    frameDelay = Math.floor((50 - speed) / 2);
                } else {
                    stepsPerFrame = Math.floor(Math.pow(5000, (speed - 50) / 50));
                }
                
                if (frameDelay > 0) {
                    if (frameCount % frameDelay === 0) {
                        let result = generator.next();
                        if (result.done) finishSimulation();
                    }
                } else {
                    for (let i = 0; i < stepsPerFrame; i++) {
                        let result = generator.next();
                        if (result.done) {
                            finishSimulation();
                            break;
                        }
                    }
                }
            }
            updateStats();
        }
        
        draw();
        drawGraph();
        frameCount++;
        requestAnimationFrame(loop);
    }

    // UI Feedback Updates
    function updateStats() {
        if (isRunning && !isPaused) {
            timeTaken = performance.now() - startTime;
        }
        document.getElementById('stat-best-distance').innerText = bestDistance === Infinity ? '0.00' : bestDistance.toFixed(2);
        let currD = calcPathDistance(currentPath);
        document.getElementById('stat-current-distance').innerText = currentPath.length > 0 ? currD.toFixed(2) : '0.00';
        document.getElementById('stat-iterations').innerText = iterations;
        document.getElementById('stat-time').innerText = Math.floor(timeTaken) + ' ms';
    }

    function resetSimulation() {
        isRunning = false;
        isPaused = false;
        generator = null;
        bestPath = [];
        bestDistance = Infinity;
        currentPath = [];
        iterations = 0;
        timeTaken = 0;
        graphData = [];
        
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-pause').disabled = true;
        document.getElementById('btn-reset').disabled = true;
        
        document.getElementById('btn-generate').disabled = false;
        document.getElementById('btn-clear').disabled = false;
        document.getElementById('file-import').disabled = false;
        document.getElementById('btn-import').disabled = false;
        
        updateStats();
    }

    function finishSimulation() {
        isRunning = false;
        isPaused = false;
        currentPath = [];
        
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-pause').disabled = true;
        
        document.getElementById('btn-generate').disabled = false;
        document.getElementById('btn-clear').disabled = false;
        document.getElementById('file-import').disabled = false;
        document.getElementById('btn-import').disabled = false;
        
        updateStats();
    }

    // Interactivity: Drag & Drop, Adding, Deleting Cities
    let draggingCity = null;

    canvas.addEventListener('mousedown', e => {
        if (isRunning) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Right click to delete
        if (e.button === 2) {
            cities = cities.filter(c => dist(c, {x, y}) > 10);
            resetSimulation();
            return;
        }
        
        draggingCity = cities.find(c => dist(c, {x, y}) < 10);
        
        // Left click to add new
        if (!draggingCity && e.button === 0) {
            cities.push({x, y});
            resetSimulation();
        }
    });

    canvas.addEventListener('mousemove', e => {
        if (draggingCity && !isRunning) {
            const rect = canvas.getBoundingClientRect();
            draggingCity.x = e.clientX - rect.left;
            draggingCity.y = e.clientY - rect.top;
            resetSimulation();
        }
    });

    canvas.addEventListener('mouseup', () => {
        draggingCity = null;
    });

    canvas.addEventListener('contextmenu', e => e.preventDefault());

    // Button Listeners
    document.getElementById('btn-generate').addEventListener('click', () => {
        let count = parseInt(document.getElementById('random-count').value);
        if(isNaN(count) || count < 3) count = 3;
        cities = [];
        const padding = 30;
        for(let i=0; i<count; i++) {
            cities.push({
                x: padding + Math.random() * (canvas.width - padding*2),
                y: padding + Math.random() * (canvas.height - padding*2)
            });
        }
        resetSimulation();
    });

    document.getElementById('btn-start').addEventListener('click', () => {
        if (cities.length < 2) return;
        
        if (!isRunning) {
            isRunning = true;
            isPaused = false;
            
            if (iterations === 0) {
                startTime = performance.now();
                let algo = document.getElementById('algo-select').value;
                if (algo === 'nearest-neighbor') generator = nearestNeighborAlgo();
                else if (algo === 'two-opt') generator = twoOptAlgo();
                else if (algo === 'simulated-annealing') generator = simulatedAnnealingAlgo();
                else if (algo === 'brute-force') generator = bruteForceAlgo();
            } else {
                startTime = performance.now() - timeTaken; // adjust for resume
            }
            
            document.getElementById('btn-start').disabled = true;
            document.getElementById('btn-pause').disabled = false;
            document.getElementById('btn-reset').disabled = false;
            
            document.getElementById('btn-generate').disabled = true;
            document.getElementById('btn-clear').disabled = true;
            document.getElementById('file-import').disabled = true;
            document.getElementById('btn-import').disabled = true;
        }
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
        isPaused = true;
        isRunning = false;
        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-pause').disabled = true;
    });

    document.getElementById('btn-reset').addEventListener('click', resetSimulation);

    document.getElementById('btn-clear').addEventListener('click', () => {
        cities = [];
        resetSimulation();
    });

    // Import/Export Listeners
    document.getElementById('btn-export').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cities));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = "tsp_cities.json";
        document.body.appendChild(a); 
        a.click();
        a.remove();
    });

    document.getElementById('btn-import').addEventListener('click', () => {
        document.getElementById('file-import').click();
    });

    document.getElementById('file-import').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const contents = JSON.parse(evt.target.result);
                if (Array.isArray(contents) && contents.every(c => c.x !== undefined && c.y !== undefined)) {
                    cities = contents;
                    resetSimulation();
                } else {
                    alert("Invalid JSON format. Expected an array of {x, y} objects.");
                }
            } catch(err) {
                alert("Error parsing JSON.");
            }
            // Reset the input so the same file can be loaded again if needed
            e.target.value = '';
        };
        reader.readAsText(file);
    });

    // Initialize
    document.getElementById('btn-generate').click(); // Generate initial random cities
    requestAnimationFrame(loop); // Start animation loop
});
