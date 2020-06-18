// Storage controller
const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items;
      //  check if any item is in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        // push new item
        items.push(item);
        // set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get what is already in the ls
        items = JSON.parse(localStorage.getItem("items"));
        // Push new item
        items.push(item);
        // reset ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();
// Item controller
const ItemCtrl = (function () {
  //    Item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //  Data structure /state
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);
      // Create new item
      newItem = new Item(ID, name, calories);
      // Add to items Array
      data.items.push(newItem);

      return newItem;
    },
    getItemsById: function (id) {
      let found = null;
      // loop throught items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // calories to number
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });
      // get index
      const index = ids.indexOf(id);
      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      // loop through items and add calories
      data.items.forEach(function (item) {
        total += item.calories;
      });
      // set total cal in data structure
      data.totalCalories = total;
      // return total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI controller

const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += ` <li class="collection-item" id="item-${item.id}">
                 <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                 <a href="#" class="
                 secondary-content">
                   <i class="edit-item fa fa-pencil"></i>
                 </a>
               </li>`;
      });
      //  insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // add class
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `  <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
       <a href="#" class="
       secondary-content">
         <i class="edit-item fa fa-pencil"></i>
       </a> `;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="
          secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // tuen node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App controller

const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // load event listeners
  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item Event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete button event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // clear button event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  // add item submit
  const itemAddSubmit = function (e) {
    // get form input from ui controller
    const input = UICtrl.getItemInput();

    // check fot name and calories
    if (input.name !== "" && input.calories !== "") {
      //   add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add items to UI list
      UICtrl.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      // store in local storage
      StorageCtrl.storeItem(newItem);
      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split("-");
      // get the actual number
      const id = parseInt(listIdArr[1]);
      // get item
      const itemToEdit = ItemCtrl.getItemsById(id);
      console.log(itemToEdit);
      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = function (e) {
    // get item input
    const input = UICtrl.getItemInput();
    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to ui
    UICtrl.showTotalCalories(totalCalories);
    // update local storage
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();

    e.preventDefault();
  };

  //  Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current item

    const currentItem = ItemCtrl.getCurrentItem();

    // // Delete from data structure
    // ItemCtrl.deleteItem(clientInformation);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);
    ItemCtrl.deleteItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
    e.preventDefault();
  };

  const clearAllItemsClick = function () {
    // delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // remove from UI
    UICtrl.removeItems();

    //  Clear from ls
    StorageCtrl.clearItemsFromStorage();

    // hide list
    UICtrl.hideList();
  };

  //  public methods
  return {
    init: function () {
      // clear edit state
      UICtrl.clearEditState();
      //   fetch items from data structure
      const items = ItemCtrl.getItems();
      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //   populate list with items
        UICtrl.populateItemList(items);
      }
      //  get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      // load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// initialize App
AppCtrl.init();
