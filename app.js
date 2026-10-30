// 작성일시: 2026-10-30 11:07

const STORAGE_KEY = "shopping-list-items";

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const list = document.getElementById("item-list");
const emptyMessage = document.getElementById("empty-message");
const summary = document.getElementById("summary");
const clearCheckedButton = document.getElementById("clear-checked");

// localStorage에서 목록을 불러옴 (사용 불가하거나 데이터가 깨졌으면 빈 목록)
function loadItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 저장 실패 시에도 화면 동작은 유지
  }
}

let items = loadItems();

function createItemElement(item) {
  const li = document.createElement("li");
  li.className = "item" + (item.checked ? " checked" : "");
  li.dataset.id = item.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.checked;
  checkbox.id = `item-${item.id}`;

  // label로 감싸서 이름을 클릭해도 체크되도록 함
  const name = document.createElement("label");
  name.className = "item-name";
  name.htmlFor = checkbox.id;
  name.textContent = item.name;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "×";
  deleteButton.title = "삭제";
  deleteButton.setAttribute("aria-label", `${item.name} 삭제`);

  li.append(checkbox, name, deleteButton);
  return li;
}

function render() {
  list.replaceChildren(...items.map(createItemElement));

  const checkedCount = items.filter((item) => item.checked).length;
  emptyMessage.hidden = items.length > 0;
  summary.textContent = items.length
    ? `전체 ${items.length}개 · 완료 ${checkedCount}개`
    : "";
  clearCheckedButton.disabled = checkedCount === 0;
}

function update() {
  saveItems();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  items.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, checked: false });
  input.value = "";
  input.focus();
  update();
});

// 체크/삭제는 목록에 이벤트 위임으로 처리
list.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") return;
  const id = event.target.closest(".item").dataset.id;
  const item = items.find((entry) => entry.id === id);
  if (item) item.checked = event.target.checked;
  update();
});

list.addEventListener("click", (event) => {
  if (!event.target.classList.contains("delete-button")) return;
  const id = event.target.closest(".item").dataset.id;
  items = items.filter((entry) => entry.id !== id);
  update();
});

clearCheckedButton.addEventListener("click", () => {
  items = items.filter((item) => !item.checked);
  update();
});

render();
