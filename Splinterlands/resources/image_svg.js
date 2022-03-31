/** Symbols (C) Splinterlands **/

// Customised Edition Symbols
let random = `a`;
let coloured_edition_svgs = function (color, width, height) {
  let size = `width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"`
  random += `a`;
  return {
    alpha: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.53 31.79" ${size}><defs><style>.${color}${random}A{fill:${color};}</style></defs><title>Alpha</title><polygon class="${color}${random}A" points="10.77 0 0 31.79 7.76 31.79 10.77 22.92 13.77 31.79 21.53 31.79 10.77 0"/></svg>`,
    beta: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.03 31.79" ${size}><defs><style>.${color}${random}B{fill:${color};}</style></defs><title>Beta</title><polygon class="${color}${random}B" points="6.25 13.43 14.75 8.52 0 0 0 5.96 4.43 8.52 0 11.07 0 15.78 8.7 20.8 0 25.83 0 31.79 19.03 20.8 6.25 13.43"/></svg>`,
    promo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.03 31.71" ${size}><defs><style>.${color}${random}P{fill:${color};}</style></defs><title>Promo</title><polygon class="${color}${random}P" points="19.03 11.19 0 0 0 6.28 8.5 11.19 0 16.1 0 16.7 0 22.38 0 31.7 6 31.7 6 18.85 19.03 11.19"/></svg>`,
    reward: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.37 31.71" ${size}><defs><style>.${color}${random}R{fill:${color};}</style></defs><title>Reward</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon class="${color}${random}R" points="20.37 31.7 11.19 15.8 19.03 11.19 0 0 0 6.28 8.5 11.19 0 16.1 0 16.7 0 22.38 0 31.7 6 31.7 6 18.85 6.02 18.84 13.44 31.7 20.37 31.7"/></g></g></svg>`,
    dice: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32.08"  ${size}><defs><style>.${color}${random}D{fill:${color};}.cls-2{fill:none;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon class="${color}${random}D" points="7.98 32.08 7.98 23.39 15.33 16.04 7.98 8.69 7.98 0 24.02 16.04 8.02 32.04 7.98 32.08"/><rect class="cls-2" y="0.04" width="32" height="32"/></g></g></svg>`,
    gladius: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 90 180" ${size}><defs><style>.${color}${random}G{fill:${color};}.${color}${random}G2{clip-path:url(#clip-path);}.${color}${random}G3{fill:${color};}</style><clipPath id="clip-path" transform="translate(-55.83 -10.83)"><rect class="${color}${random}G" width="201.66" height="201.66"/></clipPath></defs><title>Gladius</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g class="${color}${random}G2"><polygon class="${color}${random}G3" points="33.77 33.77 90 33.77 90 0 33.77 0 0 0 0 33.77 0 146.23 0 180 33.77 180 56.23 180 90 180 90 146.23 90 90 56.23 90 56.23 146.23 33.77 146.23 33.77 33.77"/></g></g></g></svg>`,
    untamed: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" ${size}><defs><style>.${color}${random}U{fill:${color};</style></defs><title>Untamed</title><polygon class="${color}${random}U" points="28.14 4.89 28.14 37.57 21.86 37.57 21.86 4.89 14.32 4.89 14.32 37.57 14.32 45.11 21.86 45.11 28.14 45.11 35.68 45.11 35.68 37.57 35.68 4.89 28.14 4.89"/></svg>`,
    chaos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187.8 181.96" ${size}><defs><style>.${color}${random}CL{fill:${color};}</style></defs><title>Chaos Legion</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="${color}${random}CL" d="M133.63,45.36,93.9,79.22,54.18,45.36,0,91.53l54.18,46.18L93.9,103.85l39.73,33.86L187.8,91.53ZM79.7,91.74,54.18,113.49l-25.77-22,25.77-22L79.7,91.32l-.25.21Zm28.41,0,.24-.21-.24-.21,25.52-21.75,25.76,22-25.76,22Z"/><polygon class="${color}${random}CL" points="110.94 40.45 93.9 0 76.86 40.45 93.9 55.02 110.94 40.45"/><polygon class="${color}${random}CL" points="76.86 141.51 93.9 181.96 110.94 141.51 93.9 126.94 76.86 141.51"/></g></g></svg>`
  }
}

