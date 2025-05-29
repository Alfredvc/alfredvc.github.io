import {rawNetworkData as data} from './network.js';

let networkData;
async function loadNetworkData() {
  // const response = await fetch('/data/network.json');
  // const data = await response.json();


  // Count links for each node
  const linkCounts = {};
  data.nodes.forEach(node => linkCounts[node.id] = 0);
  data.edges.forEach(edge => {
    if (linkCounts[edge.source] !== undefined) linkCounts[edge.source]++;
    if (linkCounts[edge.target] !== undefined) linkCounts[edge.target]++;
  });

  data.nodes.forEach(node => {
    node.weight = 1; // Default weight
  });

  data.nodes.filter(node => node.type === 'language' || node.type === 'technology').forEach(node => {
    node.weight = linkCounts[node.id];
  });
  data.nodes.filter(node => node.type === 'job' || node.type === 'project').forEach(node => {
    if (typeof node.start_year === 'number') {
      if (typeof node.end_year === 'number') {
        node.weight += Math.max(node.end_year - node.start_year, 1);
      } else {
        node.weight += 2025 - node.start_year;
      }
    }
  });

  networkData = { nodes: data.nodes, links: data.edges };

}

// Graph configuration
const config = {
  width: 800,
  height: 600,
  nodeColors: {
    job: '#ef4444',
    project: '#f59e0b',
    language: '#8b5cf6',
    technology: '#06b6d4',
    article: '#059669'
  },
  themes: {
    default: {
      background: '#ffffff',
      nodeStroke: '#ffffff',
      linkColor: '#cbd5e1',
      linkColorHighlight: '#64748b', // darker color for highlighted links
      linkColorInactive: '#e5e7eb', // faded color for non-active links
      textColor: '#333333'
    },
  },
  // Responsive breakpoints and scaling factors
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  responsive: {
    mobile: {
      nodeScale: 1,
      linkStrength: 2,
      manyBodyStrength: -600,
      textScale: 0.8,
      rowSpacing: 60,
      colSpacing: 120
    },
    tablet: {
      nodeScale: 1.5,
      linkStrength: 1.2,
      manyBodyStrength: -800,
      textScale: 0.9,
      rowSpacing: 70,
      colSpacing: 150
    },
    desktop: {
      nodeScale: 2,
      linkStrength: 1,
      manyBodyStrength: -1200,
      textScale: 1,
      rowSpacing: 80,
      colSpacing: 180
    }
  }
};

// Device detection and responsive settings
function getDeviceType() {
  const width = window.innerWidth;
  if (width <= config.breakpoints.mobile) return 'mobile';
  if (width <= config.breakpoints.tablet) return 'tablet';
  return 'desktop';
}

function getResponsiveSettings() {
  return config.responsive[getDeviceType()];
}

let currentTheme = 'default';
let simulation;
let svg;
let g;
let link;
let node;
let nodeScale = 2;
let linkStrength = 1;
let linkExplodingStrength = 0.2;
let manyBodyStrength = -1200;
let manyBodyExplodingStrength = -1600;
let isDragging = false;
let exploding = false;

