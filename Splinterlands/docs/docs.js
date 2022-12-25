console.log(`Welcome to the docs.js file.`)

/** General Utils **/
const el = id => document.getElementById(id);

let documentation_div = document.getElementById(`documentation_div`)
let navigation_div = document.getElementById(`navigation_div`)
let categories = Object.keys(documentation)
let nav_links_array = []

categories.forEach((category) => {
    generate_available_documentation(documentation[category])
})
header_scroll_listener();

function generate_available_documentation(category) {
    let length = category.length;
    category.forEach((api_doc, index) => {
        documentation_div.appendChild(create_documentation_div(api_doc))
        navigation_div.appendChild(create_navigation_link(api_doc))
        if (index !== length - 1) documentation_div.appendChild(document.createElement(`hr`))
    })
}

function create_documentation_div(data) {
    // Create Divs
    let container_outer = document.createElement('div')
    let container_inner = document.createElement('div')
    let header = document.createElement('h2')
    let end_point_div = document.createElement('div')
    let end_point_url = document.createElement('p')
    let end_point_description = document.createElement('p')
    let parameters_table = document.createElement('table')
    let response_example_div = document.createElement('div')

    container_outer.setAttribute(`id`, data.id)

    // Apply Class lists
    container_outer.classList.add("w3-card", `w3-theme-d5`, `w3-padding-small`)
    container_inner.classList.add(`w3-card`, `w3-padding-small`)
    end_point_div.classList.add(`w3-panel`, `w3-leftbar`, `w3-theme-l1`, `w3-serif-10`, `w3-round`, `w3-padding`)
    parameters_table.classList.add(`w3-table`)
    response_example_div.classList.add(`w3-panel`, `w3-leftbar`, `w3-theme-l5`, `w3-serif`, `w3-round`, `w3-padding`)

    // Apply Style
    end_point_url.style.fontStyle = `italics`
    end_point_url.style.fontWeight = `bold`
    end_point_description.style.fontWeight = `bold`

    // Add content
    header.innerText = data.name;
    end_point_url.innerHTML = `⧉ <a href="${data.link}" target="_blank">${data.link_text}</a>`
    end_point_description.innerText = data.description

    if (data.parameters.length > 0) {
        let header_row = parameters_table.insertRow(0);
        header_row.innerHTML = `<th>parameter</th><th>sample</th><th>required</th>`

        data.parameters.forEach((param) => {
            let row = parameters_table.insertRow(-1)
            row.innerHTML = `<td>${param[0]}</td><td>${param[1]}</td><td>${param[2]}</td>`
        })
    }

    response_example_div.innerHTML = `<pre>${data.formatted_output}</pre>`

    // Join Divs
    container_outer.appendChild(container_inner)
    container_inner.appendChild(header)
    container_inner.appendChild(end_point_div)
    end_point_div.appendChild(end_point_url)
    end_point_div.appendChild(end_point_description)
    container_inner.appendChild(parameters_table)
    container_inner.appendChild(response_example_div)

    return container_outer
}

function create_navigation_link(api_doc) {
    let link = document.createElement('a')
    link.setAttribute(`id`, `${api_doc.id}-a`)

    link.classList.add(`w3-bar-item`, `w3-button`, `w3-border-bottom`, `w3-light-grey`, `w3-hover-light-blue`, `w3-rounded`)
    link.setAttribute(`href`, `#${api_doc.id}`);
    link.innerText = api_doc.name
    nav_links_array.push(api_doc.id)

    return link
}

/** Make navigation bar highlight section when user scrolls past heading **/
// Navigation Dynamic a.current. Source: https://www.youtube.com/watch?v=ytNCJc6atVs&ab_channel=RMITWebProgramming
function header_scroll_listener() {
    window.onscroll = () => {
        nav_links_array.forEach((nav, i) => {
            if (!nav) return;
            let section = el(nav)

            let pix = {
                top: section.offsetTop,
                height: section.offsetHeight
            }
            pix.current = (window.scrollY > pix.top - 235) && window.scrollY < (pix.top - 200 + pix.height)

            if (pix.current) {
                el(`${nav}-a`).classList.add(`w3-grey`)
                el(`${nav}-a`).classList.remove(`w3-light-grey`)
            } else {
                el(`${nav}-a`).classList.remove(`w3-grey`)
                el(`${nav}-a`).classList.add(`w3-light-grey`)
            }
        })
    }
}