let color_edition = {
  black: coloured_edition_svgs(`black`, 20, 20),
  white: coloured_edition_svgs(`white`, 20, 20)
}

// Originals
let alpha_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.53 31.79"><defs><style>.a{fill:#fff;}</style></defs><title>icon_alpha</title><polygon class="a" points="10.77 0 0 31.79 7.76 31.79 10.77 22.92 13.77 31.79 21.53 31.79 10.77 0"/></svg>`;
let beta_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.03 31.79"><defs><style>.a{fill:#fff;}</style></defs><title>icon_beta</title><polygon class="a" points="6.25 13.43 14.75 8.52 0 0 0 5.96 4.43 8.52 0 11.07 0 15.78 8.7 20.8 0 25.83 0 31.79 19.03 20.8 6.25 13.43"/></svg>`;
let promo_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.03 31.71"><defs><style>.a{fill:#fff;}</style></defs><title>icon_promo</title><polygon class="a" points="19.03 11.19 0 0 0 6.28 8.5 11.19 0 16.1 0 16.7 0 22.38 0 31.7 6 31.7 6 18.85 19.03 11.19"/></svg>`;
let reward_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.37 31.71"><defs><style>.cls-1{fill:#fff;}</style></defs><title>icon_reward</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon class="cls-1" points="20.37 31.7 11.19 15.8 19.03 11.19 0 0 0 6.28 8.5 11.19 0 16.1 0 16.7 0 22.38 0 31.7 6 31.7 6 18.85 6.02 18.84 13.44 31.7 20.37 31.7"/></g></g></svg>`;
let dice_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32.08"><defs><style>.cls-1{fill:#fff;}.cls-2{fill:none;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon class="cls-1" points="7.98 32.08 7.98 23.39 15.33 16.04 7.98 8.69 7.98 0 24.02 16.04 8.02 32.04 7.98 32.08"/><rect class="cls-2" y="0.04" width="32" height="32"/></g></g></svg>`;
let gladius_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 90 180"><defs><style>.cls-1{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{fill:#fff;}</style><clipPath id="clip-path" transform="translate(-55.83 -10.83)"><rect class="cls-1" width="201.66" height="201.66"/></clipPath></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g class="cls-2"><polygon class="cls-3" points="33.77 33.77 90 33.77 90 0 33.77 0 0 0 0 33.77 0 146.23 0 180 33.77 180 56.23 180 90 180 90 146.23 90 90 56.23 90 56.23 146.23 33.77 146.23 33.77 33.77"/></g></g></g></svg>`;
let untamed_svg = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#fff;}</style></defs><title>icon_untamed_square</title><polygon class="cls-1" points="28.14 4.89 28.14 37.57 21.86 37.57 21.86 4.89 14.32 4.89 14.32 37.57 14.32 45.11 21.86 45.11 28.14 45.11 35.68 45.11 35.68 37.57 35.68 4.89 28.14 4.89"/></svg>`;
let chaos_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187.8 181.96"><defs><style>.cls-1{fill:#fff;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M133.63,45.36,93.9,79.22,54.18,45.36,0,91.53l54.18,46.18L93.9,103.85l39.73,33.86L187.8,91.53ZM79.7,91.74,54.18,113.49l-25.77-22,25.77-22L79.7,91.32l-.25.21Zm28.41,0,.24-.21-.24-.21,25.52-21.75,25.76,22-25.76,22Z"/><polygon class="cls-1" points="110.94 40.45 93.9 0 76.86 40.45 93.9 55.02 110.94 40.45"/><polygon class="cls-1" points="76.86 141.51 93.9 181.96 110.94 141.51 93.9 126.94 76.86 141.51"/></g></g></svg>`

let common_svg = `<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
    <title>btn_rarity_common_on</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="btn_rarity_common_on" transform="translate(-10.000000, -10.000000)" fill-rule="nonzero">
            <g id="Rectangle_111" fill="#464646" fill-opacity="0">
                <rect id="Rectangle-path" x="0" y="0" width="37.8" height="37.8" rx="5"></rect>
            </g>
            <circle id="Ellipse_22" fill="#BFD1DA" cx="18.756" cy="18.756" r="8.756"></circle>
        </g>
    </g>
