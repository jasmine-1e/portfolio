import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const titleElement = document.querySelector('.projects-title');

if (titleElement && projects) {
  titleElement.textContent = `${projects.length} Projects`;
}
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let selectedIndex = -1; 
let selectedYear = null;

function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year  }; // TODO
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  // TODO: clear up paths and legends
  let newSVG = d3.select('svg');
  newSVG.selectAll('*').remove();
  let legend = d3.select('.legend');
  legend.selectAll('*').remove(); 

  newArcs.forEach((arc, i) => {
    newSVG
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .attr('class', (d, idx) => (newData[idx].label === selectedYear ? 'selected' : ''))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;
      selectedYear = selectedIndex === -1 ? null : newData[i].label;

      newSVG.selectAll('path')
        .attr('class', (_, idx) => (newData[idx].label === selectedYear ? 'selected' : ''));
      legend.selectAll('li')
        .attr('class', (_, idx) => (newData[idx].label === selectedYear ? 'selected' : ''));

        let filteredProjects = projects.filter((project) => {
          let values = Object.values(project).join('\n').toLowerCase();
          let matchesYear = selectedYear ? project.year === selectedYear : true;
          return values.includes(query.toLowerCase()) && matchesYear;
        });

      
        if (selectedIndex !== -1) {
        let selectedYear = newData[selectedIndex].label;
        filteredProjects = filteredProjects.filter((p) => p.year === selectedYear);
} 
        renderProjects(filteredProjects, projectsContainer, 'h2');

      //else {
       // let selectedYear = newData[selectedIndex].label;
      ///  let filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
     //   if (selectedIndex !== -1) {
      //    let selectedYear = newData[selectedIndex].label;
       //   filteredProjects = filteredProjects.filter((p) => p.year === selectedYear); }
       // renderProjects(filteredProjects, projectsContainer, 'h2');
   // }
        });
});

  newData.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`) 
      .attr('class', (d, idx) => (newData[idx].label === selectedYear ? 'selected' : ''))
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
     ; }
renderPieChart(projects);


let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  if (query === '') {
    selectedIndex = -1;
    selectedYear = null;
  }
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    let matchesYear = selectedYear ? project.year === selectedYear : true;
          return values.includes(query.toLowerCase()) && matchesYear;
  });
  renderPieChart(filteredProjects);

   //if (selectedIndex !== -1) {
    //let selectedYear = Data[selectedIndex].label;
    //filteredProjects = filteredProjects.filter((p) => p.year === selectedYear);
  //}
  if (selectedIndex !== -1) {
    let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);
    let currentData = rolledData.map(([year, count]) => ({ value: count, label: year }));
    
    if (currentData[selectedIndex]) {
      let selectedYear = currentData[selectedIndex].label;
      filteredProjects = filteredProjects.filter((p) => p.year === selectedYear);
    }
  }

  renderProjects(filteredProjects, projectsContainer, 'h2');
});


