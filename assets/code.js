/* eslint-disable no-new */
/* eslint-disable class-methods-use-this */
const addButton = document.querySelector('.addButton');
const input = document.querySelector('.input');
const container = document.querySelector('.container');

class item {
  constructor(itemName) {
    this.createDiv(itemName);
  }

  createDiv(itemName) {
    // eslint-disable-next-line no-shadow
    const input = document.createElement('input');
    input.value = itemName;
    input.disabled = true;
    input.classList.add('item_input');
    input.type = 'text';

    const itemBox = document.createElement('div');
    itemBox.classList.add('item');

    const editButton = document.createElement('button');
    editButton.innerHTML = 'EDIT';
    editButton.classList.add('editButton');

    const removeButton = document.createElement('button');
    removeButton.innerHTML = 'REMOVE';
    removeButton.classList.add('removeButton');

    container.appendChild(itemBox);

    itemBox.appendChild(input);
    itemBox.appendChild(editButton);
    itemBox.appendChild(removeButton);

    editButton.addEventListener('click', () => this.edit(input));

    removeButton.addEventListener('click', () => this.remove(itemBox, input.value));
  }

  // eslint-disable-next-line class-methods-use-this
  async edit(input) {
    // eslint-disable-next-line no-alert
    const newInput = prompt('Enter new msg:', input);
    input.value = newInput;
    await fetch('/api/modify', {
      method: 'POST',
      body: JSON.stringify({ old: input.value, new: newInput }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async remove(item, value) {
    container.removeChild(item);
    await fetch('/api/delete', {
      method: 'POST',
      body: JSON.stringify({ record: value }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

async function check() {
  if (input.value != '') {
    new item(input.value);

    await fetch('/api/create', {
      method: 'POST',
      body: JSON.stringify({ record: input.value }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    input.value = '';
  }
}

async function boot() {
  const records = await fetch('/api/get').then((t) => t.json());
  records.forEach(({ record }) => {
    new item(record);
  });
}

boot();

addButton.addEventListener('click', check);

window.addEventListener('keydown', (e) => {
  if (e.which == 13) {
    check();
  }
});