</svg>`;
let rare_svg = `<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
    <title>btn_rarity_rare_on</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="btn_rarity_rare_on" transform="translate(-11.000000, -10.000000)" fill-rule="nonzero">
            <g id="Rectangle_112" fill="#1C3264" fill-opacity="0">
                <rect id="Rectangle-path" x="0" y="0" width="37.8" height="37.8" rx="5"></rect>
            </g>
            <circle id="Ellipse_23" fill="#7AC2FF" cx="19.756" cy="18.756" r="8.756"></circle>
        </g>
    </g>
</svg>`;
let epic_svg = `<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
    <title>btn_rarity_epic_on</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="btn_rarity_epic_on" transform="translate(-10.000000, -10.000000)" fill-rule="nonzero">
            <g id="Rectangle_113" fill="#2B003D" fill-opacity="0">
                <rect id="Rectangle-path" x="0" y="0" width="37.8" height="37.8" rx="5"></rect>
            </g>
            <circle id="Ellipse_24" fill="#CA6EEB" cx="18.756" cy="18.756" r="8.756"></circle>
        </g>
    </g>
</svg>`;
let legendary_svg = `<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
    <title>btn_rarity_legendary_on</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="btn_rarity_legendary_on" transform="translate(-10.000000, -10.000000)" fill-rule="nonzero">
            <g id="Rectangle_114" fill="#382B00" fill-opacity="0">
                <rect id="Rectangle-path" x="0" y="0" width="37.8" height="37.8" rx="5"></rect>
            </g>
            <circle id="Ellipse_25" fill="#F3C059" cx="18.756" cy="18.756" r="8.756"></circle>
        </g>
    </g>
