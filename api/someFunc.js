const { query } = require('./db');

async function checkUserExists(email) {
    try {
        const sql = `SELECT * FROM users WHERE email = '${email}'`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.error('Ошибка при проверке наличия пользователя в бд', err);
        return false;
    }
}

async function checkUserID(id) {
    try {
        const sql = `SELECT * FROM users WHERE id_user = '${id}'`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.error('Ошибка при проверке наличия пользователя в бд', err);
        return false;
    }
}


function buildCategoryHTML(categories) {
    let html = '<ul>';
    categories.forEach(category => {
        html += '<li class="menu-item">';
        if (category.link) {
            html += `<a href="${category.link}">${category.name}</a>`;
        } else {
            html += `<label class="a-label__chevron" for="item-${category.name.replace(/\s+/g, '-').toLowerCase()}">${category.name}</label>`;
            html += `<input type="checkbox" id="item-${category.name.replace(/\s+/g, '-').toLowerCase()}" name="item-${category.name.replace(/\s+/g, '-').toLowerCase()}" class="m-menu__checkbox">`;
            html += '<div class="m-menu">';
            html += `<div class="m-menu__header">`;
            html += `<label class="m-menu__toggle" for="item-${category.name.replace(/\s+/g, '-').toLowerCase()}">`;
            html += `<svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs">`;
            html += `<path d="M19 12H6M12 5l-7 7 7 7"/>`;
            html += `</svg>`;
            html += `</label>`;
            html += `<p>${category.name}</p>`;
            html += `</div>`;
            html += '<ul>';
            html += buildCategoryHTML(category.submenu);
            html += '</ul>';
            html += '</div>';
        }
        html += '</li>';
    });
    html += '</ul>';
    return html;
}


module.exports = { checkUserExists, checkUserID, buildCategoryHTML };