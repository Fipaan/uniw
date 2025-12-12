const BASE_CLASS_SUFFIX = "BaseClass";
const      CLASS_SUFFIX = "Class";
const BASE_CLASS_NAV    = "navState";

function getIdByBaseClass(baseClass) {
    if (!baseClass.endsWith(BASE_CLASS_SUFFIX)) return null;
    return baseClass.substring(0, baseClass.length - BASE_CLASS_SUFFIX.length);
}
function getBaseClassById(id) {
    if (typeof(id) != "string") id = id.id;
    return localStorage.getItem(`${id}${BASE_CLASS_SUFFIX}`);
}
function getClassById(id) {
    if (typeof(id) != "string") id = id.id;
    return localStorage.getItem(`${id}${CLASS_SUFFIX}`);
}
function restoreCache() {
    for (let i = 0; i < localStorage.length; i++) {
        const baseClassName = localStorage.key(i);
        const id = getIdByBaseClass(baseClassName);
        if (id == null) continue;
        const actualClass = getClassById(id);
        if (actualClass == null) continue;
        const idObj = document.getElementById(id);
        if (idObj == null) continue;
        const baseClass = localStorage.getItem(baseClassName);
        updateClassById(id, baseClass, actualClass, false);
    }
}
function updateClassById(id, baseClass, newClass, isUser) {
    let actualId = id;
    if (typeof(id) == "string") actualId = document.getElementById(id);
    actualId.classList.forEach(cls => {
        if (cls.startsWith(baseClass)) {
            actualId.classList.remove(cls);
        }
    });
    actualId.classList.add(newClass);
    if (isUser == undefined || isUser) {
        localStorage.setItem(`${actualId.id}${BASE_CLASS_SUFFIX}`, baseClass);
        localStorage.setItem(`${actualId.id}${CLASS_SUFFIX}`,      newClass);
    }
}

function getNav() {
    const navId = "navEntriesNav";
    const nav = document.getElementById(navId);
    if (nav == null) throw new Error(`Unknown id: ${navId}`);
    return nav;
}
function navAriaReset(id) {
    const nav = getNav();
    const currClass = getClassById(id);
    if (currClass == `${BASE_CLASS_NAV}Enabled`) {
        nav.ariaHidden = "true";
    } else {
        nav.ariaHidden = "false";
    }
}
function switchNav(id, isUser) {
    const prevClass = getClassById(id);
    let newClass = `${BASE_CLASS_NAV}Enabled`;
    if (prevClass == newClass) {
        newClass = `${BASE_CLASS_NAV}Disabled`;
    }
    updateClassById(id, BASE_CLASS_NAV, newClass, isUser);
    navAriaReset(id);
}

function main() {
    restoreCache();
    navAriaReset(body);
}