</svg>`;

let fire_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14.511" height="19.095" viewBox="0 0 14.511 19.095"><defs><style>.a{fill:url(#a);}</style><radialGradient id="a" cx="0.5" cy="0.856" r="0.72" gradientTransform="matrix(0.105, -0.997, 1.168, 0.071, -0.552, 1.294)" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#ffa279"/><stop offset="1" stop-color="#ff0010"/></radialGradient></defs><path class="a" d="M13.752,208.967a2.9,2.9,0,0,1-1.657,2.563c1.272-2.283-.515-5.517-2.059-6.349a2.948,2.948,0,0,1-1.642-3.642c-1.659,1.562.315,2.231,1.5,5.593a3.421,3.421,0,0,1-1.742,4.461c1.287-1.391,1.119-3.482-.579-4.064-1.1-.376-4.256-2.329-3.149-3.911A6.809,6.809,0,0,0,5.3,199.65c0,1.754-2.876,2.531-3.034,4.141s2.229,2.243,2.631,3.681-1.165,2.507-2.372,2.933a3.068,3.068,0,0,0-2.516,3.221c-.158,2.631,3.336,2.9,4.314,3.681s.748,1.438.748,1.438a1.291,1.291,0,0,1,1.153-.424,8.343,8.343,0,0,0,6.554-1.129C15.995,214.949,13.752,208.967,13.752,208.967ZM6.5,217.882s.2-.906-1.078-.259a3.391,3.391,0,0,0-.82-2.761c-1.107-1.078-1.869-2.732-.733-3.106s2.674-.345,2.8-1.725c0,0,.546,2.459-.561,3.451s.216,2.027.216,2.027a1.048,1.048,0,0,1,.3.733v.23s1.346.143,1.251-1.093c-.216-2.8.834-4.141,3.106-4.357,0,0-2.387.536-2.718,4.443-.086,1.021.489.719-.216,1.682,0,0,2.631-.82,3.58-2.674,0,0,.345,4.084-5.133,3.408Z" transform="translate(0 -199.65)"/></svg>`;
let water_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16.929" height="20.519" viewBox="0 0 16.929 20.519"><defs><style>.a{fill:url(#a);}</style><radialGradient id="a" cx="0.5" cy="0.119" r="0.787" gradientTransform="matrix(-0.27, 0.975, -1.215, -0.229, 0.78, -0.341)" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#9bfaff"/><stop offset="1" stop-color="#00b3be"/></radialGradient></defs><path class="a" d="M30.637,120.748a2.383,2.383,0,0,0,.019-.3,2.423,2.423,0,0,0-2.259-2.418,2.426,2.426,0,0,0-2.954-1.679,2.422,2.422,0,0,0-2.06-1.147,2.46,2.46,0,0,0-.369.028h0c-.138.031-.275.064-.411.1h0a2.4,2.4,0,0,0-.4.18l-.059-.045a2.424,2.424,0,0,0-3.8,1.435,2.348,2.348,0,0,1-.046.31q-.009.1-.009.207a2.414,2.414,0,0,0,.018.292q-.214.2-.415.406a2.457,2.457,0,0,1-.374.408,10.27,10.27,0,0,0,9.729,16.8,6.347,6.347,0,0,1-.149-12.272,2.424,2.424,0,1,0,3.551-2.31Zm-7.693,13.326c-11.866-7.67-3.3-14.376-3.3-14.376-5.916,7.739,3.3,14.376,3.3,14.376-9.974-8.977-.619-14.548-.619-14.548-7.016,7.257.619,14.548.619,14.548s-7.429-8.22,1.307-12.932C24.252,121.142,17.854,126.645,22.945,134.074Z" transform="translate(-15 -114.999)"/></svg>`;
let earth_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="19.44" height="17.457" viewBox="0 0 19.44 17.457"><defs><style>.a{fill:url(#a);}</style><radialGradient id="a" cx="0.722" cy="0.23" r="0.993" gradientTransform="matrix(-0.579, 0.776, -0.712, -0.631, 1.303, -0.185)" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#aaff9a"/><stop offset="1" stop-color="#1ba200"/></radialGradient></defs><path class="a" d="M16.2,42.382s-.35.048-.835.063q-.121.07-.25.142a31.331,31.331,0,0,0-2.668,1.665c.817.659,1.8,2.295,1.78,6.355,0,0-.489-4.049-3.129-5.367-.813.627-1.57,1.269-2.271,1.908a8.794,8.794,0,0,1-.382,6.2c.5-3.28-.13-4.695-.6-5.27a35.542,35.542,0,0,0-5.271,6.444,54.452,54.452,0,0,1,3.3-5.8Q6.435,47.848,7,47.07c-1.078-1.411-3.935-.384-3.962-.374a3.933,3.933,0,0,1,4.53-.385A33.848,33.848,0,0,1,9.8,43.7c-.356-2.069-3.2-2.016-3.2-2.016,1.81-.809,3.417.367,4.149,1.058.626-.608,1.212-1.123,1.736-1.554q0-.051,0-.105s-3.091-4.822-7.786-.352a12.6,12.6,0,0,0-2.67,8.226A10.2,10.2,0,0,1,0,56.232s5,.763,14.124-3.4S18.31,42.265,16.2,42.382Z" transform="translate(0 -38.83)"/></svg>`;
let life_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24.88" height="24.827" viewBox="0 0 24.88 24.827"><defs><style>.a{fill:url(#a);}</style><radialGradient id="a" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c9c9c9"/></radialGradient></defs><path class="a" d="M24.88,12.445l-4.718-.781a7.83,7.83,0,0,0-6.966-7.1L12.44,0l-.753,4.548a7.829,7.829,0,0,0-7.139,7.144L0,12.445l4.565.756a7.83,7.83,0,0,0,7.1,6.96l.778,4.666.781-4.683a7.831,7.831,0,0,0,6.923-6.915Zm-5.019-.831-3.868-.641,1.817-3.821a7.519,7.519,0,0,1,2.052,4.462ZM17.735,7.075,13.912,8.892l-.666-4.026A7.525,7.525,0,0,1,17.735,7.075Zm-6.1-2.226-.669,4.044L7.031,7.021A7.522,7.522,0,0,1,11.637,4.849ZM7.015,7.036l1.872,3.937-4.039.669A7.522,7.522,0,0,1,7.015,7.036ZM4.867,13.251l4.02.666L7.073,17.733A7.526,7.526,0,0,1,4.867,13.251Zm2.287,4.56L10.968,16l.644,3.863a7.518,7.518,0,0,1-4.458-2.049Zm6.117,2.031L13.912,16l3.7,1.76A7.523,7.523,0,0,1,13.271,19.842Zm4.481-2.223-1.76-3.7,3.848-.637a7.523,7.523,0,0,1-2.088,4.339Z"/></svg>`;
let death_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18.785" height="19.098" viewBox="0 0 18.785 19.098"><defs><style>.a{fill:url(#a);}</style><radialGradient id="a" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#e784ff"/><stop offset="1" stop-color="#9b00e0"/></radialGradient></defs><path class="a" d="M13.948.933,12.7,2.574l-2.191.1L9.462,4.557l.626-2.435,1.6-.244.3-1.59A11.707,11.707,0,0,0,9.392,0C4.205,0,0,3.333,0,7.444a6.963,6.963,0,0,0,3.427,5.75l1.252,3.747,1.687.383.921-2.694.54,4.086,1.635.383.133-4.509,1.259,4.439,1.565-.9.293-3.535.716,2.561,2.372-2.4.189-2.006a6.766,6.766,0,0,0,2.8-5.3C18.785,4.643,16.832,2.2,13.948.933ZM4.324,8.718s-3.068.052-1.456-3.9a5.812,5.812,0,0,1,3.9,1.352C8.224,7.626,8.276,8.614,9,8.562a3.4,3.4,0,0,1-1.872,0,7.1,7.1,0,0,0-2.808.156Zm5.358,3.309A7.349,7.349,0,0,0,7.263,13.68s1.3-2.714,2.419-3.245c0,0,1.829,1.475,2.006,2.36a16.444,16.444,0,0,0-2.006-.767Zm4.778-3.309a7.1,7.1,0,0,0-2.808-.156,3.4,3.4,0,0,1-1.872,0c.728.052.78-.936,2.236-2.392a5.812,5.812,0,0,1,3.9-1.352c1.612,3.951-1.456,3.9-1.456,3.9Z"/></svg>`;
let dragon_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18.914" height="18.169" viewBox="0 0 18.914 18.169"><defs><style>.a{fill:url(#a);}</style><radialGradient id="a" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#fff8a3"/><stop offset="1" stop-color="#ffb100"/></radialGradient></defs><path class="a" d="M62.187,60.125c-2.354,7.4-3.71,11.114-3.71,11.114C56.548,65.1,58.213,60.7,60.21,57.913a37.454,37.454,0,0,0-4.446-4.173,9.72,9.72,0,1,0,14,11.6C67.776,64.866,65.256,63.423,62.187,60.125Z" transform="translate(-50.847 -53.74)"/></svg>`;
let neutral_svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22.89" height="19.96" viewBox="0 0 22.89 19.96"><defs><style>.a{fill:url(#a);}</style><radialGradient id="a" cx="0.5" cy="0.5" r="0.641" gradientTransform="matrix(0.644, -0.675, 0.588, 0.738, -0.116, 0.468)" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#b4d1ff"/><stop offset="1" stop-color="#4d6ea0"/></radialGradient></defs><path class="a" d="M22.667,17.771l-.8-.806a.8.8,0,0,0-1.117,0l-2.588-4.054L19.8,11.27a.717.717,0,0,0,.166-.971l-1.11-1.11a.723.723,0,0,0-.974.163l-.551.554a3.6,3.6,0,0,1-.616,2.329L14.222,8.9l5.085-3.8L19.962,0l-5.1.653L11.451,5.209,8.04.653,2.94,0l.653,5.1L8.68,8.9l-2.5,3.335a3.6,3.6,0,0,1-.616-2.329l-.554-.554a.719.719,0,0,0-.972-.163L2.93,10.3a.72.72,0,0,0,.163.971l1.641,1.641L2.156,16.955a.8.8,0,0,0-1.117,0l-.806.816a.8.8,0,0,0,0,1.13l.826.828a.808.808,0,0,0,1.132,0l.8-.806A.8.8,0,0,0,3.007,17.8l4.044-2.581,1.641,1.639a.717.717,0,0,0,.972.166l1.11-1.11a.718.718,0,0,0-.166-.971l-.551-.554a3.6,3.6,0,0,1-2.329-.616l3.723-2.788,3.723,2.788a3.6,3.6,0,0,1-2.319.616l-.554.554a.719.719,0,0,0-.163.971l1.11,1.11a.718.718,0,0,0,.972-.166l1.641-1.639L19.9,17.8a.8.8,0,0,0,0,1.117l.806.806a.8.8,0,0,0,1.13,0l.826-.828A.8.8,0,0,0,22.667,17.771Z" transform="translate(-0.001)"/></svg>`;