// Initialize the graph
function initGraph() {
  // Clear any existing graph
  d3.select('#graph-canvas').selectAll('*').remove();
  const startWidth = document.getElementById('graph-canvas').offsetWidth;
  const startHeight = document.getElementById('graph-canvas').offsetHeight;
  config.width = startWidth;
  config.height = startHeight;

  // Get responsive settings
  const responsiveSettings = getResponsiveSettings();
  
  // Update global variables based on device type
  nodeScale = responsiveSettings.nodeScale;
  linkStrength = responsiveSettings.linkStrength;
  manyBodyStrength = responsiveSettings.manyBodyStrength;
  rowSpacing = responsiveSettings.rowSpacing;
  colSpacing = responsiveSettings.colSpacing;

  // Create SVG
  svg = d3.select('#graph-canvas')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${config.width} ${config.height}`)
    .style('background', config.themes[currentTheme].background);

  g = svg.append('g'); // Create main group for zoom/pan BEFORE zoom setup

  // Add zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', handleZoom);

  svg.call(zoom);

  // Set initial zoom transform to be more zoomed out
  svg.call(zoom.transform, d3.zoomIdentity.scale(0.8).translate(config.width * 0.15, config.height * 0.15));

  // Set initial node positions to center
  networkData.nodes.forEach(node => {
    node.x = (config.width / 2) + (Math.random() - 0.5) * config.width * 0.2; // Randomize initial position
    node.y = (config.height / 2) + (Math.random() - 0.5) * config.height * 0.2; // Randomize initial position
  });

  // Create links
  link = g.append('g')
    .attr('class', 'links')
    .selectAll('path')
    .data(networkData.links)
    .enter().append('path')
    .attr('stroke', config.themes[currentTheme].linkColor)
    .attr('stroke-opacity', 0.9)
    .attr('stroke-width', 3)
    .attr('fill', 'none');

  // Create nodes
  node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(networkData.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded))
    .on('click', handleNodeClick)
    .on('mouseover', handleNodeHover)
    .on('mouseout', handleNodeOut);

  // Add circles to nodes
  node.append('circle')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => config.nodeColors[d.type])
    .attr('stroke', config.themes[currentTheme].nodeStroke)
    .attr('stroke-width', 2);

  // Add labels to nodes
  node.append('text')
    .attr('dx', d => getNodeRadius(d) + 8) // Always outside the node
    .attr('dy', 4)
    .style('font-size', `${16 * responsiveSettings.textScale}px`)
    .style('font-weight', '600')
    .style('fill', config.themes[currentTheme].textColor)
    .style('stroke', '#fff')
    .style('stroke-width', 3)
    .style('paint-order', 'stroke')
    .style('stroke-linejoin', 'round')
    .text(d => d.label);

  // Create simulation
  simulation = d3.forceSimulation(networkData.nodes)
    .force('link', d3.forceLink(networkData.links).id(d => d.id).strength(linkStrength))
    .force('charge', d3.forceManyBody().strength(manyBodyStrength))
    .force('collide', d3.forceCollide().radius(d => getNodeRadius(d) + 10).strength(1))
    .force("x", d3.forceX(config.width / 2))
    .force("y", d3.forceY(config.height / 2))
    .force('boundary', function(alpha) {
      // Exponential boundary force to keep nodes within canvas
      const boundaryStrength = 0.1;
      const edgeDistance = 50; // Distance from edge where force starts
      
      for (let i = 0, n = networkData.nodes.length; i < n; ++i) {
        const node = networkData.nodes[i];
        const nodeRadius = getNodeRadius(node);
        
        // Left boundary
        if (node.x < edgeDistance + nodeRadius) {
          const distance = Math.max(1, node.x - nodeRadius);
          const force = boundaryStrength * Math.exp(-distance / 20) * alpha;
          node.vx += force;
        }
        
        // Right boundary
        if (node.x > config.width - edgeDistance - nodeRadius) {
          const distance = Math.max(1, config.width - node.x - nodeRadius);
          const force = boundaryStrength * Math.exp(-distance / 20) * alpha;
          node.vx -= force;
        }
        
        // Top boundary
        if (node.y < edgeDistance + nodeRadius) {
          const distance = Math.max(1, node.y - nodeRadius);
          const force = boundaryStrength * Math.exp(-distance / 20) * alpha;
          node.vy += force;
        }
        
        // Bottom boundary
        if (node.y > config.height - edgeDistance - nodeRadius) {
          const distance = Math.max(1, config.height - node.y - nodeRadius);
          const force = boundaryStrength * Math.exp(-distance / 20) * alpha;
          node.vy -= force;
        }
      }
    });

  simulation.on('tick', ticked);

}

function ticked() {
  link
    .attr('d', d => {
      // Use quadratic Bezier curve for curved links
      const sx = d.source.x;
      const sy = d.source.y;
      const tx = d.target.x;
      const ty = d.target.y;
      // Calculate control point for curve (midpoint offset perpendicular)
      const dx = tx - sx;
      const dy = ty - sy;
      const dr = Math.sqrt(dx * dx + dy * dy);
      // Perpendicular offset for curve
      const curveOffset = 60; // Adjust for more/less curve
      const mx = (sx + tx) / 2;
      const my = (sy + ty) / 2;
      const nx = my - sy;
      const ny = sx - mx;
      const cx = mx + (curveOffset * nx) / dr;
      const cy = my + (curveOffset * ny) / dr;
      return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
    });

  node
    .attr('transform', d => `translate(${d.x},${d.y})`);
}

function handleZoom(event) {
  g.attr('transform', event.transform);
}

function dragStarted(event, d) {
  if (currentStaticType !== null) {
    return
  }
  isDragging = true;
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  if (currentStaticType !== null) {
    return
  }
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnded(event, d) {
  if (currentStaticType !== null) {
    return
  }
  isDragging = false;
  if (!event.active) simulation.alphaTarget(0);
  // Only release node if it's not supposed to be static
  if (!currentStaticType || d.type !== currentStaticType) {
    d.fx = null;
    d.fy = null;
  }
}

function handleNodeClick(event, d) {
}

// Utility: Set node/link opacity based on a set of active node IDs
function setNodeLinkOpacity(activeNodeIds, highlightLinks = false) {
  node.selectAll('circle')
    .style('opacity', n => activeNodeIds.has(n.id) ? 1 : 0.2);
  node.selectAll('text')
    .style('opacity', n => activeNodeIds.has(n.id) ? 1 : 0.2);
  link
    .style('stroke', l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      if (activeNodeIds.has(sourceId) && activeNodeIds.has(targetId)) {
        return highlightLinks ? config.themes[currentTheme].linkColorHighlight : config.themes[currentTheme].linkColor;
      }
      return config.themes[currentTheme].linkColorInactive;
    })
    .style('opacity', l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      if (activeNodeIds.has(sourceId) && activeNodeIds.has(targetId)) {
        return 1;
      }
      return 0.2;
    });
}

function handleNodeHover(event, d) {
  if (isDragging) return;
  if (currentStaticType !== null && d.type !== currentStaticType) {
    return
  }
  d3.select(this).select('circle')
    .transition()
    .duration(150)
    .attr('r', getNodeRadius(d) * 1.2);

  const highlightHops = d.type === 'job' || d.type === 'langauge'  ? 2 : 1; // Highlight more hops for jobs
  // Highlight up to N hops
  const connectedNodes = new Set();
  connectedNodes.add(d.id);
  for (let hop = 0; hop < highlightHops; hop++) {
    const newNodes = new Set();
    networkData.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : l.target;     if (connectedNodes.has(sourceId) && !connectedNodes.has(targetId)) {
        newNodes.add(targetId);
      }
      if (connectedNodes.has(targetId) && !connectedNodes.has(sourceId)) {
        newNodes.add(sourceId);
      }
    });
    newNodes.forEach(n => connectedNodes.add(n));
  }

  if (currentStaticType !== null) {
    exploding = true;
    simulation.force('link').strength(linkExplodingStrength);
    simulation.force('charge').strength(manyBodyExplodingStrength);
    simulation.nodes(networkData.nodes.filter(n => connectedNodes.has(n.id)))
    simulation.alpha(0.3).restart();
  }

  setNodeLinkOpacity(connectedNodes, true);
}

function handleNodeOut(event, d) {
  if (currentStaticType !== null && d.type !== currentStaticType) {
    return
  }
  exploding = false;
  simulation.force('link').strength(linkStrength);
  simulation.force('charge').strength(manyBodyStrength);
  if (currentStaticType !== null) {
    simulation.nodes(networkData.nodes); // Reset to all nodes
    simulation.alpha(0.7).restart();
  }
  if (isDragging) return;
  d3.select(this).select('circle')
    .transition()
    .duration(150)
    .attr('r', getNodeRadius(d));
  filterNodes();
}

// Utility function to get node radius
function getNodeRadius(d) {
  const responsiveSettings = getResponsiveSettings();
  return Math.sqrt(d.weight) * 8 * responsiveSettings.nodeScale;
}

// Control functions
function filterNodes() {
  // Get checked types
  const allChecked = document.getElementById('all-nodes-checkbox').checked;
  let activeTypes = new Set();
  if (allChecked) {
    activeTypes = new Set(['job', 'project', 'technology', 'language', 'article']);
  } else {
    // Use radio buttons for type selection
    document.querySelectorAll('.type-radio').forEach(rb => {
      if (rb.checked) activeTypes.add(rb.value);
    });
  }
  // Determine which nodes are active
  const activeNodeIds = new Set();
  networkData.nodes.forEach(d => {
    if (activeTypes.has(d.type)) activeNodeIds.add(d.id);
  });
  setNodeLinkOpacity(activeNodeIds);
}

function resetView() {
  if (svg) {
    svg.transition()
      .duration(750)
      .call(
        d3.zoom().transform,
        d3.zoomIdentity
      );
  }

  // Reset node highlighting
  node.selectAll('circle').style('opacity', 1);
  link.style('opacity', 0.6);
}

let currentStaticType = null; // Track which type is currently static

// Configurable orientation for alignment: 'row' or 'column'
let alignOrientation = 'row'; // Change to 'column' for vertical arrangement
let rowSpacing = 80; // Spacing between rows (vertical distance)
let colSpacing = 180; // Spacing between columns (horizontal distance, more for labels)

function alignNodesOfType(type) {
  if (!networkData) return;
  // Sort nodes of the given type by weight descending
  const nodes = networkData.nodes.filter(n => n.type === type).sort((a, b) => b.weight - a.weight);
  if (nodes.length === 0) return;
  const total = nodes.length;
  const width = config.width;
  const height = config.height;

  // Use mainSpacing for wrapping, crossSpacing for the other axis
  let mainSpacing, crossSpacing, mainSize, crossSize;
  if (alignOrientation === 'row') {
    mainSpacing = colSpacing;
    crossSpacing = rowSpacing;
    mainSize = width;
    crossSize = height;
  } else {
    mainSpacing = rowSpacing;
    crossSpacing = colSpacing;
    mainSize = height;
    crossSize = width;
  }

  // Dynamically calculate maxRowColCount based on available crossSize and crossSpacing
  const maxRowColCount = Math.max(1, Math.floor(crossSize / crossSpacing));

  // Calculate how many per main line (row or column) based on mainSpacing and maxRowColCount
  let perLine = Math.floor(mainSize / mainSpacing);
  perLine = Math.max(1, Math.min(perLine, Math.ceil(total / maxRowColCount)));
  const lines = Math.ceil(total / perLine);

  // Centering offsets
  const totalMainUsed = perLine * mainSpacing;
  const totalCrossUsed = lines * crossSpacing;
  const offsetMain = (mainSize - totalMainUsed) / 2 + mainSpacing / 2;
  const offsetCross = (crossSize - totalCrossUsed) / 2 + crossSpacing / 2;

  let idx = 0;
  networkData.nodes.forEach(n => {
    if (n.type === type) {
      const node = nodes[idx]; // Use sorted node order
      const line = Math.floor(idx / perLine);
      const posInLine = idx % perLine;
      if (alignOrientation === 'row') {
        node.fx = offsetMain + posInLine * mainSpacing;
        node.fy = offsetCross + line * crossSpacing;
      } else {
        node.fx = offsetCross + line * crossSpacing;
        node.fy = offsetMain + posInLine * mainSpacing;
      }
      idx++;
    } else {
      n.fx = null;
      n.fy = null;
    }
  });
  if (simulation) simulation.alpha(0.7).restart();
}

function releaseAllNodes() {
  if (!networkData) return;
  networkData.nodes.forEach(n => {
    n.fx = null;
    n.fy = null;
  });
  if (simulation) simulation.alpha(0.7).restart();
}

// Event listeners

document.addEventListener('DOMContentLoaded', async function () {
  await loadNetworkData();
  initGraph();

  // Checkbox filtering logic
  const allNodesCheckbox = document.getElementById('all-nodes-checkbox');
  const typeRadios = document.querySelectorAll('.type-radio');
  const typeCheckboxesContainer = document.getElementById('type-checkboxes');
  const chevron = document.getElementById('all-nodes-chevron');

  function updateChevron(closed) {
    if (closed) {
      chevron.classList.remove('open');
    } else {
      chevron.classList.add('open');
    }
  }

  function updateTypeCheckboxesVisibility() {
    updateChevron(allNodesCheckbox.checked);
    if (allNodesCheckbox.checked) {
      typeCheckboxesContainer.style.maxHeight = '0';
      // Set first radio as checked by default (for reset)
      typeRadios.forEach((rb, i) => { rb.checked = i === 0; });
      filterNodes();
      // Release all nodes if all-nodes is checked
      currentStaticType = null;
      releaseAllNodes();
    } else {
      // Set 'job' as the default checked radio button
      let jobRadio = Array.from(typeRadios).find(rb => rb.value === 'job');
      if (jobRadio) jobRadio.checked = true;
      // Uncheck all others
      typeRadios.forEach(rb => { if (rb.value !== 'job') rb.checked = false; });
      typeCheckboxesContainer.style.maxHeight = '500px';
      // Run all logic for selection of radio-buttons
      filterNodes();
      currentStaticType = 'job';
      alignNodesOfType('job');
      // Do NOT call releaseAllNodes() here, so jobs remain centered/static
    }
  }

  allNodesCheckbox.addEventListener('change', updateTypeCheckboxesVisibility);
  typeRadios.forEach(rb => {
    rb.addEventListener('change', function () {
      filterNodes();
      if (allNodesCheckbox.checked) return;
      if (rb.checked) {
        currentStaticType = rb.value;
        alignNodesOfType(rb.value);
      }
    });
  });

  // Initial filter
  filterNodes();

  // Handle window resize
  window.addEventListener('resize', () => {
    const container = document.getElementById('graph-canvas');
    const rect = container.getBoundingClientRect();
    const oldDeviceType = getDeviceType();
    config.width = rect.width;
    config.height = rect.height;
    
    // Check if device type changed (mobile/tablet/desktop)
    const newDeviceType = getDeviceType();
    if (oldDeviceType !== newDeviceType) {
      // Reinitialize graph with new responsive settings
      initGraph();
      // Restore current state
      if (currentStaticType) {
        alignNodesOfType(currentStaticType);
      }
      filterNodes();
    } else {
      // Just update canvas dimensions for same device type
      svg.attr('viewBox', `0 0 ${config.width} ${config.height}`);
    }
  });
});